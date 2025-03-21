import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, Observable, tap } from 'rxjs';

import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(private router: Router, private spinner: NgxSpinnerService) {}

  intercept(
		request: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		const token = localStorage.getItem('WBIfmsMasterManagement-jwtToken');
		// this.loadingIndeterminate.showLoading();
		this.spinner.show();
		const baseURL = environment.BaseURL;
		if (token) {
			request = request.clone({
				setHeaders: {
				  Authorization: `Bearer ${token}`,
				},
			  });
		}

		return next.handle(request).pipe(
			tap({
				next: (event) => {

					if (event instanceof HttpResponse) {
						// Do something with the successful response
						document.body.classList.remove('gray');
						if (event.body.apiResponseStatus == 401) {
							if (!!event.body.validationResults) {
								// this.notify.error('<ul><li>dafaj</li><li>ikkkkkk</li></ul>');
								let html = "<br>";
								event.body.validationResults.forEach((element: any, index: number) => {
									html += "<br>" + (index + 1) + " : " + element.errorMessage;
								});
								// this.notify.error(html);
							}
							else {
								console.log("errorrrrrrrr");
								
								// this.notify.error(event.body.message);
							}
						}
					}
				},
				error: (error) => {
					console.log(error);

					if (error.status == 401) {
						this.router.navigate(['/login']);
					}
					if (error.status == 0) {
						// this.router.navigate(['/server-down']);
						// alert("Server down !!");    
						// this.notify.warning("Server down !!");


						document.body.classList.add('gray');
						// this.router.navigate(['/login']);
					}
				}
			}),
			finalize(() => {
				// this.loadingIndeterminate.hideLoading();
				this.spinner.hide();
			})
		);
  }
}