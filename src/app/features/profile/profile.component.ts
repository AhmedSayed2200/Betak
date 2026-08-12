import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { ProfileService } from './Services/profile.service';
import { IProfile } from './iprofile.interface';
import { AuthService } from '../../core/Auth/services/auth.service';
import { platform } from 'os';
import { isPlatformBrowser } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertComponent } from '../../shared/ui/alert/alert.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  imports: [RouterLink,ReactiveFormsModule,AlertComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  addressList=signal<IProfile[]>([]);
  isFormAddressAppear=signal<boolean>(false);
  isEditAddress=signal<boolean>(false);
  profilePart=signal<"addresses"|"setting">("addresses")
  private readonly profileService=inject(ProfileService)
  private readonly toastrService=inject(ToastrService)
  private readonly authService=inject(AuthService)
  private readonly router=inject(Router)
  private readonly pLATFORM_ID=inject(PLATFORM_ID)
  private readonly fb=inject(FormBuilder)
  addressForm: FormGroup = this.fb.group({
       name: ["", [Validators.required, Validators.minLength(1),Validators.maxLength(58)]],
       details: ["", [Validators.required,  Validators.minLength(10),Validators.maxLength(60)]],
       phone: ["", [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]], 
       city: ["", [Validators.required, Validators.minLength(1),Validators.maxLength(58)]]
  });

    profilerForm: FormGroup = this.fb.group({
    name: ["", [Validators.required, Validators.minLength(3),Validators.maxLength(30)]],
    email: ["", [Validators.required, Validators.email]],
    phone: ["", [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
  });

    passwordForm: FormGroup = this.fb.group({
    currentPassword: ["", [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]],
    password: ["", [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]],
    rePassword: ["", [Validators.required]],
  }, { validators: [this.confirmPassword] });

    confirmPassword(group: AbstractControl) {
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;
    const rePasswordControl = group.get('rePassword');

    if (rePassword !== password && rePassword !== "") {
     
      rePasswordControl?.setErrors({ ...rePasswordControl.errors, mismatch: true });
      return { mismatch: true };
    } else {

      if (rePasswordControl?.hasError('mismatch')) {
        delete rePasswordControl.errors?.['mismatch'];
        if (!Object.keys(rePasswordControl.errors || {}).length) {
          rePasswordControl.setErrors(null);
        }
      }
    }

    return null;
  }

  ngOnInit(): void {
    if(isPlatformBrowser(this.pLATFORM_ID))
      this.gatAllAddress();
  }
  gatAllAddress(){
    this.profileService.gatAllAddress().subscribe({
      next:(res)=>{
        this.addressList.set(res.data)
      }
    })
  }
  removeAddress(addressId:string){
    this.profileService.removeAddress(addressId).subscribe({
      next:(res)=>{
         this.addressList.set(res.data)
        if(!this.isEditAddress())
          this.toastrService.success("Address removed to your profile","Betak",{closeButton:true,extendedTimeOut: 5000,timeOut:5000,progressBar:true,progressAnimation:"increasing"})
        
      }
    })
  }
  

  addressSubmit(event:Event) {
    if (this.addressForm.valid) {
        this.addAddress(event,this.addressForm.value);
    } else {
      this.addressForm.markAllAsTouched();
    }
  }

  addAddress(event:Event,body:object){
    this.profileService.addAddress(body).subscribe({
      next:(res)=>{
        console.log(res)
        this.addressList.set(res.data)
        this.isFormAddressAppear.set(false);
        if(!this.isEditAddress())
           this.toastrService.success("Address added successfully!","Betak",{closeButton:true,extendedTimeOut: 5000,timeOut:5000,progressBar:true,progressAnimation:"increasing"})
          else{
           this.toastrService.success("Address updated successfully!","Betak",{closeButton:true,extendedTimeOut: 5000,timeOut:5000,progressBar:true,progressAnimation:"increasing"})
            this.isEditAddress.set(false);
          }
        const form =event.target as HTMLFormElement;
        form.reset()
      },
      error: (err)=>{
          console.log(err)
      }
    })
  }
  edit(address:IProfile){
     this.isFormAddressAppear.set(true);
     this.isEditAddress.set(true);
    this.addressForm.patchValue({
      name: address.name,
      details: address.details,
      phone: address.phone,
      city: address.city
    }); 
    this.removeAddress(address._id);
  }
  cancel(){
     this.addressForm.reset()
     this.isFormAddressAppear.set(false)
  }

   profileSubmit() {
      if (this.profilerForm.valid) {
        console.log(this.profilerForm.value);
        this.updateUserInfo(this.profilerForm.value);
        this.profilerForm.reset()
        
      } else {

        this.profilerForm.markAllAsTouched();
      }
  }

  updateUserInfo(body:object){
     this.profileService.updateUserInfo(body).subscribe({
      next: (res)=>{
          console.log(res)
           this.toastrService.success("profile info updated successfully!","Betak",{closeButton:true,extendedTimeOut: 5000,timeOut:5000,progressBar:true,progressAnimation:"increasing"})
      },
      error: (err)=>{
        console.log(err)
      }
     })
  }

    passwordSubmit() {
      if (this.passwordForm.valid) {
        this.updatePassword(this.passwordForm.value)
        this.passwordForm.reset()
        
      } else {

        this.passwordForm.markAllAsTouched();
      }
  }

  updatePassword(body:object){
      this.profileService.updatePassword(body).subscribe({
        next: (res)=>{
          console.log(res)
           this.toastrService.success("Password updated successfully!","Betak",{closeButton:true,extendedTimeOut: 5000,timeOut:5000,progressBar:true,progressAnimation:"increasing"})
           this. signOut()
        },
        error: (err)=>{
          console.log(err)
        }
      })
  }
    signOut():void{
    localStorage.removeItem("E-CommerceToken");
    localStorage.removeItem("E-CommerceUser");
    this.authService.isLogged.set(false);
    this.router.navigate(["/login"]);
  }
}
