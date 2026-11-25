import { Component, inject, input, InputSignal, OnInit } from '@angular/core';
import { Iproduct } from '../../../../core/models/iproduct.interface';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../../core/services/cart/cart.service';
import { WishlistService } from '../../../../core/services/wishlist/wishlist.service';
import { ToastService } from '../../../../core/services/toastr/toast.service';

@Component({
  imports: [RouterLink],
  selector: 'app-product-card',
  styleUrl: './product-card.component.css',
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly toastrService = inject(ToastService);

  product: InputSignal<Iproduct> = input.required<Iproduct>();
  readonly stars = [1, 2, 3, 4, 5];

  ngOnInit(): void {
    this.wishlistService.getWishlist();
  }
  addToProduct(productId: string) {
    this.cartService.addProductToCart(productId).subscribe({
      next: (res) => {
        console.log(res);
        this.cartService.getCount();
        this.toastrService.success('Sucsses Added To Card');
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  addToWishlist(productId: string) {
    this.wishlistService.addProductToWishlist(productId).subscribe({
      next: (res) => {
        console.log(res);
        this.wishlistService.getWishlist();
        this.toastrService.success('Sucsses Added To WishList');
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  removeFromWishlist(productId: string) {
    this.wishlistService.removeProductFromWishlist(productId).subscribe({
      next: (res) => {
        console.log(res);
        this.wishlistService.getWishlist();
        this.toastrService.success('Sucsses Remove From WishList');
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  isInWishList(productId: string): boolean {
    return this.wishlistService.wishList().some((item) => item._id === productId);
  }
  toggleWishList(productId: string) {
    if (this.isInWishList(productId)) {
      this.removeFromWishlist(productId);
    } else {
      this.addToWishlist(productId);
    }
  }
}
