import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../core/types/Products';
import { CardComponent } from '../card/card.component';
import { Cart } from '../../core/types/Cart';
import { CartService } from '../../core/services/cart/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrousel',
  standalone: true,
  imports: [CardComponent, CommonModule],
  templateUrl: './carrousel.component.html',
  styleUrl: './carrousel.component.css',
})
export class CarrouselComponent implements OnInit {
  @Input() products!: Product[];
  carrouselItems: number = 4;

  cart: Cart | null = null;
  private cartQuantities: Record<string, number> = {};

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) return;
    this.loadCart();
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

  fnGetItemsNumber(products: Product[]): any[] {
    const size = Math.ceil(products.length / this.carrouselItems);
    const array = new Array(size).fill(0);
    return array;
  }

  fnGetItems(i: number, products: Product[]): Product[] {
    const start = i * this.carrouselItems;
    const end = start + this.carrouselItems;
    let subSetProducts: Product[] = [];
    subSetProducts = products.slice(start, end);
    return subSetProducts;
  }

  isOutOfStock(product: Product): boolean {
    const stock = product.stock ?? 0;
    const qtyInCart = this.cartQuantities[product._id] || 0;
    return stock === 0 || qtyInCart >= stock;
  }
}
