import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { CartService } from '../../core/services/cart/cart.service';
import {
  AuthService,
  decodedToken,
} from '../../core/services/auth/auth.service';

import { Cart } from '../../core/types/Cart';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css',
})
export class CarritoComponent implements OnInit {
  user: decodedToken | null = null;
  loading = false;
  cart: Cart | null = null;
  alert: { type: 'success' | 'danger'; text: string } | null = null;
  private alertTimer?: any;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.decodedToken;
    if (this.user) {
      this.loadCart();
    }
  }

  private loadCart() {
    this.loading = true;
    this.cartService.getCartByUser().subscribe({
      next: (c) => {
        this.cart = c;
        this.loading = false;
      },
      error: (err) => {
        if (err?.status === 404) {
          this.cart = null;
        } else {
          const msg =
            err?.error?.error ||
            err?.error?.message ||
            err?.message ||
            'Error al cargar el carrito.';
          this.showAlert('danger', `Error: ${msg}`);
        }
        this.loading = false;
      },
    });
  }

  lineTotal(price: number, quantity: number) {
    return price * quantity;
  }

  get total(): number {
    if (!this.cart?.products?.length) return 0;
    return this.cart.products.reduce(
      (acc, p) => acc + p.product.price * p.quantity,
      0
    );
  }

  get hasStockIssue(): boolean {
    if (!this.cart?.products?.length) return false;
    return this.cart.products.some(
      (p) => p.product.stock <= 0 || p.quantity > p.product.stock
    );
  }

  decreaseQty(item: any) {
    if (!this.cart) return;
    if (item.quantity <= 1) return;

    const newQty = item.quantity - 1;
    this.updateItemQuantity(item.product._id, newQty);
  }

  increaseQty(item: any) {
    if (!this.cart) return;
    const stock = item.product.stock ?? 0;
    if (item.quantity >= stock) return;

    const newQty = item.quantity + 1;
    this.updateItemQuantity(item.product._id, newQty);
  }

  private updateItemQuantity(productId: string, quantity: number) {
    if (!this.cart) return;

    const productsPayload = this.cart.products.map((p) => ({
      product: p.product._id,
      quantity: p.product._id === productId ? quantity : p.quantity,
    }));

    this.cartService.updateCart(productsPayload).subscribe({
      next: (updatedCart) => {
        this.cart = updatedCart;
      },
      error: (err) => {
        const msg =
          err?.error?.error ||
          err?.error?.message ||
          err?.message ||
          'No se pudo actualizar la cantidad.';
        this.showAlert('danger', `Error: ${msg}`);
      },
    });
  }

  removeFromCart(productId: string) {
    if (!this.cart) return;

    this.cartService.deleteProductFromCart(productId).subscribe({
      next: () => {
        this.loadCart();
        this.showAlert('success', 'Producto eliminado del carrito.');
      },
      error: (err) => {
        const msg =
          err?.error?.error ||
          err?.error?.message ||
          err?.message ||
          'No se pudo eliminar el producto.';
        this.showAlert('danger', `Error: ${msg}`);
      },
    });
  }

  onCheckoutClick(event: Event) {
    if (this.hasStockIssue) {
      event.preventDefault();
      this.showAlert('danger', 'Ajusta las cantidades antes de continuar.');
    }
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
