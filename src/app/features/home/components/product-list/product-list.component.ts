import { Component, inject, OnInit, signal } from '@angular/core';
import { IProduct } from '../../../../core/modules/iproduct.interface';
import { ProductsService } from '../../../../core/services/products.service';
import { CurrencyPipe } from '@angular/common';
import { HeaderComponent } from "../../../../shared/ui/header/header.component";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-product-list',
  imports: [CurrencyPipe, HeaderComponent, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  productList=signal<IProduct[]>([]);
  stars: number[] = [1, 2, 3, 4, 5];
  private readonly productsService=inject(ProductsService)
  
  ngOnInit() {
     this.getAllProducts();
  }

  getAllProducts(){
    return this.productsService.getAllProducts().subscribe({
      next:(res)=> {
        console.log(res);
        this.productList.set(res.data);
      },
      error:(err)=> {
        console.log(err);
      }
    })
  }


  getShortTitle(title: string, limit: number = 15): string {
  if (!title) return '';
   if (title.length <= limit) {
    return title; 
  }
   return title.slice(0, limit).trim() + '...';
}

calcDiscount(price: number, priceAfterDiscount: number):Number{
  const discount = ((price - priceAfterDiscount) / price) * 100;
  return Math.round(discount);
}

}
