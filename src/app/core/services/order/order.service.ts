import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Service()
export class OrderService {
  private readonly httpClient = inject(HttpClient);
  private readonly cookieService = inject(CookieService);

  createCashOrder(cartId: string, data: object): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/orders/${cartId}`, {
      shippingAddress: data,
    });
  }

  checkoutSession(cartId: string, data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/orders/checkout-session/${cartId}?url=${environment.domain}`,
      { shippingAddress: data },
    );
  }
  getAllOrders(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/orders/`);
  }
  getUserOrders(): Observable<any> {
    const token = this.cookieService.get('token');
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.id;
    return this.httpClient.get(`${environment.baseUrl}/api/v1/orders/user/${userId}`);
  }
  //   getUserOrders(): Observable<any> {
  //     return this.httpClient.get(
  //       `${environment.baseUrl}/api/v1/orders/user/6407cf6f515bdcf347c09f17`,
  //     );
  //   }
}
