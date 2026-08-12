import { Routes } from '@angular/router';

export const routes: Routes = [
      {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
    title: 'Home',
  },
  {
    path: 'shop',
    loadComponent: () =>
      import('./features/shop/shop.component').then((m) => m.ShopComponent),
    title: 'Shop',
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./features/categories/categories.component').then(
        (m) => m.CategoriesComponent
      ),
    title: 'Categories',
  },
    {
    path: 'category/:slug/:id',
    loadComponent: () =>
      import('./features/specific-category/specific-category.component').then(
        (m) => m.SpecificCategoryComponent
      ),
    title: 'Categories',
  },
  {
    path: 'brands',
    loadComponent: () =>
      import('./features/brands/brands.component').then(
        (m) => m.BrandsComponent
      ),
    title: 'Brands',
  },
    {
    path: 'brand/:slug/:id',
    loadComponent: () =>
      import('./features/brand/brand.component').then(
        (m) => m.BrandComponent
      ),
    title: 'Brand',
  },
  {
    path: 'wishlist',
    loadComponent: () =>
      import('./features/wishlist/wishlist.component').then(
        (m) => m.WishlistComponent
      ),
    title: 'Wishlist',
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./features/cart/cart.component').then((m) => m.CartComponent),
    title: 'Cart',
  },
  {
    path: 'details/:slug/:id',
    loadComponent: () =>
      import('./features/details/details.component').then(
        (m) => m.DetailsComponent
      ),
    title: 'Product Details',
  },
  {
    path: 'checkout/:id',
    loadComponent: () =>
      import('./features/checkout/checkout.component').then(
        (m) => m.CheckoutComponent
      ),
    title: 'Checkout',
  },
  {
    path: 'allorders',
    loadComponent: () =>
      import('./features/orders/orders.component').then(
        (m) => m.OrdersComponent
      ),
    title: 'Orders',
  },
    {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
    title: 'profile',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then(
        (m) => m.LoginComponent
      ),
    title: 'Login',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/register/register.component').then(
        (m) => m.RegisterComponent
      ),
    title: 'Register',
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/forgot/forgot.component').then(
        (m) => m.ForgotComponent
      ),
    title: 'Forgot Password',
  },
  {
    path: 'support',
    loadComponent: () =>
      import('./features/support/support.component').then(
        (m) => m.SupportComponent
      ),
    title: 'Support',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
    title: '404 - Page Not Found',
  },
];