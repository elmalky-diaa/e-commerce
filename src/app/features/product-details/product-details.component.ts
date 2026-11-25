import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Iproduct } from '../../core/models/iproduct.interface';
import { ProductsService } from '../../shared/services/products/products.service';
import { CartService } from '../../core/services/cart/cart.service';

@Component({
  imports: [RouterLink],
  selector: 'app-product-details',
  styleUrl: './product-details.component.css',
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);
  private readonly destroyRef = inject(DestroyRef);

  readonly stars = [1, 2, 3, 4, 5];
  readonly productData = signal<Iproduct | null>(null);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');
  readonly recommendations = signal<Iproduct[]>([]);
  readonly recommendationsError = signal('');
  readonly activeImageIndex = signal(0);
  readonly quantity = signal(1);
  readonly activeTab = signal<'details' | 'reviews' | 'shipping'>('details');
  readonly galleryImages = computed(() => {
    const product = this.productData();
    return product ? [...new Set([product.imageCover, ...product.images].filter(Boolean))] : [];
  });
  readonly activeImage = computed(() => this.galleryImages()[this.activeImageIndex()] ?? '');
  readonly totalPrice = computed(() => (this.productData()?.price ?? 0) * this.quantity());

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const productId = params.get('id');
      this.productData.set(null);
      this.recommendations.set([]);
      this.recommendationsError.set('');
      this.activeImageIndex.set(0);
      this.quantity.set(1);
      this.isLoading.set(true);
      this.errorMessage.set('');

      if (!productId) {
        this.isLoading.set(false);
        this.errorMessage.set('A product was not specified.');
        return;
      }

      this.productsService
        .GetSpecificProduct(productId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response) => {
            const product: Iproduct | undefined = response?.data;
            if (!product) {
              this.errorMessage.set('This product could not be found.');
              this.isLoading.set(false);
              return;
            }

            this.productData.set(product);
            this.isLoading.set(false);
            this.loadRecommendations(product._id);
          },
          error: () => {
            this.errorMessage.set('Unable to load this product. Please try again.');
            this.isLoading.set(false);
          },
        });
    });
  }

  selectImage(index: number): void {
    if (index >= 0 && index < this.galleryImages().length) {
      this.activeImageIndex.set(index);
    }
  }

  showPreviousImage(): void {
    const imageCount = this.galleryImages().length;
    if (imageCount > 1) {
      this.activeImageIndex.update((index) => (index - 1 + imageCount) % imageCount);
    }
  }

  showNextImage(): void {
    const imageCount = this.galleryImages().length;
    if (imageCount > 1) {
      this.activeImageIndex.update((index) => (index + 1) % imageCount);
    }
  }

  increaseQuantity(): void {
    const availableQuantity = this.productData()?.quantity ?? 1;
    this.quantity.update((current) => Math.min(current + 1, availableQuantity));
  }

  decreaseQuantity(): void {
    this.quantity.update((current) => Math.max(current - 1, 1));
  }

  scrollRecommendations(track: HTMLElement, direction: -1 | 1): void {
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: 'smooth' });
  }

  private loadRecommendations(productId: string): void {
    this.productsService
      .GetAllProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (!Array.isArray(response?.data)) {
            this.recommendationsError.set('Related products are unavailable right now.');
            return;
          }
          this.recommendations.set(
            response.data.filter((product: Iproduct) => product._id !== productId).slice(0, 10),
          );
        },
        error: () => {
          this.recommendationsError.set('Related products are unavailable right now.');
        },
      });
  }

  addToProduct(productId: string) {
    this.cartService.addProductToCart(productId).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
