import { Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { FlowbiteService } from '../../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../../core/Auth/services/auth.service';
import { WishListService } from '../../../core/services/wish-list.service';
import { CartService } from '../../../core/services/cart.service';
import { ICartDetailes } from '../../../features/cart/modules/icart-detailes.interface';
import { isPlatformBrowser } from '@angular/common';
import { FilterService } from '../../../core/services/fillteration.service';
import { CategoriesService } from '../../../core/services/categories.service';
import { ICategory } from '../../../core/modules/icategory.interface';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly authService=inject(AuthService)
  private readonly wishListService=inject(WishListService)
  private readonly cartService=inject(CartService)
  private readonly filterService=inject(FilterService)
  private readonly categoriesService=inject(CategoriesService)
  private readonly router=inject(Router)
  private readonly pLATFORM_ID=inject(PLATFORM_ID)
   cartDetails=signal<ICartDetailes>({} as ICartDetailes)
   ElectronicsCategoryId=signal<ICategory>({} as ICategory)
   MensFashionCategoryId=signal<ICategory>({} as ICategory)
   WomensFashionCategoryId=signal<ICategory>({} as ICategory)
   isCategoriesAppears=signal<boolean>(false)
  isLogged=computed(this.authService.isLogged)
  productsNumberInCart=computed(this.cartService.productsNumberInCart)
  productsNumberInWishList=computed(this.wishListService.productsNumberInWishList)
constructor(private flowbiteService: FlowbiteService) {}
  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
      if(isPlatformBrowser(this.pLATFORM_ID)){
        if(this.authService.isLogged()){
                    this.getUserWishListNumber();
          this.getProductsNumberInCart();
        }
      }
  }
  signOut():void{
    localStorage.removeItem("E-CommerceToken");
    localStorage.removeItem("E-CommerceUser");
    this.authService.isLogged.set(false);
    this.router.navigate(["/login"]);
  }

    getUserWishListNumber():void{
          this.wishListService.getUserWishList().subscribe({
      next:(res)=>{
          this.wishListService.productsNumberInWishList.set(res.data.length)
      }
    })
  }

    getProductsNumberInCart(){
    this.cartService.getAllProductsInCart().subscribe({
      next:(res)=>{
          this.cartDetails.set(res.data) 
         let count= 0;
        this.cartDetails().products.forEach((product:any) => {
          count+=product.count;
        })
        this.cartService.productsNumberInCart.set(count)

      }
    })
  }
  searchedProduct(event:Event){
    if (this.router.url !== '/shop') {
          this.router.navigate(['/shop']);
     }
     const searchedInput=event.target as HTMLInputElement;
     this.filterService.searchedInputValue.set(searchedInput.value.toLowerCase().trim())
  }
  getSpecificCategory(){
    this.categoriesService.getAllCategories().subscribe({
      next:(res)=>{
        console.log(res.data)
        const electronics = res.data.find((c: ICategory) => c.name === "Electronics");
        const mensFashion = res.data.find((c: ICategory) => c.name === "Men's Fashion");
        const womensFashion = res.data.find((c: ICategory) => c.name === "Women's Fashion");
       if (electronics) this.ElectronicsCategoryId.set(electronics);
       if (mensFashion) this.MensFashionCategoryId.set(mensFashion);
        if (womensFashion) this.WomensFashionCategoryId.set(womensFashion);
        this.isCategoriesAppears.set(true);
      },
      error: (err)=>{
          console.log(err)
      }
    })
  }
  appearCategories(){
     if(this.isCategoriesAppears()){
       this.isCategoriesAppears.set(false);
     }
     else{
      this.getSpecificCategory();
     }
  }
}
