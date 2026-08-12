import { Component, inject, signal } from '@angular/core';
import { HeaderComponent } from '../../shared/ui/header/header.component';
import { ProductListComponent } from '../home/components/product-list/product-list.component';
import { CategoriesService } from '../../core/services/categories.service';
import { ICategory } from '../../core/modules/icategory.interface';
import { BrandsService } from '../../core/services/brands.service';
import { IBrands } from '../../core/modules/ibrands.interface';
import { FilterService } from '../../core/services/fillteration.service';

@Component({
  selector: 'app-shop',
  imports: [HeaderComponent,ProductListComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent {
   readonly FilterService=inject(FilterService)
  categoryList=signal<ICategory[]>([])
  brandList=signal<IBrands[]>([])
  isCategoryAppear=signal<boolean>(true);
  isBrandAppear=signal<boolean>(true);
  private readonly categoriesService=inject(CategoriesService)
  private readonly brandsService=inject(BrandsService)
  ngOnInit(): void {
       this.getAllCategories()
       this. getAllBrands()
  }
   getAllCategories(){
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categoryList.set(res.data)
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  getAllBrands(){
      this.brandsService.getAllBrands().subscribe({
        next: (res) => {
          this.brandList.set(res.data);
        }
      })
  }

  changeSelectedCategory(categoryId: string, event: Event) {
        const isChecked = (event.target as HTMLInputElement).checked;
        // adding category
        if (isChecked)  {
          this.FilterService.selectedCategories.update(selectedCategoriesIds=> [...selectedCategoriesIds,categoryId]);
         
        } 
        // delete it
        else {
          this.FilterService.selectedCategories.update(selectedCategoriesIds=> selectedCategoriesIds.filter(id => id !== categoryId));
        }
        
  }
    changeSelectedBrand(brandId: string, event: Event) {
        const isChecked = (event.target as HTMLInputElement).checked;
        // adding brand
        if (isChecked)  {
          this.FilterService.selectedBrands.update(selectedBrandsIds=> [...selectedBrandsIds,brandId]);
        } 
        // delete it
        else {
          this.FilterService.selectedBrands.update(selectedBrandsIds=> selectedBrandsIds.filter(id => id !== brandId));
        }
  }
  changeMinprice(event: Event) {
      const inputValue=(event.target as HTMLInputElement).value;
      if(inputValue===""){
          this.FilterService.selectedMinPrice.set(null)
      }
      else
      this.FilterService.selectedMinPrice.set(+inputValue);
  }
    changeMaxprice(event: Event) {
      const inputValue=(event.target as HTMLInputElement).value;
      if(inputValue===""){
          this.FilterService.selectedMaxPrice.set(null)
      }
      else
      this.FilterService.selectedMaxPrice.set(+inputValue);
  }
  clearFiters(){
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach((cb: any) => cb.checked = false);
      const inputNumber = document.querySelectorAll('input[type="number"]');
      inputNumber.forEach((inputNumber: any)=>inputNumber.value="")
       this.FilterService.selectedCategories.set([])
       this.FilterService.selectedBrands.set([])
       this.FilterService.selectedMaxPrice.set(null)
       this.FilterService.selectedMinPrice.set(null)

  }
}
