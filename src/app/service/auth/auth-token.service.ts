import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

import { Observable, from, map, of, retry } from 'rxjs';
import { IJwtToken, Role } from '../../models/jwt-token';

@Injectable({
    providedIn: 'root',
})
export class AuthTokenService {
    jwtHelper = new JwtHelperService();
    jwtToken!: IJwtToken | null;
    constructor() { }

    getToken(): string {
        
        return window.localStorage['WBIfmsMasterManagement-jwtToken'];
    }

    saveToken(token: string): void {
        window.localStorage['WBIfmsMasterManagement-jwtToken'] = token;
    }
    // below code for only array 
    // getDecodeToken(): IJwtToken | null {
    // }
    
    destroyToken(): void {
        window.localStorage.removeItem('WBIfmsMasterManagement-jwtToken');
    }


    // getToken(): string {
    //     return window.localStorage['jwtBillToken'];
    // }

    // saveToken(token: string): void {
    //     window.localStorage['jwtBillToken'] = token;
    // }
    // below code for only array 
    // getDecodeToken(): IJwtToken | null {
    //     const token = this.jwtHelper.decodeToken(this.getToken());
    //     console.log("tokentoken",token);
        
    //     if (token) {
    //         // Ensure permissions is an array
    //         if (typeof token.permissions === 'string') {
    //             token.permissions = token.permissions.split(','); // Convert to array if it's a string
    //         }
    //         return this.toLowercaseKeys(token);
    //     }
    //     return null; // Return null if no token
    // }
    // below code for both array and string 
    // getDecodeToken(): IJwtToken | null {
    //     const token = this.jwtHelper.decodeToken(this.getToken());
    //     console.log("Decoded Token:", token);
        
    //     if (token) {
    //         // Ensure permissions is parsed as an array
    //         if (typeof token.permissions === 'string') {
    //             try {
    //                 token.permissions = JSON.parse(token.permissions);
    //             } catch (error) {
    //                 console.error("Error parsing permissions:", error);
    //                 token.permissions = []; // Default to an empty array if parsing fails
    //             }
    //         }
    //         return this.toLowercaseKeys(token);
    //     }
    //     return null; // Return null if no token
    // }
    // below code for only strings 
    getDecodeToken(): IJwtToken | null {
        const token = this.getToken();
        // console.log("Decoded Token:", token);
    
        if (token ) {
            // Ensure permissions is a valid JSON string
            try{
                const decodedToken= this.jwtHelper.decodeToken(token);
                if(decodedToken && typeof decodedToken.permissions === 'string'){
                    try{
                        decodedToken.permissions = JSON.parse(decodedToken.permissions);
                    }catch(error){
                        console.error("Error parsing permissions:", error);
                        decodedToken.permissions = []; // Default to an empty array if parsing fails
                    }
                }
                return this.toLowercaseKeys(decodedToken);
            }catch(error){
                console.error("Invalid token:", error);
                return null;
            }
        }
        return null; // Return null if no token
    }
    
    isTokenExpired(): boolean {
        const token = this.getToken();
        if (token) {
          return this.jwtHelper.isTokenExpired(token); // Uses the jwtHelper to check token expiration
        }
        return true; // If no token, consider it expired
      }
    // destroyToken(): void {
    //     window.localStorage.removeItem('jwtBillToken');
    // }
    // below code for only arrays 
    // getRolesWithPermissions(): Role {
    //     this.jwtToken = this.getDecodeToken();
    //     let role: Role;
    //     if (this.jwtToken != null) {
    //         role = {
    //             name: this.jwtToken.role,
    //             permissions:  this.jwtToken.permissions
    //         }
    //         return role;
    //     }
    //     return {} as Role;
    // }
    // below code for both arrays and strings 
    // getRolesWithPermissions(): Role {
    //     this.jwtToken = this.getDecodeToken();
    //     let role: Role;
    //     if (this.jwtToken != null) {
    //         role = {
    //             name: this.jwtToken.role,
    //             permissions: Array.isArray(this.jwtToken.permissions) ? this.jwtToken.permissions : []
    //         };
    //         return role;
    //     }
    //     return {} as Role;
    // }

     // Convert keys to lowercase
    toLowercaseKeys(obj: any): any {
        if (Array.isArray(obj)) {
            return obj.map(this.toLowercaseKeys);
        } else if (obj !== null && typeof obj === 'object') {
            return Object.entries(obj).reduce((acc, [key, value]) => {
                const newKey = key.charAt(0).toLowerCase() + key.slice(1);
                acc[newKey] = this.toLowercaseKeys(value);
                return acc;
            }, {} as any);
        }
        return obj;
    }

// Extract roles and permissions from the decoded token
    getRolesWithPermissions(): Role {
        const decodedToken = this.getDecodeToken();
        if (decodedToken) {
            return {
                name: decodedToken.role,
                permissions: Array.isArray(decodedToken.permissions) ? decodedToken.permissions : [], // Permissions are guaranteed to be an array by getDecodeToken
            };
        }
        return {} as Role; // Return an empty role if token is invalid
    }
    
    loadRolesAndPermissions(): Observable<Role> {
        return of(this.getRolesWithPermissions());
    }

    getScope(): string {
        const decodedToken = this.getDecodeToken();
        return decodedToken ? decodedToken.scope : '';
    }
}
