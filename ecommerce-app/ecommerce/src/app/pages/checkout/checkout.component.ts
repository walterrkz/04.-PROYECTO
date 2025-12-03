import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { CartService } from '../../core/services/cart/cart.service';
import { AuthService, decodedToken } from '../../core/services/auth/auth.service';
import { Cart } from '../../core/types/Cart';

import { FormFieldComponent } from '../../components/shared/form-field/form-field.component';
import { FormErrorService } from '../../core/services/validation/form-error.service';

import { OrderService } from '../../core/services/order/order.service';
import { CreateOrderPayload, PaymentMethod } from '../../core/types/Order';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, ReactiveFormsModule, FormFieldComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  fb = inject(FormBuilder);

  user: decodedToken | null = null;
  cart: Cart | null = null;
  loading = false;

  submitting = false;

  alert: { type: 'success' | 'danger'; text: string } | null = null;
  private alertTimer?: any;

  checkoutForm: FormGroup;

  shippingCost = 0;

  paymentMethods = [
    { label: 'Tarjeta', value: 'CARD' },
    { label: 'Efectivo', value: 'CASH' },
    { label: 'Transferencia', value: 'TRANSFER' },
  ];

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private validation: FormErrorService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      paymentMethod: ['', Validators.required],
    });
  }

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

  getErrorMessage(fieldName: string) {
    const labels: Record<string, string> = {
      fullName: 'nombre completo',
      phone: 'teléfono',
      street: 'calle',
      city: 'ciudad',
      state: 'estado',
      zipCode: 'código postal',
      paymentMethod: 'método de pago',
    };
    return this.validation.getFieldError(this.checkoutForm, fieldName, labels);
  }

  getPhoneError(): string {
    const c = this.checkoutForm.get('phone');
    if (!c || !c.touched) return '';
    if (c.hasError('required')) return 'El teléfono es requerido';
    if (c.hasError('pattern')) return 'El teléfono debe tener 10 dígitos';
    return '';
  }

  get paymentMethodError(): string {
    const c = this.checkoutForm.get('paymentMethod');
    if (!c || !c.touched) return '';
    if (c.hasError('required')) return 'El método de pago es requerido';
    return '';
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

  get grandTotal(): number {
    return this.total + this.shippingCost;
  }

  get hasStockIssue(): boolean {
    if (!this.cart?.products?.length) return false;
    return this.cart.products.some(
      (p) => (p.product.stock ?? 0) <= 0 || p.quantity > (p.product.stock ?? 0)
    );
  }

  handleSubmit() {
    if (!this.user) return;

    if (this.hasStockIssue) {
      this.showAlert('danger', 'Hay productos sin stock suficiente. Ajusta tu carrito antes de pagar.');
      return;
    }

    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    if (!this.cart || this.cart.products.length === 0) {
      this.showAlert('danger', 'Tu carrito está vacío.');
      return;
    }

    const payload: CreateOrderPayload = {
      shippingAddress: {
        fullName: String(this.checkoutForm.value.fullName).trim(),
        phone: String(this.checkoutForm.value.phone).trim(),
        street: String(this.checkoutForm.value.street).trim(),
        city: String(this.checkoutForm.value.city).trim(),
        state: String(this.checkoutForm.value.state).trim(),
        zipCode: String(this.checkoutForm.value.zipCode).trim(),
      },
      paymentMethod: this.checkoutForm.value.paymentMethod as PaymentMethod,
      shippingCost: this.shippingCost,
    };

    this.submitting = true;

    this.orderService.createOrder(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.showAlert('success', 'Orden creada correctamente.');
        this.router.navigateByUrl('/').then(() => window.location.reload());
      },
      error: (err) => {
        this.submitting = false;
        const msg =
          err?.error?.error ||
          err?.error?.message ||
          err?.message ||
          'No se pudo crear la orden.';
        this.showAlert('danger', `Error: ${msg}`);
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
