import { authGuard } from './core/guards/auth-guard';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
    title: 'freshCart : Home',
  },
  {
    path: 'brands',
    loadComponent: () =>
      import('./features/brands/brands.component').then((m) => m.BrandsComponent),
    title: 'freshCart : Brands',
  },
  {
    path: 'cart',
    canActivate: [authGuard],
    loadComponent: () => import('./features/cart/cart.component').then((m) => m.CartComponent),
    title: 'freshCart : Cart',
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./features/categories/categories.component').then((m) => m.CategoriesComponent),
    title: 'freshCart : Categories',
  },
  {
    path: 'categories-details/:id',
    loadComponent: () =>
      import('./features/categories-details/categories-details.component').then(
        (m) => m.CategoriesDetailsComponent,
      ),
    title: 'freshCart : Categories',
  },
  {
    path: 'change-pass',
    loadComponent: () =>
      import('./features/change-pass/change-pass.component').then((m) => m.ChangePassComponent),
    title: 'freshCart : Change Password',
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./features/checkout/checkout.component').then((m) => m.CheckoutComponent),
    title: 'freshCart : Checkout',
  },
  {
    path: 'forget-pass',
    loadComponent: () =>
      import('./features/forget-pass/forget-pass.component').then((m) => m.ForgetPassComponent),
    title: 'freshCart : Forget Password',
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent),
    title: 'freshCart : Login',
  },
  {
    path: 'allorders',
    loadComponent: () =>
      import('./features/allorders/allorders.component').then((m) => m.AllordersComponent),
    title: 'freshCart : Orders',
  },
  {
    path: 'payment/:id',
    canActivate: [authGuard],

    loadComponent: () =>
      import('./features/payment/payment.component').then((m) => m.PaymentComponent),
    title: 'freshCart : Payment',
  },
  {
    path: 'product-details/:id',
    loadComponent: () =>
      import('./features/product-details/product-details.component').then(
        (m) => m.ProductDetailsComponent,
      ),
    title: 'freshCart : Product-Details',
  },
  {
    path: 'register',

    loadComponent: () =>
      import('./features/register/register.component').then((m) => m.RegisterComponent),
    title: 'freshCart : Register',
  },
  {
    path: 'shop',
    loadComponent: () => import('./features/shop/shop.component').then((m) => m.ShopComponent),
    title: 'freshCart : Shop',
  },
  {
    path: 'wishlist',
    loadComponent: () =>
      import('./features/wishlist/wishlist.component').then((m) => m.WishlistComponent),
    title: 'freshCart : Wishlist',
  },
  {
    path: 'address',
    loadComponent: () =>
      import('./features/user-address/user-address.component').then((m) => m.UserAddressComponent),
    title: 'freshCart : Wishlist',
  },
];
