import { Component, inject, OnInit } from '@angular/core';
import { FlowbiteService } from '../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { Router, RouterLink } from "@angular/router";
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/Auth/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  constructor(private flowbiteService: FlowbiteService) {}

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
  }
  
  registerForm: FormGroup = this.fb.group({
    name: ["", [Validators.required, Validators.minLength(3)]],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]],
    rePassword: ["", [Validators.required]],
    phone: ["", [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
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

  registerSubmit() {
    if (this.registerForm.valid) {
      this.authService.signUp(this.registerForm.value).subscribe({
        next: (res)=>{
          this.router.navigate(["/login"]);
        }
      })
    } else {

      this.registerForm.markAllAsTouched();
    }
  }
}