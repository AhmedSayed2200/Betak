import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { IProduct } from '../../core/modules/iproduct.interface';
import { CurrencyPipe } from '@angular/common';
import { ReviewsService } from './Services/reviews.service';
import { IReviews } from './modules/ireviews.interface';
import { FormBuilder, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from '../../shared/ui/alert/alert.component';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../core/services/cart.service';
import { WishListService } from '../../core/services/wish-list.service';

@Component({
  selector: 'app-details',
  imports: [CurrencyPipe, ɵInternalFormsSharedModule, ReactiveFormsModule,AlertComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DetailsComponent implements OnInit {
  private readonly ActivatedRoute=inject(ActivatedRoute);
  private readonly productsService=inject(ProductsService)
  private readonly reviewsService=inject(ReviewsService)
  private readonly cartService=inject(CartService)
  private readonly wishListService=inject(WishListService)
  private readonly fb=inject(FormBuilder)
  private readonly toastrService=inject(ToastrService)
  productId=signal<string>("");
  product=signal<IProduct>({} as IProduct);
  reviewsList=signal<IReviews[]>([]);
  detailsPart=signal<"Details"|"Reviews"|"Returns">("Details");
  stars: number[] = [1, 2, 3, 4, 5];
  ngOnInit(): void {
    this.ActivatedRoute.paramMap.subscribe((param) => {
      this.productId.set(param.get("id")!);
    }) 
    this.getProductById(this.productId())
  }

  reviewForm: FormGroup = this.fb.group({
    review: ["", [Validators.required, Validators.minLength(3),Validators.maxLength(50)]],
    rating: ["", [Validators.required]],
  });

  getProductById(productId:string) {
      this.productsService.getProductsById(productId).subscribe({
        next:(res) => {
          console.log(res);
          this.product.set(res.data);
        },
        error:(err) => {
            console.log(err); 
        }
      })
  }

  getReviewsForProduct(productId:string) {
    this.reviewsService.getReviewsForProduct(productId).subscribe({
      next:(res) => {
           console.log(res,"revie");
           this.reviewsList.set(res.data);  
           this.detailsPart.set('Reviews'); 
      },
        error:(err) => {
              console.log(err); 
        } 
    })
  }



  calcRatingRatio(): Record<number, number> {
      const reviews = this.reviewsList();
      if (!reviews || reviews.length === 0) {
        return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      }
      const total = reviews.length;
      const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

      reviews.forEach((review: IReviews) => {
        if (counts[review.rating] !== undefined) {
          counts[review.rating]++;
        }
      });

      return {
        5: Math.round((counts[5] / total) * 100),
        4: Math.round((counts[4] / total) * 100),
        3: Math.round((counts[3] / total) * 100),
        2: Math.round((counts[2] / total) * 100),
        1: Math.round((counts[1] / total) * 100)
      };
}
  
  reviewSubmit(){
      if (this.reviewForm.valid) {
        console.log(this.reviewForm.value,"dsafasdofbofbdsb");
        this.createReview(this.productId(),this.reviewForm.value);
          this.toastrService.success("review added successfully!","Betak",{closeButton:true,extendedTimeOut: 5000,timeOut:5000,progressBar:true,progressAnimation:"increasing"})
        this.reviewForm.reset({
  rating: '', 
  review: ''  
});
        
      } else {

        this.reviewForm.markAllAsTouched();
      }
  }
   createReview(productId:string,body:object){
      this.reviewsService.createReview(productId,body).subscribe({
          next:(res) => {
              console.log(res);
          },
        error:(err)=> {
              console.log(err); 
            }  
      })
   }

   addProductTocart(productId:string){
    this.cartService.addProductTocart(productId).subscribe({
      next:(res) => {
        console.log(res);
                          let temCount=0;
                  res.data.products.forEach((product:any) => {
                        temCount+=product.count
                  });
                  this.cartService.productsNumberInCart.set(temCount);
                this.toastrService.success("Product added to cart","Betak",{closeButton:true,extendedTimeOut: 5000,timeOut:5000,progressBar:true,progressAnimation:"increasing"})
      },
      error:(err)=> {
        console.log(err);
      }
    })
   }


   addProductToWishList(productId:string){
      this.wishListService.addProductToWishList(productId).subscribe({
        next:(res) => {
            console.log(res),"dfgdfgdfg"; 
            this.wishListService.productsNumberInWishList.set(res.data.length)
          this.toastrService.success("Product added to wishlist","Betak",{closeButton:true,extendedTimeOut: 5000,timeOut:5000,progressBar:true,progressAnimation:"increasing"})
        },
          error:(err)=> {
              console.log (err);
          }
      })
   }

  // calcRatingRatio():object{
    
  //       if (!this.reviewsList()) {
  //              return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  //       }
  //     const total = this.reviewsList().length;
  //     const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  //     this.reviewsList().forEach((review:IReviews) => {
  //       counts[review.rating]++;
  //     });
  //           return {
  //       5: Math.round((counts[5] / total) * 100),
  //       4: Math.round((counts[4] / total) * 100),
  //       3: Math.round((counts[3] / total) * 100),
  //       2: Math.round((counts[2] / total) * 100),
  //       1: Math.round((counts[1] / total) * 100)
  //     };
  // }

//    calculateRatingPercentages(reviewsData) {
//       if (!reviewsData || reviewsData.length === 0) {
//         return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
//       }
//       const total = reviewsData.length;
//       const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
//       reviewsData.forEach(item => {
//         counts[item.rating]++;
//       });
//       return {
//         5: Math.round((counts[5] / total) * 100),
//         4: Math.round((counts[4] / total) * 100),
//         3: Math.round((counts[3] / total) * 100),
//         2: Math.round((counts[2] / total) * 100),
//         1: Math.round((counts[1] / total) * 100)
//       };
// }

}
