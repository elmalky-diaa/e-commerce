import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
  WritableSignal,
} from '@angular/core';
import { AddressService } from '../../core/services/address/address.service';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-user-address',
  styleUrl: './user-address.component.css',
  templateUrl: './user-address.component.html',
})
export class UserAddressComponent implements OnInit {
  private readonly addressService = inject(AddressService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly fb = inject(FormBuilder);
  userData = computed(() => this.addressService.userAddress());
  isModalOpen = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  constructor() {
    effect(() => {
      console.log('User Addresses:', this.userData());
    });
  }

  addressForm = this.fb.group({
    name: ['', [Validators.required]],
    details: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    city: ['', [Validators.required]],
  });
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.addressService.getUserAddress();
    }
  }
  removeAddress(addressId: string) {
    this.addressService.removeAddress(addressId).subscribe({
      next: (res) => {
        this.addressService.getUserAddress();
      },
    });
  }

  openModal(): void {
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.addressForm.reset();
  }

  submitAddress(): void {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.addressService.addAddress(this.addressForm.value).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.closeModal();
        this.addressService.getUserAddress();
      },
      error: (err) => {
        console.log(err);
        this.isLoading.set(false);
      },
    });
  }
}
