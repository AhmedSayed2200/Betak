import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient=inject(HttpClient);

  signUp(body:object):Observable<any>{
   return this.httpClient.post(environment.baseUrl+`/api/v1/auth/signup`,body)
  }
    signIn(body:object):Observable<any>{
   return this.httpClient.post(environment.baseUrl+`/api/v1/auth/signin`,body)
  }
}
