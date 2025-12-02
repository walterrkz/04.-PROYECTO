import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  {
    path: 'products',
    loadComponent: () =>
      import('../app/pages/products/products.component').then(
        (c) => c.ProductsComponent
      ),
    title: 'Products',
  },
  {
    path: 'carrito',
    loadComponent: () =>
      import('../app/pages/carrito/carrito.component').then(
        (c) => c.CarritoComponent
      ),
    title: 'Carrito',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('../app/pages/auth/login/login.component').then(
        (c) => c.LoginComponent
      ),
    title: 'Login',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('../app/pages/auth/register/register.component').then(
        (c) => c.RegisterComponent
      ),
    title: 'Register',
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('../app/pages/product-detail/product-detail.component').then(
        (c) => c.ProductDetailComponent
      ),
    title: 'ProductDetail',
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./pages/checkout/checkout.component').then(
        (c) => c.CheckoutComponent
      ),
  },
  { path: '**', redirectTo: '' },
];
