import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly httpClient=inject(HttpClient)
  gatAllAddress():Observable<any>{
    return this.httpClient.get(environment.baseUrl+`/api/v1/addresses`)
  }
  addAddress(body:object):Observable<any>{
    return this.httpClient.post(environment.baseUrl+`/api/v1/addresses`,body)
  }

  removeAddress(addressId:string):Observable<any>{
    return this.httpClient.delete(environment.baseUrl+`/api/v1/addresses/${addressId}`)
  }
  // getAddressById(addressId:string):Observable<any>{
  //    return this.httpClient.get(environment.baseUrl+`/api/v1/addresses/${addressId}`)
  // }
  updateUserInfo(body:object):Observable<any>{
    return this.httpClient.put(environment.baseUrl+`/api/v1/users/updateMe/`,body)
  }
  updatePassword(body:object):Observable<any>{
    return this.httpClient.put(environment.baseUrl+`/api/v1/users/changeMyPassword`,body)
  }
}
