import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { HeaderComponent } from '../../shared/ui/header/header.component';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertComponent } from '../../shared/ui/alert/alert.component';
import { CartService } from '../../core/services/cart.service';
import { ProfileService } from '../profile/Services/profile.service';
import { IProfile } from '../profile/iprofile.interface';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-checkout',
  imports: [HeaderComponent, RouterLink, AlertComponent, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  private readonly fb = inject(FormBuilder);
  private readonly cartService = inject(CartService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly profileService = inject(ProfileService);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  cartId=signal<string>("");
  addressList=signal<IProfile[]>([]);
    checkoutForm: FormGroup = this.fb.group({
        shippingAddress: this.fb.group({
            details: ["", [Validators.required,  Validators.minLength(10),Validators.maxLength(60)]],
            phone: ["", [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]], 
            city: ["", [Validators.required, Validators.minLength(1),Validators.maxLength(58)]]
      })
  });
    ngOnInit(): void {
          this.activatedRoute.paramMap.subscribe(params => {
              this.cartId.set(params.get("id")!)
          })
          if(isPlatformBrowser(this.pLATFORM_ID))
                this.gatAllAddress()
    }
    checkoutSubmit() {
    if (this.checkoutForm.valid) {
         const radioInput:HTMLInputElement= document.querySelector("input[type='radio']:checked")!;
         if(radioInput.value==="cash"){
            console.log("cash");
            this.createCashOrder(this.checkoutForm.value);
         }
         else{
             console.log("visa");
             this.createVisaOrder(this.checkoutForm.value);
         }
    } else {

      this.checkoutForm.markAllAsTouched();
    }
  }
  createCashOrder(body:object){
    this.cartService.createCashOrder(this.cartId(),body).subscribe({
      next:(res)=>{
        this.router.navigate(["/allorders"])
      },
      error:(err)=>{
          console.log(err);
      }
    })
  }
  createVisaOrder(body:object){
    this.cartService.createVisaOrder(this.cartId(),body).subscribe({
      next:(res)=>{
        window.open(res.session.url,"_self")
      },
      error:(err)=>{
          console.log(err);
      }
    })
  }

  gatAllAddress(){
    this.profileService.gatAllAddress().subscribe({
      next:(res)=>{
        this.addressList.set(res.data)
      }
    })
  }

  displayAddress(event:Event){
    const inputName =event.target as HTMLInputElement;
    const selectedAddress:IProfile|undefined= this.addressList().find(address=>
                         inputName.value.trim()==address.name.trim()
    )
    if(selectedAddress){
      this.checkoutForm.patchValue({
      shippingAddress: {
        details: selectedAddress.details,
        phone: selectedAddress.phone,
        city: selectedAddress.city,
      }
    })
      console.log(selectedAddress ,"selectedAddress")
    }
    else if( inputName.value.trim()==="Your Stored Addresses :"){
           inputName.value="";
      }

    // if(selectedAddress){
    //     this.getAddressById(selectedAddress._id);
    // }
  }
  // getAddressById(addressId:string){
  //   this.profileService.getAddressById(addressId).subscribe({
  //     next:(res)=>{
  //         console.log(res);
  //     },
  //     error:(err)=>{
  //       console.log(err);
  //     }
  //   })
  // }
}
