import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewsService {
  private readonly httpClient=inject(HttpClient);
  getReviewsForProduct(productId:string): Observable<any> {
    return this.httpClient.get(environment.baseUrl+`/api/v1/products/${productId}/reviews`)
  }
  createReview(productId:string,body:object): Observable<any>{
    return this.httpClient.post(environment.baseUrl+`/api/v1/products/${productId}/reviews`,body)
  }
}

