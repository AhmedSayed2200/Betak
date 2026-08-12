import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from '../Auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
 private readonly httpClient=inject(HttpClient);
   private readonly pLATFORM_ID=inject(PLATFORM_ID);
   private readonly authService=inject(AuthService);
   productsNumberInCart=signal<number>(0);
   constructor(){
    if(isPlatformBrowser(this.pLATFORM_ID)){
      if(!this.authService.isLogged()){
          let newProductsNumberInCart=JSON.parse(localStorage.getItem("cartList")!??"[]").length
          this.productsNumberInCart.set(newProductsNumberInCart);
      }
    }
   }
 addProductTocart(productId:string):Observable<any>{
  return this.httpClient.post(environment.baseUrl+`/api/v2/cart`,{
    productId:productId
  })
 }

 removeProductFromCart(productId:string):Observable<any>{
  return this.httpClient.delete(environment.baseUrl+`/api/v2/cart/${productId}`)
 }
  removeAllProductFromCart():Observable<any>{
  return this.httpClient.delete(environment.baseUrl+`/api/v2/cart`)
 }

 getAllProductsInCart():Observable<any>{
  return this.httpClient.get(environment.baseUrl+"/api/v2/cart");
 }

 UpdateCartProductQuantity(productId:string,countNumber:number):Observable<any>{
    return this.httpClient.put(environment.baseUrl+`/api/v2/cart/${productId}`, {
      count:countNumber
    })
 }

  createCashOrder(cartId:string,body:object):Observable<any>{
      return this.httpClient.post(environment.baseUrl+`/api/v1/orders/${cartId}`,body)
  }
    createVisaOrder(cartId:string,body:object):Observable<any>{
      return this.httpClient.post(environment.baseUrl+`/api/v1/orders/checkout-session/${cartId}?url=${environment.siteUrl}`,body)
  }


}
