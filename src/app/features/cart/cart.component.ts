import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { CartService } from '../../core/services/cart/cart.service';
import { Icart } from '../../core/models/icart.interface';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-cart',
  styleUrl: './cart.component.css',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  cartDetails = signal<Icart>({} as Icart);
  numOfCartItems = signal('0');

  constructor() {
    effect(() => {
      this.cartService.getCount();
    });
  }
  ngOnInit(): void {
    this.getUserCart();
  }

  getUserCart() {
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        this.cartDetails.set(res.data);
        this.numOfCartItems.set(res.numOfCartItems);
        console.log(this.cartDetails());
        console.log(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  clearCart() {
    this.cartService.clearUserCart().subscribe({
      next: (res) => {
        console.log(res.message);
        this.getUserCart();
        this.cartService.getCount();
      },
      error: (err) => {
        console.log(err.message);
      },
    });
  }

  updateCartCount(productId: string, count: number) {
    this.cartService.updateCartProductQuantity(productId, count).subscribe({
      next: (res) => {
        console.log(res);
        this.getUserCart();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  deleteProduct(productId: string) {
    this.cartService.removeProductFromCart(productId).subscribe({
      next: (res) => {
        console.log(res);
        this.getUserCart();
        this.cartService.getCount();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
