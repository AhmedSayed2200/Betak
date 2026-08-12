import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { WishListService } from '../../core/services/wish-list.service';
import { IProduct } from '../../core/modules/iproduct.interface';
import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { HeaderComponent } from '../../shared/ui/header/header.component';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../core/Auth/services/auth.service';

@Component({
  selector: 'app-wishlist',
  imports: [CurrencyPipe, HeaderComponent, RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent {
  LikedList=signal<IProduct[]>([])
  private readonly wishListService=inject(WishListService)
  private readonly cartService=inject(CartService)
  private readonly toastrService=inject(ToastrService)
  private readonly authService=inject(AuthService)
  private readonly pLATFORM_ID=inject(PLATFORM_ID)
  ngOnInit(): void {

   if(isPlatformBrowser(this.pLATFORM_ID)){
     this.getUserWishList()
   }

   
  }
  getUserWishList():void{
      if(this.authService.isLogged()){
            this.wishListService.getUserWishList().subscribe({
            next:(res)=>{
                console.log(res.data);
                this.LikedList.set(res.data)
                this.wishListService.productsNumberInWishList.set(res.data.length)
            },
            error:(err)=>{
              console.log(err);
            }
          })
      }
      else{
        const productInWishList= JSON.parse( localStorage.getItem("wishList")!)??[];
        this.LikedList.set(productInWishList);
        this.wishListService.productsNumberInWishList.set(productInWishList.length)
      }
  }
  calcDiscount(price: number, priceAfterDiscount: number):Number{
  const discount = ((price - priceAfterDiscount) / price) * 100;
  return Math.round(discount);
}

  addProductTocart(productId:string){
      if(this.authService.isLogged()){
             this.cartService.addProductTocart(productId).subscribe({
              next:(res)=>{
                  let temCount=0;
                  res.data.products.forEach((product:any) => {
                        temCount+=product.count
                  });
                  this.cartService.productsNumberInCart.set(temCount);
                this.toastrService.success("Product added to cart","Betak",{closeButton:true,extendedTimeOut: 5000,timeOut:5000,progressBar:true,progressAnimation:"increasing"})
              },
              error: (err)=>{
                console.log(err);
              }
            })
      }
      else{
          let productsListInWishList=JSON.parse( localStorage.getItem("wishList")!)??[];
          const productCarted= productsListInWishList.find(
              (product: IProduct) => product._id === productId);
          let productsListInCartList=JSON.parse( localStorage.getItem("cartList")!)??[];
          let newProductsNumber=productsListInCartList.push(productCarted)
         localStorage.setItem("cartList",JSON.stringify( productsListInCartList ) )
        this.cartService.productsNumberInCart.set(newProductsNumber);
        this.toastrService.success("Product added to cart","Betak",{closeButton:true,extendedTimeOut: 5000,timeOut:5000,progressBar:true,progressAnimation:"increasing"})

        
      }
  }
    removeProductFromWishList(productId:string,isClearAll:boolean=false){
        if(this.authService.isLogged()){
            this.wishListService.removeProductFromWishList(productId).subscribe({
              next:(res)=>{
                  console.log(res);
              this.toastrService.success("Product removed from wishlist","Betak",{closeButton:true,extendedTimeOut: 5000,timeOut:5000,progressBar:true,progressAnimation:"increasing"})
              if(!isClearAll)
                this.getUserWishList()
              },
              error:(err)=>{
                  console.log(err);
              }
            })
        }
        else{
          let productsListInWishList=JSON.parse( localStorage.getItem("wishList")!)??[];
           const productIndex= productsListInWishList.findIndex(
              (product: IProduct) => product._id === productId);
        productsListInWishList.splice(productIndex, 1);
         this.LikedList.set(productsListInWishList);
         localStorage.setItem("wishList",JSON.stringify(productsListInWishList))
         this.wishListService.productsNumberInWishList.set(productsListInWishList.length) ;
         this.toastrService.success("Product removed from wishlist","Betak",{closeButton:true,extendedTimeOut: 5000,timeOut:5000,progressBar:true,progressAnimation:"increasing"})
    
        }
}
    clearAll(){
        if(this,this.authService.isLogged()){
           this.LikedList().forEach(product => {
              this.removeProductFromWishList(product.id,true)
            
            });
            this.wishListService.productsNumberInWishList.set(0);
            this.LikedList.set([])
        }
        else{
            localStorage.setItem("wishList","[]")
            this.wishListService.productsNumberInWishList.set(0);
            this.LikedList.set([])
        }
    }
    
}
