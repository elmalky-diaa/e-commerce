import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Iaddress } from '../../models/iaddress.interface';

@Service()
export class AddressService {
  private readonly httpClient = inject(HttpClient);
  userAddress: WritableSignal<Iaddress[]> = signal([]);

  addAddress(formData: object): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/addresses`, formData);
  }
  removeAddress(addressId: string): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}/api/v1/addresses/${addressId}`);
  }
  getLoggedUserAddresses(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/addresses`);
  }

  getUserAddress() {
    this.getLoggedUserAddresses().subscribe({
      next: (res) => {
        console.log(res);
        this.userAddress.set(res.data);
      },
    });
  }
}
