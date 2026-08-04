import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';

@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  private readonly ActivatedRoute=inject(ActivatedRoute);
  private readonly productsService=inject(ProductsService)
  productId=signal<string>("");
  ngOnInit(): void {
    this.ActivatedRoute.paramMap.subscribe((param) => {
      this.productId.set(param.get("id")!);
    }) 
    this.getProductById(this.productId())
  }
  getProductById(productId:string) {
      this.productsService.getProductsById(productId).subscribe({
        next:(res) => {
          console.log(res);
        },
        error:(err) => {
            console.log(err); 
        }
      })
  }

  
}
