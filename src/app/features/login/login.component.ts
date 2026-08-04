import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { FlowbiteService } from '../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/Auth/services/auth.service';
@Component({
  selector: 'app-login',
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private readonly fb=inject(FormBuilder);
  private readonly authService=inject(AuthService);
  private readonly router=inject(Router);
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
      this.router.navigate(["/home"]);
    }
   })
 }
 else
  this.loginForm.markAllAsTouched();
}

}
