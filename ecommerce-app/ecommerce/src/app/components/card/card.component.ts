import { Component, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../core/types/Products';
import { AuthService, decodedToken } from '../../core/services/auth/auth.service';
import { CartService } from '../../core/services/cart/cart.service';

@Component({
  selector: 'app-card',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
  standalone: true,
})
export class CardComponent {
  @Input() product!: Product;
  @Input() outOfStock: boolean = false;

  user: decodedToken | null = null;
  adding = false;

  alert: { type: 'success' | 'danger'; text: string } | null = null;
  private alertTimer?: any;

  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.decodedToken;
  }

  onAddToCart() {
    if (!this.user || this.adding || this.outOfStock) return;

    this.adding = true;
    this.cartService.addProduct(this.product._id, 1).subscribe({
      next: () => {
        this.adding = false;
        this.showAlert('success', '¡Producto agregado al carrito!');
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
