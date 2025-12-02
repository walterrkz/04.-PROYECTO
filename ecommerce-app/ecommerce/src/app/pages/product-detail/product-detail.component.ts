import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { switchMap, catchError, of } from 'rxjs';
import { ProductsService } from '../../core/services/products/products.service';
import { Product } from '../../core/types/Products';
import { AuthService, decodedToken } from '../../core/services/auth/auth.service';
import { CartService } from '../../core/services/cart/cart.service';
import { Cart } from '../../core/types/Cart';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  user: decodedToken | null = null;

  cart: Cart | null = null;
  qtyInCart = 0;

  adding = false;
  alert: { type: 'success' | 'danger'; text: string } | null = null;
  private alertTimer?: any;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.decodedToken;

    this.loadCart();

    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id')!;
          return this.productsService.getProductById(id);
        }),
        catchError(() => of(null))
      )
      .subscribe((p) => {
        this.product = p;
        this.updateQtyInCart();
      });
  }

  private loadCart() {
    this.cartService.getCartByUser().subscribe({
      next: (cart) => {
        this.cart = cart;
        this.updateQtyInCart();
      },
      error: (err) => {
        if (err?.status === 404) {
          this.cart = null;
          this.qtyInCart = 0;
        }
      },
    });
  }

  private updateQtyInCart() {
    if (!this.cart || !this.product) {
      this.qtyInCart = 0;
      return;
    }
    const item = this.cart.products.find(
      (p) => p.product._id === this.product!._id
    );
    this.qtyInCart = item ? item.quantity : 0;
  }

  get outOfStock(): boolean {
    if (!this.product) return false;
    const stock = this.product.stock ?? 0;
    return stock === 0 || this.qtyInCart >= stock;
  }

  onAddToCart() {
    if (!this.user || this.adding || !this.product?._id || this.outOfStock) {
      return;
    }

    this.adding = true;
    this.cartService.addProduct(this.product._id, 1).subscribe({
      next: () => {
        this.adding = false;
        this.showAlert('success', '¡Producto agregado al carrito!');
        this.loadCart();
      },
      error: (err) => {
        this.adding = false;
        const msg = err?.message || 'No se pudo agregar el producto.';
        this.showAlert('danger', `Error: No se pudo agregar el producto.`);
      },
    });
  }

  private showAlert(type: 'success' | 'danger', text: string, ms = 2500) {
    this.alert = { type, text };
    clearTimeout(this.alertTimer);
    this.alertTimer = setTimeout(() => (this.alert = null), ms);
  }

  closeAlert() {
    clearTimeout(this.alertTimer);
    this.alert = null;
  }
}
