import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthTokenService } from './auth-token.service';

// import { NgxPermissionsService } from 'ngx-permissions';
// import { environment } from 'src/environments/environment';
import { IJwtToken, IUserDetails } from '../../models/jwt-token';
import { NgxPermissionsService } from 'ngx-permissions';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private apiUrl = environment.BaseURL;
    constructor(
        private router: Router,
        private authTokenService: AuthTokenService,
        private ngxPermissionsService: NgxPermissionsService,
        private http: HttpClient,
    ) {
        this.getUserDetails();
    }
    userLogout() {
        this.clearAll();
        // window.self.close();
        this.router.navigate(['/login']);
        // window.location.href = environment.loginUrl;
    }
    clearAll() {
        this.authTokenService.destroyToken();
        this.ngxPermissionsService.flushPermissions();
    }
    // below code for arrays
    // getUserDetails(): IUserDetails {
    //
    //   const token: IJwtToken | null = this.authTokenService.getDecodeToken();
    //   if (token != null) {
    //     console.log('Decoded Token:', token);

    //     let userDetails: IUserDetails = {
    //       id: parseInt(token.nameid),
    //       name: token.name,
    //       role: token.role,
    //       level: token.level,
    //       scope: token.scope,
    //     };
    //     console.log('User Details:', userDetails);
    //     if (token.permissions && Array.isArray(token.permissions)) {
    //       token.permissions.forEach((permission: string) => {
    //         this.ngxPermissionsService.addPermission(permission); // Add each permission
    //       });
    //     }
    //     return userDetails;
    //   }{
    //     console.log("token undefined");

    //   }
    //   return {} as IUserDetails;
    // }
    // below code for both arrays and strings
    //   getUserDetails(): IUserDetails {
    //     const token: IJwtToken | null = this.authTokenService.getDecodeToken();
    //     if (token != null) {
    //         console.log('Decoded Token:', token);

    //         let userDetails: IUserDetails = {
    //             id: parseInt(token.nameid),
    //             name: token.name,
    //             role: token.role,
    //             level: token.level,
    //             scope: token.scope,
    //         };

    //         console.log('User Details:', userDetails);

    //         if (Array.isArray(token.permissions)) {
    //             token.permissions.forEach((permission: string) => {
    //                 this.ngxPermissionsService.addPermission(permission);
    //             });
    //         } else {
    //             console.warn('Permissions are not an array:', token.permissions);
    //         }
    //         return userDetails;
    //     } else {
    //         console.log("Token is undefined");
    //     }
    //     return {} as IUserDetails;
    // }
    // below code for only strings
    getUserDetails(): IUserDetails {
        const token: IJwtToken | null = this.authTokenService.getDecodeToken();
        if (token) {
            // console.log('Decoded Token:', token);

            const userDetails: IUserDetails = {
                id: parseInt(token.nameid),
                name: token.name,
                role: token.role,
                level: token.level,
                scope: token.scope,
            };

            // console.log('User Details:', userDetails);

            // token.permissions.forEach((permission: string) => {
            //     this.ngxPermissionsService.addPermission(permission);
            // });

         if (Array.isArray(token.permissions)) {
            token.permissions.forEach((permission: string) => {
                this.ngxPermissionsService.addPermission(permission);
            });
        } else {
            console.warn('Permissions are not an array:', token.permissions);
        }
            return userDetails;
        } else {
            console.log('Token is undefined');
            return {} as IUserDetails;
        }
    }

    isLoggedin() {
        const token = localStorage.getItem('WBIfmsMasterManagement-jwtToken');
        return token !== null && !this.authTokenService.isTokenExpired();
    }
    getScope(): string {
        return this.authTokenService.getScope();
    }

    validateToken(token: string): Observable<any> {
        const headers = new HttpHeaders()
          .set('Authorization', token) // Pass token in Authorization header
          .set('Accept', 'application/json'); // Expect JSON response from the server
    
        return this.http.get<any>(`${this.apiUrl}v1/Auth/Login`, { headers });
    }

}
