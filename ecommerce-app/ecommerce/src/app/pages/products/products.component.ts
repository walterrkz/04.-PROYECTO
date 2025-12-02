import { Component, OnInit } from '@angular/core';
import { ProductResponse } from '../../core/types/Products';
import { CardComponent } from '../../components/card/card.component';
import { ProductsService } from '../../core/services/products/products.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Cart } from '../../core/types/Cart';
import { CartService } from '../../core/services/cart/cart.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CardComponent, MatPaginatorModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  productResponse!: ProductResponse;
  cart: Cart | null = null;
  private cartQuantities: Record<string, number> = {};

  constructor(
    private productsService: ProductsService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadCart();
    this.getProducts();
  }

  private loadCart() {
    this.cartService.getCartByUser().subscribe({
      next: (cart) => {
        this.cart = cart;
        this.cartQuantities = {};
        if (cart?.products?.length) {
          for (const item of cart.products) {
            const id = item.product._id;
            this.cartQuantities[id] = item.quantity;
          }
        }
      },
      error: (err) => {
        if (err?.status === 404) {
          this.cart = null;
          this.cartQuantities = {};
        }
      },
    });
  }

  getProducts(page: number = 1, limit: number = 12) {
    this.productsService.getProducts(page, limit).subscribe({
      next: (data) => {
        this.productResponse = data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  onPageChange(event: PageEvent) {
    this.getProducts(event.pageIndex + 1, event.pageSize);
  }

  get skeletonArray(): number[] {
    const expectedCount = this.productResponse?.products?.length || 8;
    return Array(expectedCount).fill(0);
  }

  retryLoadProducts(): void {
    this.getProducts();
  }

  isOutOfStock(product: any): boolean {
    const stock = product.stock ?? 0;
    const qtyInCart = this.cartQuantities[product._id] || 0;
    return stock === 0 || qtyInCart >= stock;
  }
}
