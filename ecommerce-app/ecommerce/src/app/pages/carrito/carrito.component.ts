import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CurrencyPipe, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { CartService } from '../../core/services/cart/cart.service';
import type { User } from '../../core/types/User';
import { Cart } from '../../core/types/Cart';

import { selectUser } from '../../store/auth/auth.selectors';
import * as AuthActions from '../../store/auth/auth.actions';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, AsyncPipe],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css',
})
export class CarritoComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private subs = new Subscription();

  user$: Observable<User | null> = this.store.select(selectUser);

  loading = false;
  cart: Cart | null = null;

  alert: { type: 'success' | 'danger'; text: string } | null = null;
  private alertTimer?: any;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.store.dispatch(AuthActions.loadUser());

    const s = this.user$.subscribe((user) => {
      if (user) {
        this.loadCart();
      } else {
        this.cart = null;
        this.loading = false;
      }
    });

    this.subs.add(s);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    if (this.alertTimer) clearTimeout(this.alertTimer);
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
