import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Service()
export class BrandService {
  private readonly httpClient = inject(HttpClient);

  getAllBrands(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/brands`);
  }
}
