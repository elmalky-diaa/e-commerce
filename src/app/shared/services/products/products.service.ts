import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly httpClient = inject(HttpClient);
  GetAllProducts(pageNumber: number = 1, brandId?: string, categoryId?: string): Observable<any> {
    let brand = brandId ? `&brand=${brandId}` : '';
    let categories = categoryId ? `&category[in]=${categoryId}` : '';
    return this.httpClient.get(
      `${environment.baseUrl}/api/v1/products?page=${pageNumber}${brand}${categories}`,
    );
  }
  GetSpecificProduct(productId: string): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/products/${productId}`);
  }
}
