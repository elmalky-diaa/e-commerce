import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Iwishlist } from '../../models/iwishlist.interface';

@Service()
export class WishlistService {
  private readonly httpClient = inject(HttpClient);
  wishList: WritableSignal<Iwishlist[]> = signal([]);
  wishListCount = signal<number>(0);

  addProductToWishlist(productId: string): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/wishlist`, { productId });
  }
  removeProductFromWishlist(productId: string): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}/api/v1/wishlist/${productId}`);
  }
  getLoggedUserWishlist(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/wishlist`);
  }

  getWishlist() {
    this.getLoggedUserWishlist().subscribe({
      next: (res) => {
        console.log(res);
        this.wishList.set(res.data);
        console.log(this.wishList());
        this.wishListCount.set(res.count ?? res.data?.length ?? 0);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
