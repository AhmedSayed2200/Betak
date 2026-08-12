import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { FlowbiteService } from '../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/Auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { IProduct } from '../../core/modules/iproduct.interface';
import { WishListService } from '../../core/services/wish-list.service';
import { CartService } from '../../core/services/cart.service';
import { AlertComponent } from "../../shared/ui/alert/alert.component";
@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, AlertComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private readonly fb=inject(FormBuilder);
  private readonly authService=inject(AuthService);
  private readonly router=inject(Router);
  private readonly toastrService=inject(ToastrService);
  private readonly wishListService=inject(WishListService);
  private readonly cartService=inject(CartService);
   constructor(private flowbiteService: FlowbiteService) {}
  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
  }
  loginForm: FormGroup = this.fb.group({
  email: ["", [Validators.required, Validators.email]],
  password: ["", [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]],

});



loginSubmit(){
 if(this.loginForm.valid){
   this.authService.signIn(this.loginForm.value).subscribe({
    next:(res)=>{
      localStorage.setItem("E-CommerceToken", res.token);
      localStorage.setItem("E-CommerceUser", JSON.stringify(res.user));
      this.authService.isLogged.set(true);

      const wishList:IProduct[]=JSON.parse(localStorage.getItem("wishList")!)??[];
        wishList.forEach(product => {
         this.addProductToWishList(product._id);
        })
        localStorage.removeItem("wishList");

        const cartList:IProduct[]=JSON.parse(localStorage.getItem("cartList")!)??[];
        wishList.forEach(product => {
         this.addProductToCart(product._id);
        })
        localStorage.removeItem("cartList");
      this.toastrService.success("Welcome in your home","Betak",{closeButton:true,extendedTimeOut: 5000,timeOut:5000,progressBar:true,progressAnimation:"increasing"})
      this.router.navigate(["/home"]);
    }
   })
 }
 else
  this.loginForm.markAllAsTouched();
}
addProductToCart(productId:string) {
  this.cartService.addProductTocart(productId).subscribe({
    next:(res)=>{
        console.log(res);
    },
    error:(err)=>{
      console.log(err);
    }
  })
}
addProductToWishList(productId:string){
   this.wishListService.addProductToWishList(productId).subscribe({
    next:(res)=>{
      console.log(res);
    },
    error:(err)=>{
      console.log(err);
    } 
   })
}


}
