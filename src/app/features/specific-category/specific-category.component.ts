import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../shared/ui/header/header.component';
import { ProductListComponent } from '../home/components/product-list/product-list.component';

@Component({
  selector: 'app-specific-category',
  imports: [HeaderComponent,ProductListComponent],
  templateUrl: './specific-category.component.html',
  styleUrl: './specific-category.component.css',
})
export class SpecificCategoryComponent {
    private readonly activatedRoute=inject(ActivatedRoute)
  categorySlug=signal<string>("");
  ngOnInit(): void {
        this.activatedRoute.paramMap.subscribe(param => {
        this.categorySlug.set(param.get("slug")!)
     })
  }
}
