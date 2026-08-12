import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'category/:slug/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'brand/:slug/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'details/:slug/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'checkout/:id',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];