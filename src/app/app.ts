import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./layouts/components/navbar/navbar";
import { Footer } from "./layouts/components/footer/footer";
import { NgxSpinnerComponent } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer,NgxSpinnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css', 
})
export class App {
  protected readonly title = signal('E-Commerce');
}
