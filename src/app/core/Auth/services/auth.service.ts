import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient=inject(HttpClient);
  private readonly pLATFORM_ID=inject(PLATFORM_ID);
  isLogged=signal<boolean>(false);
constructor(){
    if(isPlatformBrowser(this.pLATFORM_ID)){
        if(localStorage.getItem("E-CommerceToken")){
          this.verifyToken().subscribe({
             next: (res) => {
              console.log(res);
                if(res.message =="verified")
                     this.isLogged.set(true)
              },
        error: (err) => {
          localStorage.removeItem('E-CommerceToken');
          this.isLogged.set(false);
        }
        })
    }
  }
}

  signUp(body:object):Observable<any>{
   return this.httpClient.post(environment.baseUrl+`/api/v1/auth/signup`,body)
  }
    signIn(body:object):Observable<any>{
   return this.httpClient.post(environment.baseUrl+`/api/v1/auth/signin`,body)
  }
  forgotPassword(body:object):Observable<any>{
   return this.httpClient.post(environment.baseUrl+`/api/v1/auth/forgotPasswords`,body)
  }
    verifyCode(body:object):Observable<any>{
   return this.httpClient.post(environment.baseUrl+`/api/v1/auth/verifyResetCode`,body)
  }
      resetPassword(body:object):Observable<any>{
   return this.httpClient.put(environment.baseUrl+`/api/v1/auth/resetPassword`,body)
  }

  verifyToken():Observable<any>{
    return this.httpClient.get(environment.baseUrl+`/api/v1/auth/verifyToken`)
  }

}
