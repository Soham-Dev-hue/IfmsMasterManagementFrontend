import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';  // Correct import for animations

import { routes } from './app.routes';
import { AuthService } from './service/auth/auth.service';
import { NgxPermissionsModule, NgxRolesService } from 'ngx-permissions';
import { AuthTokenService } from './service/auth/auth-token.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ApiInterceptor } from './core/interceptor/api.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations() , // Adding animations provider
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
    importProvidersFrom(NgxPermissionsModule.forRoot(),
    HttpClientModule),
    {
      provide: APP_INITIALIZER,
      useFactory: (authTokenService: AuthTokenService, rolesService: NgxRolesService) => function () {
        return authTokenService.loadRolesAndPermissions().subscribe((role) => {
          if (role != null) {
            rolesService.addRoleWithPermissions(role.name, role.permissions);
          }
        })
      },
      deps: [AuthTokenService, NgxRolesService],
      multi: true
    },
  ]
};
