import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './core/guards/auth/auth.guard';
import { formGuard } from './core/guards/form/form.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full', title: 'Home' },
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
    canActivate: [authGuard],
    loadComponent: () =>
      import('../app/pages/carrito/carrito.component').then(
        (c) => c.CarritoComponent
      ),
    title: 'Carrito',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('../app/pages/auth/login/login.component').then((c) => c.LoginComponent),
    title: 'login',
    canDeactivate: [formGuard],
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
    title: 'Checkout',
  },
  {
    path: 'historial',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/historial/historial.component').then(
        (c) => c.HistorialComponent
      ),
    title: 'Historial',
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/profile/profile.component').then(
        (c) => c.ProfileComponent
      ),
    title: 'Perfil',
  },
  { path: '**', redirectTo: '' },
];
