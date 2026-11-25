import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { Observable } from 'rxjs';
import { Icategories } from '../../core/models/icategories.interface';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-categories',
  styleUrl: './categories.component.css',
  templateUrl: './categories.component.html',
})
export class CategoriesComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);
  categoriesList: WritableSignal<Icategories[]> = signal([]);

  ngOnInit(): void {
    this.getAllCatgories();
  }
  getAllCatgories() {
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        console.log(res);
        this.categoriesList.set(res.data);
        console.log(this.categoriesList());
      },
    });
  }
}
