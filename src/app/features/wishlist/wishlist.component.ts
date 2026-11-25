import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { Iwishlist } from '../../core/models/iwishlist.interface';
import { CartService } from '../../core/services/cart/cart.service';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../core/services/toastr/toast.service';

@Component({
  imports: [RouterLink],
  selector: 'app-wishlist',
  styleUrl: './wishlist.component.css',
  templateUrl: './wishlist.component.html',
})
export class WishlistComponent implements OnInit {
  private readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(CartService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly toastrService = inject(ToastService);
  wishList: WritableSignal<Iwishlist[]> = signal([]);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (!this.cartService.cartDetails().products) {
        this.cartService.getUserCart();
      }
      this.getWishlist();
    }
  }
  getWishlist() {
    this.wishlistService.getLoggedUserWishlist().subscribe({
      next: (res) => {
        console.log(res);
        this.wishList.set(res.data);
        console.log(this.wishList());
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  isProductInCart(productId: string): boolean {
    let products = this.cartService.cartDetails()?.products ?? [];
    return products.some((item: any) => item.product._id === productId);
  }

  addToProduct(productId: string) {
    this.cartService.addProductToCart(productId).subscribe({
      next: (res) => {
        console.log(res);
        this.cartService.getCount();
        this.toastrService.success('Sucsses Added To Card');
        this.getWishlist();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  removeWishList(productId: string) {
    this.wishlistService.removeProductFromWishlist(productId).subscribe({
      next: (res) => {
        console.log(res);

        this.toastrService.success('Product removed');
        this.wishlistService.getWishlist();
        this.getWishlist();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
