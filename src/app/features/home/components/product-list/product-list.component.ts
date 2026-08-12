import { ChangeDetectorRef, Component, computed, effect, inject, input, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { IProduct } from '../../../../core/modules/iproduct.interface';
import { ProductsService } from '../../../../core/services/products.service';
import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { HeaderComponent } from "../../../../shared/ui/header/header.component";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core/Auth/services/auth.service';
import { WishListService } from '../../../../core/services/wish-list.service';
import { CartService } from '../../../../core/services/cart.service';
import {NgxPaginationModule} from 'ngx-pagination'; 
import { FilterService } from '../../../../core/services/fillteration.service';
import { toObservable } from '@angular/core/rxjs-interop';
type nullableNumber=number|null;
@Component({
  selector: 'app-product-list',
  imports: [CurrencyPipe, HeaderComponent, RouterLink,NgxPaginationModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
  
})
export class ProductListComponent implements OnInit {
  productList=signal<IProduct[]>([]);
  wishList=signal<IProduct[]>([]);
  pageLimit=signal<number>(0);    
  currentPage=signal<number>(0);    
  total=signal<number>(0);
  private cdr = inject(ChangeDetectorRef);

  stars: number[] = [1, 2, 3, 4, 5];
  private readonly productsService=inject(ProductsService)
  private readonly wishListService=inject(WishListService)
  private readonly cartService=inject(CartService)
  private readonly toastrService=inject(ToastrService)
  private readonly authService=inject(AuthService)
  private readonly pLATFORM_ID=inject(PLATFORM_ID)
  private readonly router = inject(Router);
  private readonly filterService=inject(FilterService)
  private readonly activatedRoute=inject(ActivatedRoute)
 private search = toObservable(this.filterService.searchedInputValue);
  constructor() {
    effect(() => {
      const selectedCategories = this.filterService.selectedCategories();
      const selectedBrands = this.filterService.selectedBrands();
      const selectedMinPrice = this.filterService.selectedMinPrice();
      const selectedMaxPrice = this.filterService.selectedMaxPrice();
      if(this.router.url == '/shop'){
         this.getAllProducts(1,15,selectedCategories,selectedBrands,selectedMinPrice,selectedMaxPrice)
      }

     
    });
    //   effect(() => {
    //   const searchedInputValue=this.filterService.searchedInputValue();
    //   if(searchedInputValue){
    //       this.getAllProducts(1,50)
    //      const searchedList= this.productList().filter(prooduct=>prooduct.title===searchedInputValue)
    //       this.update(searchedList)
    //   }
    //   else{
    //        this.getAllProducts(1,15);
    //   }
    // });
  }
  // update(searchedList:any){
  //      this.productList.set(searchedList)
  // }

  ngOnInit() {
   if(isPlatformBrowser(this.pLATFORM_ID)){
    if(this.isShopPage()){
      this.search.subscribe((searchValue) => {
        // searched part 
      if (searchValue.trim() !== '') {
        this.getAllProducts(1, 50);

      } 
      else {
        this.getAllProducts(1, 15);
      }
    });
    }
      // brand page
      else if(this.router.url.includes('/brand')){
        let brandList:string[]=[];
           this.activatedRoute.paramMap.subscribe(param => {
                brandList.push(param.get("id")!)
           })
           this.getAllProducts(1,40,[],brandList)
      } 
            // category page
      else if (this.router.url.includes('/category')) {
          this.activatedRoute.paramMap.subscribe(param => {
            const id = param.get("id");
            if (id) {
              this.getAllProducts(1, 40, [id], []);
            }
          });
        }
      // homePage
    else{
       this.getAllProducts();
    }
   }
  }

  getAllProducts(pageNumber:number=1,limitCount:number=40,categories?: string[],
      brands?: string[],
      minPrice?:nullableNumber,
      maxPrice?:nullableNumber){

    return this.productsService.getAllProducts(pageNumber,limitCount,categories,brands,minPrice,maxPrice).subscribe({
      next:(res)=> {
        console.log(res.data,"ress");
         this.pageLimit.set(res.metadata.limit)
         this.currentPage.set(res.metadata.currentPage)
          this.total.set(res.results)
        if(isPlatformBrowser(this.pLATFORM_ID)){
            if(this.authService.isLogged()){
             this.getUserWishList(res.data,res.metadata.limit);
             this.getAllProductsInCart();
            }
            else{
             const productInWishList= JSON.parse( localStorage.getItem("wishList")!)??[];
            let newProductList=res.data.map((product: IProduct) => ({
                ...product,
                isLiked: productInWishList.some((productInWishList: IProduct)=> productInWishList._id === product._id)
              }));
               this.productList.set(newProductList);
                         // search part
                   if(res.metadata.limit==50){
                     this.applySearchFilterAndSet(newProductList)
                   }
                
            }
        }

      },
      error:(err)=> {
        console.log(err);
      }
    })
  }

  applySearchFilterAndSet(products: IProduct[]) {
         const searchedList=products.filter((product:IProduct) =>
            product.title.toLowerCase().trim().includes(this.filterService.searchedInputValue().toLowerCase().trim())
          );
            this.productList.set(searchedList)
  }

  getUserWishList(productList: IProduct[],limit?:number) {
    this.wishListService.getUserWishList().subscribe({
      next: (res)=> {
       console.log(res);
     let newProductList=productList.map((product: IProduct) => ({
       ...product,
     isLiked: res.data.some((productInWishList: IProduct)=> productInWishList._id === product._id)
      }));
      this.wishList.set(res.data);
       console.log( this.wishList(),"wishlist");
       this.productList.set(newProductList);
       if(limit==50){
        this.applySearchFilterAndSet(newProductList);
       }
    this.wishListService.productsNumberInWishList.set(res.count);
       },
       error:(err)=> {
        console.log(err);
       }
     })
    
  }

  getAllProductsInCart(){
    this.cartService.getAllProductsInCart().subscribe({
      next:(res)=> {
          console.log(res);
              let newCountCart=0;
              res.data.products.forEach((product:any) => {
                newCountCart+=product.count
              });
              this.cartService.productsNumberInCart.set(newCountCart);
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

  addProductToCart(productId:string):void{
    if(this.authService.isLogged()){
      // user logged
        this.addProductTocart(productId);
        this.cartService.productsNumberInCart.update(productsNumberInCart => productsNumberInCart+1)

    }
    else{
       let productsListCart=JSON.parse( localStorage.getItem("cartList")!)??[];
     let productCarted= this.productList().find(product => product._id === productId);
    let newProductsNumber= productsListCart.push(productCarted)
       localStorage.setItem("cartList",JSON.stringify( productsListCart ) )
      this.cartService.productsNumberInCart.set(newProductsNumber);
      this.toastrService.success("Product added to cart","Betak",{closeButton:true,extendedTimeOut: 5000,timeOut:5000,progressBar:true,progressAnimation:"increasing"})

    }
  }

    addProductTocart(productId:string){
         this.cartService.addProductTocart(productId).subscribe({
          next: (res)=>{
              console.log(res);
            this.toastrService.success("Product added to cart","Betak",{closeButton:true,extendedTimeOut: 5000,timeOut:5000,progressBar:true,progressAnimation:"increasing"})
          },
          error: (err)=>{
            console.log(err);
          }
         }) 
    }

    addOrRemovewishList(productId:string):void{
        if(this.authService.isLogged()){
          // user logged
            const productIndex:number= this.wishList().findIndex(product=>product._id === productId)
            console.log("productIndex",productIndex)
            if(productIndex==-1)
                this.addProductToWishList(productId);
              
            else
              this.removeProductFromWishList(productId);
        }
        else{
          let productsListInWishList=JSON.parse( localStorage.getItem("wishList")!)??[];
        //    this.productList().forEach(product => {
        //   if(product._id === productId){
        //    product.isLiked=true;
        //   }
        //  })
        let productAddedToWishList= this.productList().find(product => product._id === productId);
          const productIndex= productsListInWishList.findIndex(
              (product: IProduct) => product._id === productAddedToWishList?._id);
          let newProductsNumber;
          if(productIndex!=-1){
              productAddedToWishList!.isLiked=false;
              productsListInWishList.splice(productIndex, 1);
              newProductsNumber=productsListInWishList.length ;
                this.toastrService.success("Product removed from wishlist","Betak",{closeButton:true,extendedTimeOut: 5000,timeOut:5000,progressBar:true,progressAnimation:"increasing"})

          }
          else{
              productAddedToWishList!.isLiked=true;
                  newProductsNumber= productsListInWishList.push(productAddedToWishList)
                this.toastrService.success("Product added to wishlist","Betak",{closeButton:true,extendedTimeOut: 5000,timeOut:5000,progressBar:true,progressAnimation:"increasing"})

          }
          localStorage.setItem("wishList",JSON.stringify( productsListInWishList ) )
          this.wishListService.productsNumberInWishList.set(newProductsNumber);

        }
      }
      addProductToWishList(productId:string){
        this.wishListService.addProductToWishList(productId).subscribe({
            next:(res) => {
               console.log(res);
               this.getUserWishList(this.productList());
          this.toastrService.success("Product added to wishlist","Betak",{closeButton:true,extendedTimeOut: 5000,timeOut:5000,progressBar:true,progressAnimation:"increasing"})

            }
          })
        }
      removeProductFromWishList(productId: string){
        this.wishListService.removeProductFromWishList(productId).subscribe({
          next:(res) => {
              console.log(res);
              this.getUserWishList(this.productList());
          this.toastrService.success("Product removed from wishlist","Betak",{closeButton:true,extendedTimeOut: 5000,timeOut:5000,progressBar:true,progressAnimation:"increasing"})

          }  ,
          error: (res)=>{
            console.log(res);
          }
        })
      }

      pageChanged(pageNumber:number){
          this.getAllProducts(pageNumber,15);
      }

      isShopPage(): boolean {
          return this.router.url.includes('/shop');
      }


      // AddingCategoryParam(categoryId:string){
      //     this.params.update(param=>param+=`category[in]=${categoryId}`)
      // }
      // AddingBrandParam(brandId:string){
      //     this.params.update(param=>param+=`brand=${brandId}`)
      // }
      // adding

changeImg(product: IProduct) {
  if (!product.images || product.images.length === 0) return;
  const nextImage = product.images.shift()!;
  product.images.push(product.imageCover);
  product.imageCover = nextImage;
  this.cdr.markForCheck();
}
      

}
