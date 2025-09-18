import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { AuthInterceptor } from './services/auth.interceptor';

import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';


import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
// Import plugin module for its side-effect (registers Chart.js plugin once)
import './charts/doughnut-plugin';

export const appConfig: ApplicationConfig = {
	providers: [
		provideAnimationsAsync(),
		provideRouter(routes),
		provideHttpClient(withInterceptorsFromDi()),
		provideCharts(withDefaultRegisterables()),
		providePrimeNG({
			theme: {
				preset: Aura,
				options: {
					darkModeSelector: false || 'none',
				}
			}
		}),
		{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
	]
};
