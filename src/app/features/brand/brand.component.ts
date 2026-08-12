import { Component, inject, signal } from '@angular/core';
import { HeaderComponent } from '../../shared/ui/header/header.component';
import { ProductListComponent } from '../home/components/product-list/product-list.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-brand',
  imports: [HeaderComponent,ProductListComponent],
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.css',
})
export class BrandComponent {
  private readonly activatedRoute=inject(ActivatedRoute)
  brandSlug=signal<string>("");
  ngOnInit(): void {
        this.activatedRoute.paramMap.subscribe(param => {
        this.brandSlug.set(param.get("slug")!)
     })
  }
}
