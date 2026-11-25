import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-forget-pass',
  styleUrl: './forget-pass.component.css',
  templateUrl: './forget-pass.component.html',
})
export class ForgetPassComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  currentStep = signal(1);
  errMessage = signal('');
  emailForm: FormGroup = this.fb.group({
    email: ['', [Validators.required]],
  });
  codeForm: FormGroup = this.fb.group({
    resetCode: ['', [Validators.required]],
  });
  newPassForm: FormGroup = this.fb.group({
    newPassword: ['', [Validators.required]],
  });

  submitEmail(): void {
    this.authService.forgotPassword(this.emailForm.value).subscribe({
      next: (res) => {
        console.log(res.message);
        this.errMessage.set(res.message);

        this.currentStep.set(2);
      },
      error: (err) => {
        this.errMessage.set(err.error.message);
        console.log(err.error.message);
        console.log(err);
      },
    });
  }
  submitCode(): void {
    this.authService.verifyResetCode(this.codeForm.value).subscribe({
      next: (res) => {
        this.errMessage.set(res.message);

        console.log(res.message);
        this.currentStep.set(3);
      },
      error: (err) => {
        this.errMessage.set(err.error.message);

        console.log(err.error.message);
      },
    });
  }
  submitNewPass(): void {
    let payload = {
      email: this.emailForm.get('email')?.value,
      newPassword: this.newPassForm.get('newPassword')?.value,
    };
    this.authService.resetPassword(payload).subscribe({
      next: (res) => {
        console.log(res.message);
        this.errMessage.set(res.message);

        this.router.navigateByUrl('login');
      },
      error: (err) => {
        this.errMessage.set(err.error.message);

        console.log(err.error.message);
      },
    });
  }
}
