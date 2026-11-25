import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { BrandService } from '../../core/services/brand/brand.service';
import { Ibrands } from '../../core/models/ibrands.interface';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-brands',
  styleUrl: './brands.component.css',
  templateUrl: './brands.component.html',
})
export class BrandsComponent implements OnInit {
  private readonly brandService = inject(BrandService);

  allBrands: WritableSignal<Ibrands[]> = signal([]);

  ngOnInit(): void {
    this.getBrands();
  }

  getBrands() {
    this.brandService.getAllBrands().subscribe({
      next: (res) => {
        console.log(res.data);
        this.allBrands.set(res.data);
        console.log(this.allBrands());
      },
    });
  }
}
