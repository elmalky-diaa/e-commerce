import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-register',
  styleUrl: './register.component.css',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  registerForm = new FormGroup(
    {
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      rePassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
      phone: new FormControl('', [Validators.required]),
    },
    {},
  );
  register() {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');
      this.successMessage.set('');
      let formData = this.registerForm.value;
      if (formData.password !== formData.rePassword) {
        this.errorMessage.set('Passwords do not match');
        this.isLoading.set(false);
        return;
      }
      this.authService.signUp(formData).subscribe({
        next: (res) => {
          this.successMessage.set(
            'Registration successful! Please check your email to verify your account.',
          );
          this.isLoading.set(false);
          this.registerForm.reset();

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || 'An error occurred during registration.');
          this.isLoading.set(false);
        },
      });
    } else {
      this.errorMessage.set('Please fill in all required fields correctly.');
    }
  }
}
