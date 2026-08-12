import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from '../Auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class WishListService {
  private readonly httpClient=inject(HttpClient)
   private readonly pLATFORM_ID=inject(PLATFORM_ID);
   private readonly authService=inject(AuthService);
   productsNumberInCart=signal<number>(0);
   productsNumberInWishList=signal<number>(0);
   constructor(){
    if(isPlatformBrowser(this.pLATFORM_ID)){
      if(!this.authService.isLogged()){
         let newProductsNumberInWishList=JSON.parse(localStorage.getItem("wishList")!??"[]").length
          this.productsNumberInWishList.set(newProductsNumberInWishList);
      }
    }
   }

   getUserWishList():Observable<any>{
      return this.httpClient.get(environment.baseUrl+`/api/v1/wishlist`)
   }
  
   addProductToWishList(productId:string):Observable<any>{
        return this.httpClient.post(environment.baseUrl+`/api/v1/wishlist`,{
          productId:productId
        })
   }

   removeProductFromWishList(productId:string):Observable<any>{
        return this.httpClient.delete(environment.baseUrl+`/api/v1/wishlist/${productId}`,{})
   }

  
}
