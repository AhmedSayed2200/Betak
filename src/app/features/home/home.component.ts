import { AfterViewInit, Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { IProduct } from '../../core/modules/iproduct.interface';
import { ProductListComponent } from "./components/product-list/product-list.component";
import { MainSliderComponent } from "./components/main-slider/main-slider.component";
import { HeaderComponent } from "../../shared/ui/header/header.component";
import { SliderCategoryComponent } from "./components/slider-category/slider-category.component";
import * as AOS from 'aos';
@Component({
  selector: 'app-home',
  imports: [ProductListComponent, MainSliderComponent, HeaderComponent, SliderCategoryComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent  {
 ngOnInit() {
    AOS.init({
      duration: 1200,
      once: false,  
      easing: 'ease-out-cubic',
    });
  }
}
