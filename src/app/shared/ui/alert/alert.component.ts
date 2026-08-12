import { Component, computed, input, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-alert',
  imports: [ReactiveFormsModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
})
export class AlertComponent {
  formGroup=input.required<FormGroup>();
  inputName=input.required<string>();
  errorType=input.required<string>();
  errorType2=input<string>("");
   Controller =computed(  ()=>this.formGroup().get(this.inputName()))
}
