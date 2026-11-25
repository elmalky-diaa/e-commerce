import { Component, inject, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.component.css',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly cookieService = inject(CookieService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private platformId = inject(PLATFORM_ID);

  loading: WritableSignal<boolean> = signal(false);
  msError: WritableSignal<string> = signal('');
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  login() {
    if (this.loginForm.valid) {
      this.loading.set(true);
      this.msError.set('');
      let formData = this.loginForm.value;
      this.authService.signIn(formData).subscribe({
        next: (res) => {
          // localStorage.setItem('token', res.token);
          this.cookieService.set('token', res.token);

          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('user', JSON.stringify(res.user));
          }

          console.log(res.user);
          this.authService.userName.set(res.user.name);
          this.authService.userEmail.set(res.user.email);
          this.router.navigate(['/']);
          this.loading.set(false);
          this.authService.isLogged.set(true);
        },
        error: (err) => {
          this.msError.set(err.error?.message || 'An error occurred during login.');
          this.loading.set(false);
        },
      });
    } else {
      this.msError.set('Please fill in all required fields correctly.');
    }
  }
}
