import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { authInterceptor } from './core/interceptors/auth-interceptor';
import { AuthService } from './core/services/auth/auth.service';
import { LanguageService } from './core/services/language/language.service';
import { ThemeService } from './core/services/theme/theme.service';
import { TokenStorage } from './core/services/token-storage/token-storage';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideTranslateService({
      loader: provideTranslateHttpLoader({ prefix: '/i18n/', suffix: '.json' }),
    }),
    provideAppInitializer(() => {
      inject(ThemeService);
      inject(LanguageService).init();

      const tokenStorage = inject(TokenStorage);
      const authService = inject(AuthService);
      if (tokenStorage.hasSession()) {
        authService.fetchMe().subscribe({ error: () => undefined });
      }
    }),
  ],
};
