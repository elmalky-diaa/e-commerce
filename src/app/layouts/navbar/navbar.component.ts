import { Component, computed, effect, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CartService } from '../../core/services/cart/cart.service';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../core/services/auth/auth.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';

@Component({
  imports: [RouterLink],
  selector: 'app-navbar',
  styleUrl: './navbar.component.css',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);

  private readonly cookieService = inject(CookieService);
  private readonly authService = inject(AuthService);
  private readonly wishlistService = inject(WishlistService);
  private readonly cartServices = inject(CartService);

  cartBadge = computed(() => this.cartServices.count());
  wishListBadge = computed(() => this.wishlistService.wishListCount());

  // userName = computed(() => this.authService.userName());
  // userEmail = computed(() => this.authService.userEmail());
  userName = signal('');
  userEmail = signal('');
  private readonly router = inject(Router);
  isLogged = this.authService.isLogged;

  constructor() {
    effect(() => {
      if (this.isLogged() && isPlatformBrowser(this.platformId)) {
        this.cartServices.getCount();
        this.wishlistService.getWishlist();
      }
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      let token = this.cookieService.get('token');
      let userData = localStorage.getItem('user');

      if (token && userData) {
        this.authService.isLogged.set(true);
        let user = JSON.parse(userData);
        this.userName.set(user.name);
        this.userEmail.set(user.email);

        this.cartServices.getCount();
        this.wishlistService.getWishlist();
      } else {
        this.authService.isLogged.set(false);
      }
    }
  }
  signOut() {
    this.cookieService.delete('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
    this.authService.isLogged.set(false);
  }
}
