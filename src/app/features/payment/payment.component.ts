import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../core/services/order/order.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-payment',
  styleUrl: './payment.component.css',
  templateUrl: './payment.component.html',
})
export class PaymentComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);

  cartId = signal<string>('');

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((param) => this.cartId.set(param.get('id')!));
  }
  checkOut = new FormGroup({
    details: new FormControl(null, Validators.required),
    phone: new FormControl(null, Validators.required),
    city: new FormControl(null, Validators.required),
    paymentMethod: new FormControl('cash', Validators.required),
  });

  submitDetails() {
    if (this.checkOut.valid) {
      const { paymentMethod, ...shippingAddress } = this.checkOut.value;

      if (paymentMethod === 'online') {
        this.orderService.checkoutSession(this.cartId(), shippingAddress).subscribe({
          next: (res) => {
            console.log(res);
            window.open(res.session.url, '_self');
          },
          error: (err) => {
            console.log(err);
          },
        });
      } else if (paymentMethod === 'cash') {
        this.orderService.createCashOrder(this.cartId(), shippingAddress).subscribe({
          next: (res) => {
            console.log(res);
            this.router.navigate(['/allorders']);
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
    }
  }
}
