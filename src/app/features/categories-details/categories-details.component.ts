import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { Isubcategories } from '../../core/models/isubcategories.interface';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-categories-details',
  styleUrl: './categories-details.component.css',
  templateUrl: './categories-details.component.html',
})
export class CategoriesDetailsComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);
  subCategories: WritableSignal<Isubcategories[]> = signal([]);

  ngOnInit(): void {
    this.getAllSubCategories();
  }
  getAllSubCategories() {
    this.categoriesService.getAllSubCategories().subscribe({
      next: (res) => {
        console.log(res);
        this.subCategories.set(res.data);
        console.log(this.subCategories());
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
