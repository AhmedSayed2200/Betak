import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
  type nullableNumber=number|null;

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly httpClient= inject(HttpClient);
  getAllProducts(pageNumber?: nullableNumber,limitCount?:nullableNumber,categories?: string[],
      brands?: string[],
      minPrice?:nullableNumber,
      maxPrice?:nullableNumber): Observable<any> {
      let params = new HttpParams();
      if(pageNumber){
        params = params.append('page',pageNumber.toString());
      }
      if(limitCount){
        params = params.append('limit',limitCount.toString());
      }
      if(categories){
            categories.forEach(id => {
            params = params.append('category[in]', id);
          });
      }
      if(brands){
            brands.forEach(id => {
            params = params.append('brand', id);
          });
      }
      if(minPrice|| minPrice===0){
        params = params.append("price[gte]",minPrice.toString())
      }
      if(maxPrice || maxPrice===0){
        params = params.append("price[lte]",maxPrice.toString())
      }
      console.log(environment.baseUrl+`/api/v1/products`,{params},"parammmmmmmmmmmmmmmmmmmmmmmmm");
    return this.httpClient.get(environment.baseUrl+`/api/v1/products`,{params});
  }
  getProductsById(productId:string):Observable<any>{
    return this.httpClient.get(environment.baseUrl+`/api/v1/products/${productId}`);
  }
  
}
