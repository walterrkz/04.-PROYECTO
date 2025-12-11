import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { AuthService, decodedToken } from '../../core/services/auth/auth.service';
import { OrderService } from '../../core/services/order/order.service';
import { Order } from '../../core/types/Order';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css',
})
export class HistorialComponent implements OnInit {
  user: decodedToken | null = null;

  loading = false;
  orders: Order[] = [];
  hasHistory = false;

  alert: { type: 'success' | 'danger'; text: string } | null = null;
  private alertTimer?: any;

  constructor(
    private authService: AuthService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.decodedToken;
    if (this.user) this.loadOrders();
  }

  loadHistory(): void {
    this.loadOrders();
  }

  private loadOrders() {
    this.loading = true;

    this.orderService.getOrdersByUser().subscribe({
      next: (data) => {
        this.orders = Array.isArray(data) ? data : [];
        this.hasHistory = this.orders.length > 0;
        this.loading = false;
      },
      error: (err) => {
        if (err?.status !== 404) {
          const msg =
            err?.error?.error ||
            err?.error?.message ||
            err?.message ||
            'Error al cargar el histórico.';
          this.showAlert('danger', `Error: ${msg}`);
        }
        this.orders = [];
        this.hasHistory = false;
        this.loading = false;
      },
    });
  }

  orderItemsCount(order: Order): number {
    return order?.products?.reduce((acc, p) => acc + (p.quantity || 0), 0) || 0;
  }

  orderIdShort(id: string): string {
    if (!id) return '';
    return id.length > 10 ? `${id.slice(0, 6)}…${id.slice(-4)}` : id;
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
