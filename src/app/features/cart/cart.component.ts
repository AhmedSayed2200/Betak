import { ChangeDetectorRef, Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { HeaderComponent } from '../../shared/ui/header/header.component';
import { CartService } from '../../core/services/cart.service';
import { IProduct } from '../../core/modules/iproduct.interface';
import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { ICartDetailes } from './modules/icart-detailes.interface';
import { AuthService } from '../../core/Auth/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [HeaderComponent,CurrencyPipe,RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  cartDetails=signal<ICartDetailes>({} as ICartDetailes)
  private readonly cartService=inject(CartService)
  private readonly authService=inject(AuthService)
  private cdr = inject(ChangeDetectorRef);
  private readonly pLATFORM_ID=inject(PLATFORM_ID)
  
  isLogged=computed(()=>this.authService.isLogged)
  ngOnInit(): void {
    if(isPlatformBrowser(this.pLATFORM_ID))
    {
       this.getAllProductInCart()
    }
  }
  getAllProductInCart(){
    this.cartService.getAllProductsInCart().subscribe({
      next:(res)=>{
          console.log("res"); 
          this.cartDetails.set(res.data)
          console.log(this.cartDetails()._id); 
         let count= 0;
        this.cartDetails().products.forEach((product:any) => {
          count+=product.count;
        })
        this.cartService.productsNumberInCart.set(count)
      },
      error:(err)=>{
          console.log(err);
      }
    })
  }

    calcDiscount(price: number, priceAfterDiscount: number):Number{
  const discount = ((price - priceAfterDiscount) / price) * 100;
  return Math.round(discount);
}

  clearAll(){
    this.cartService.removeAllProductFromCart().subscribe({
      next: (res) => {
        console.log(res);
        this.cartService.productsNumberInCart.set(0);
        this.cartDetails().products=[];
        this.cartDetails().totalCartPrice=0;
        this.cdr.detectChanges();
      },
      error: (err) => {
          console.log(err); 
      }
    })
  }


  removeProductFromCart(productId: string){
    this.cartService.removeProductFromCart(productId).subscribe({
      next: (res) => {
        console.log(res);
        this.cartDetails.set(res.data)
      },
      error:(err) => {
          console.log (err);
      }
    })
  }

  
  UpdateCartProductQuantity(productId: string, quantity:number){
    this.cartService.UpdateCartProductQuantity(productId, quantity).subscribe({
      next: (res) => {
        console.log(res.data ,"asdfobrgbeorbg")
        this.cartDetails.set(res.data)
        let count= 0;
        this.cartDetails().products.forEach((product:any) => {
          count+=product.count;
        })
        this.cartService.productsNumberInCart.set(count)
      },
      error:(err)=> {
          console.log(err);
      }
    })
  }
}
