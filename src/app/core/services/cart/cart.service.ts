import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Icart } from '../../models/icart.interface';

@Service()
export class CartService {
  private readonly httpClient = inject(HttpClient);
  count = signal<number>(0);

  addProductToCart(productId: string): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v2/cart`, { productId }).pipe(
      tap((res: any) => {
        this.cartDetails.set(res.data);
        this.count.set(res.numOfCartItems);
      }),
    );
  }
  getLoggedUserCart(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v2/cart`);
  }
  updateCartProductQuantity(productId: string, count: number): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/api/v2/cart/${productId}`, { count });
  }
  removeProductFromCart(productId: string): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}/api/v2/cart/${productId}`);
  }
  clearUserCart(): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}/api/v2/cart`);
  }
  applyCouponToCart(couponName: string): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/api/v2/cart/applyCoupon`, { couponName });
  }
  cartDetails = signal<Icart>({} as Icart);
  getUserCart() {
    this.getLoggedUserCart().subscribe({
      next: (res) => {
        this.cartDetails.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getCount() {
    this.getLoggedUserCart().subscribe({
      next: (res) => {
        this.count.set(res.numOfCartItems);
      },
    });
  }
}
