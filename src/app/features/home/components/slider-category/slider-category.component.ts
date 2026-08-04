import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, signal } from '@angular/core';
import { CategoriesService } from '../../../../core/services/categories.service';
import { ICategory } from '../../../../core/modules/icategory.interface';

@Component({
  selector: 'app-slider-category',
  imports: [],
  templateUrl: './slider-category.component.html',
  styleUrl: './slider-category.component.css',
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class SliderCategoryComponent implements OnInit {
  categoryList1=signal<ICategory[]>([]);
  categoryList2=signal<ICategory[]>([]);
  private readonly categoriesService=inject(CategoriesService);
  ngOnInit(): void {

    this.getAllCategories();
    
  }
  // ngAfterContentInit(): void {
  //   this.categoryList1.set(this.categoryList2());
  // }
  getAllCategories(){
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        console.log(res.data,"cat");
        this.categoryList1.set(res.data);
        // this.categoryList2.set(res.data);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
