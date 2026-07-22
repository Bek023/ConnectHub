import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiEndpoints } from '../api/api-endpoints';
import { apiGet, apiPost } from '../api/api-envelope';

export type PushState = 'unsupported' | 'denied' | 'off' | 'on';

@Injectable({ providedIn: 'root' })
export class PushService {
  private readonly http = inject(HttpClient);

  readonly state = signal<PushState>('off');
  readonly busy = signal(false);

  get supported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  }

  async refreshState(): Promise<void> {
    if (!this.supported) {
      this.state.set('unsupported');
      return;
    }
    if (Notification.permission === 'denied') {
      this.state.set('denied');
      return;
    }
    const registration = await navigator.serviceWorker.getRegistration();
    const subscription = await registration?.pushManager.getSubscription();
    this.state.set(subscription ? 'on' : 'off');
  }

  async enable(): Promise<void> {
    if (!this.supported || this.busy()) {
      return;
    }
    this.busy.set(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        this.state.set(permission === 'denied' ? 'denied' : 'off');
        return;
      }

      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      const { publicKey } = await firstValueFrom(
        apiGet<{ publicKey: string | null }>(this.http, ApiEndpoints.notifications.pushPublicKey),
      );
      if (!publicKey) {
        this.state.set('off');
        return;
      }

      const existing = await registration.pushManager.getSubscription();
      const subscription =
        existing ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.decodeKey(publicKey),
        }));

      await firstValueFrom(
        apiPost(this.http, ApiEndpoints.notifications.pushRegister, {
          token: JSON.stringify(subscription.toJSON()),
          platform: 'web',
        }),
      );
      this.state.set('on');
    } finally {
      this.busy.set(false);
    }
  }

  async disable(): Promise<void> {
    if (!this.supported || this.busy()) {
      return;
    }
    this.busy.set(true);
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      const subscription = await registration?.pushManager.getSubscription();
      if (subscription) {
        const payload = JSON.stringify(subscription.toJSON());
        await subscription.unsubscribe();
        await firstValueFrom(
          this.http.request('DELETE', ApiEndpoints.notifications.pushUnregister, {
            body: { token: payload },
          }),
        ).catch(() => undefined);
      }
      this.state.set('off');
    } finally {
      this.busy.set(false);
    }
  }

  private decodeKey(base64Url: string): Uint8Array<ArrayBuffer> {
    const padding = '='.repeat((4 - (base64Url.length % 4)) % 4);
    const base64 = (base64Url + padding).replace(/-/g, '+').replace(/_/g, '/');
    const raw = atob(base64);
    const output = new Uint8Array(new ArrayBuffer(raw.length));
    for (let i = 0; i < raw.length; i++) {
      output[i] = raw.charCodeAt(i);
    }
    return output;
  }
}
