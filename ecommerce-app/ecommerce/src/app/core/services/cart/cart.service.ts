import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cart } from '../../types/Cart';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CartService {
  private baseUrl = `${environment.apiUrl}/cart`;

  constructor(private httpClient: HttpClient) {}

  getCartByUser(): Observable<Cart> {
    return this.httpClient.get<Cart>(`${this.baseUrl}/user`);
  }

  addProduct(productId: string, quantity: number = 1): Observable<Cart> {
    return this.httpClient.post<Cart>(`${this.baseUrl}/add-product`, {
      productId,
      quantity,
    });
  }

  deleteProductFromCart(productId: string): Observable<any> {
    return this.httpClient.delete<any>(
      `${this.baseUrl}/delete-product/${productId}`
    );
  }

  updateCart(
    products: { product: string; quantity: number }[]
  ): Observable<Cart> {
    return this.httpClient.put<Cart>(`${this.baseUrl}`, { products });
  }
}
