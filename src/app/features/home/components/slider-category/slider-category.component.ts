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
  categoryList=signal<ICategory[]>([]);
  categoryList2=signal<ICategory[]>([]);
  private readonly categoriesService=inject(CategoriesService);
  ngOnInit(): void {

    this.getAllCategories();
    
  }
  // ngAfterViewChecked(): void {
  //   this.categoryList.set(this.categoryList2());
  // }
  getAllCategories(){
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        console.log(res.data,"cat");
        // const repeatedCategoryList:ICategory[]= res.data.map((category:ICategory,index:Number) => ({
        //   ...category,
        //  _id : `${res.data.length+index}`
        // }));
        this.categoryList.set([...res.data,...res.data]);
        // this.categoryList().forEach((element,index) => {
        //   console.log(element._id,index);
        // });
        // this.categoryList2.set(res.data);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
