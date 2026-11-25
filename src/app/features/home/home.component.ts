import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { NavbarComponent } from '../../layouts/navbar/navbar.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ProductsService } from '../../shared/services/products/products.service';
import { Iproduct } from '../../core/models/iproduct.interface';
import { Icategories } from '../../core/models/icategories.interface';
import { NewsLetterComponent } from '../../shared/components/news-letter/news-letter.component';
import { OverViewComponent } from '../../shared/components/over-view/over-view.component';
import { OffersComponent } from '../../shared/components/offers/offers.component';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { RouterLink } from '@angular/router';

@Component({
  imports: [
    ProductCardComponent,
    NewsLetterComponent,
    OverViewComponent,
    OffersComponent,
    RouterLink,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-home',
  styleUrl: './home.component.css',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);
  productList: WritableSignal<Iproduct[]> = signal([]);
  categoriesList: WritableSignal<Icategories[]> = signal([]);
  ngOnInit(): void {
    this.getAllProducts();
    this.getAllCategory();
  }
  getAllProducts() {
    this.productsService.GetAllProducts().subscribe({
      next: (res) => {
        console.log(res.data);
        this.productList.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getAllCategory() {
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        console.log(res.data);
        this.categoriesList.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
