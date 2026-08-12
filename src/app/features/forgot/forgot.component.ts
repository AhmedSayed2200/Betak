import { AfterViewInit, Component, ElementRef, inject, signal, viewChildren, ViewChildren } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators,FormsModule } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../core/Auth/services/auth.service';
import { ResetHeaderComponent } from "./Components/reset-header/reset-header.component";

@Component({
  selector: 'app-forgot',
  imports: [ReactiveFormsModule, RouterLink, ResetHeaderComponent,FormsModule],
  templateUrl: './forgot.component.html',
  styleUrl: './forgot.component.css',
})
export class ForgotComponent {
  step=signal<"email" | "verifyCode" | "newPassword">("email");
  code=signal<string>("");
  private readonly authService=inject(AuthService)
  private readonly router=inject(Router)
  emailInput:FormControl=new FormControl("",[Validators.required,Validators.email]);
  verifyCodeInput:FormControl=new FormControl("",[Validators.required,
  Validators.pattern(/^[0-9]+$/)]);
  resetPasswordInput:FormControl=new FormControl("",[Validators.required,Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]);

  submitEmail(event:Event){
    event.preventDefault();
   if(this.emailInput.valid){
     const emailInputValue={
      email:this.emailInput.value
    };
   this.authService.forgotPassword(emailInputValue).subscribe({
      next:(res)=>{
        console.log(res); 
        this.step.set("verifyCode");
      }
   })
   }else{
    this.emailInput.markAsTouched();  
   }
  }


verifyCode(event:Event){
    event.preventDefault();
   if(this.verifyCodeInput.valid){
     const verifyCodeInputValue={
      resetCode:this.verifyCodeInput.value
    };
   this.authService.verifyCode(verifyCodeInputValue).subscribe({
      next:(res)=>{
        console.log(res);
      this.step.set("newPassword");
      },
      error: (err)=>{
        console.log(err);
      }
   })
   }else{
    this.verifyCodeInput.markAsTouched();  
   }
  }

  submitPassword(event:Event){
    event.preventDefault();
   if(this.resetPasswordInput.valid){
     const resetPasswordInputValue={
      email:this.emailInput.value,
      newPassword:this.resetPasswordInput.value
    };
   this.authService.resetPassword(resetPasswordInputValue).subscribe({
      next:(res)=>{
        console.log(res);
       this.router.navigate(["/login"])
      },
      error: (err)=>{
          console.log(err);
      }
   })
   }else{
    this.resetPasswordInput.markAsTouched();  
   }
  }



onPaste(event: ClipboardEvent) {
  const pastedData = event.clipboardData?.getData('text').trim() || '';
  this.code.set(pastedData);
}



}
