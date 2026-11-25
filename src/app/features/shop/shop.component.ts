import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ProductsService } from '../../shared/services/products/products.service';
import { Iproduct } from '../../core/models/iproduct.interface';
import { ProductCardComponent } from '../home/components/product-card/product-card.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  imports: [ProductCardComponent, NgxPaginationModule, RouterLink],
  selector: 'app-shop',
  styleUrl: './shop.component.css',
  templateUrl: './shop.component.html',
})
export class ShopComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly activatedRoute = inject(ActivatedRoute);
  productList: WritableSignal<Iproduct[]> = signal([]);
  pageSize = signal(1);
  curentPage = signal(1);
  totalResult = signal(1);
  selectedBrandId?: string;
  selectedCategoryId?: string;
  titleName = signal<string>('All Products');
  titleImage = signal<string>('All Products');

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.selectedBrandId = params.get('brand') ?? undefined;
      this.selectedCategoryId = params.get('category') ?? undefined;
      console.log('Selected Brand ID:', this.selectedBrandId);
      console.log('Selected Category ID:', this.selectedCategoryId);

      this.getAllProducts();
    });
  }

  getAllProducts(pageNumber: number = 1) {
    this.productsService
      .GetAllProducts(pageNumber, this.selectedBrandId, this.selectedCategoryId)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.productList.set(res.data);
          this.pageSize.set(res.metadata.limit);
          this.curentPage.set(res.metadata.currentPage);
          this.totalResult.set(res.results);
          if (this.selectedCategoryId && res.data.length > 0) {
            this.titleName.set(res.data[0].category.name);
            this.titleImage.set(res.data[0].category.image);
          } else if (this.selectedBrandId && res.data.length > 0) {
            this.titleName.set(res.data[0].brand.name);
            this.titleImage.set(res.data[0].brand.image);
          } else {
            this.titleName.set('All Products');
            this.titleImage.set('All');
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  pageChanged(e: any) {
    this.getAllProducts(e);
    console.log(e);
  }
}
