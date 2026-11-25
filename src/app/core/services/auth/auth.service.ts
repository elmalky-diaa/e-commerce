import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Service()
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly cookieService = inject(CookieService);

  isLogged = signal<boolean>(false);
  userEmail = signal<string | null>('');
  userName = signal<string | null>('');

  checkLoginStatus() {
    this.isLogged.set(!!this.cookieService.get('token'));
  }

  signUp(formdata: object): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/auth/signup`, formdata);
  }
  signIn(formdata: object): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/auth/signin`, formdata);
  }
  forgotPassword(formdata: object): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/auth/forgotPasswords`, formdata);
  }
  verifyResetCode(formdata: object): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/auth/verifyResetCode`, formdata);
  }
  changeMyPassword(formdata: object): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/api/v1/users/changeMyPassword`, formdata);
  }
  resetPassword(formdata: object): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/api/v1/auth/resetPassword`, formdata);
  }
}
