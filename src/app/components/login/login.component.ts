import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth/auth.service';
import { AuthTokenService } from '../../service/auth/auth-token.service';
import { NgxRolesService } from 'ngx-permissions';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  token: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private authTokenService: AuthTokenService,
    private ngxRolesService: NgxRolesService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    // API call with token (token passed to this api this.token)
    // response status succes{
    // IsAuthorize=tue
    // } or fail {
    //      IsAuthorize=false
    // Redirect to Login page }}
    if (this.token) {
      this.authService.validateToken(this.token).subscribe((response) => {
        if (response && response?.status === 'ValidToken') {
          this.authTokenService.saveToken(this.token);
          this.ngxRolesService.flushRoles();
          const role = this.authTokenService.getRolesWithPermissions();
          if (role) {
            this.ngxRolesService.addRoleWithPermissions(
              role.name,
              role.permissions
            );
          }
          this.router.navigate(['dashboard']);
        } else {
          this.router.navigate(['login']);
        }
      });
    } else {
      this.router.navigate(['login']);
    }
  }
}
