import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Eslatma: bu servis `mediasoup` paketiga bog'liq va Router/Transport/Producer/Consumer
// boshqarishni amalga oshiradi. To'liq ishlashi uchun mediasoup worker'larini ishga
// tushirish va xona (room) boshqaruvini implement qilish kerak.
@Injectable()
export class WebRTCService {
  private routers = new Map<string, any>();

  constructor(private config: ConfigService) {}

  async createRouter(_callId: string) {
    // const router = await worker.createRouter({ mediaCodecs });
    // this.routers.set(callId, router);
    return { codecs: [] };
  }

  async getRouterCapabilities(_callId: string) {
    return { codecs: [] };
  }

  async createTransport(_callId: string, _userId: string, _direction: 'send' | 'recv') {
    return { id: 'transport-stub', iceParameters: {}, iceCandidates: [], dtlsParameters: {} };
  }

  async connectTransport(_transportId: string, _dtlsParameters: any) {
    return;
  }

  async produce(_transportId: string, _kind: string, _rtpParameters: any) {
    return { producerId: 'producer-stub' };
  }

  async consume(_callId: string, _userId: string, _producerId: string, _rtpCapabilities: any) {
    return { id: 'consumer-stub', producerId: _producerId, kind: 'video', rtpParameters: {} };
  }

  async closeRoom(callId: string) {
    this.routers.delete(callId);
  }
}
