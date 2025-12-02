import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product } from '../../types/Products';
import { environment } from '../../../../environments/environment';

type Pagination = {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  hasNext: boolean;
  hasPrev: boolean;
};

type ProductsResponse = {
  products: Product[];
  pagination: Pagination;
};

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private baseUrl = `${environment.apiUrl}/products`;
  constructor(private httpClient: HttpClient) {}

  getProducts(page = 1, limit = 12): Observable<ProductsResponse> {
    return this.httpClient.get<ProductsResponse>(`${this.baseUrl}?page=${page}&limit=${limit}`);
  }

  // lo de precio lo puedes conservar si lo necesitas en otra vista
  getProductsSortedByPrice(limit: number = 10): Observable<Product[]> {
    return this.httpClient
      .get<Product[]>(`${this.baseUrl}/sortedbyprice`)
      .pipe(map((products) => products.slice(0, limit)));
  }

getProductById(id: string): Observable<Product> {
    return this.httpClient.get<Product>(`${this.baseUrl}/${id}`);
  }

}