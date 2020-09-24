import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignupRequestPayload } from 'src/app/components/auth/signup/signup-request.payload';
import { Observable } from 'rxjs';
import { LoginRequestPayload } from 'src/app/components/login/login.request.payload'
import { LoginResponse } from 'src/app/components/login/login.response.payload'
import {LocalStorageService} from 'ngx-webstorage'
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

 
 
  //we extract refresh token and a username from local storage
  refreshTokenPayload = {
    refreshToken: this.getRefreshToken(),
    username: this.getUserName()
  }
 
  signupUrl = 'http://localhost:8080/api/auth/signup'
  loginUrl = 'http://localhost:8080/api/auth/login'
  refreshTokenUrl = 'http://localhost:8080/api/auth/refresh/token'

  //add a localstorage dependency
  constructor(private httpClient: HttpClient,
    private localStorage: LocalStorageService) { }

  signup(signupRequestPayload: SignupRequestPayload): Observable<any>{
      return this.httpClient.post(this.signupUrl, signupRequestPayload, { responseType: 'text' });
  }


  //we need to get webtokens as a response so we created a class to accept it
    //post<LoginResponse> returns this response.
    //we need to map the response to extract data from it
    //before that we need to add ngx-webstorage to hold tokens. need to add a dependency to package.jasmine-open
    //then npm instll and then add it to appmodule.ts
  login(loginRequestPayload: LoginRequestPayload): Observable<boolean> {
    return this.httpClient.post<LoginResponse>('http://localhost:8080/api/auth/login',
      loginRequestPayload).pipe(map(data => {
        this.localStorage.store('authenticationToken', data.authenticationToken);
        this.localStorage.store('username', data.username);
        this.localStorage.store('refreshToken', data.refreshToken);
        this.localStorage.store('expiresAt', data.expiresAt);
        return true;
        console.log('Data saved in browser memory');
      }));
  }


refreshToken() {
  //now we pass refresh token and username to to spring and 
  //we receive a response the same as LoginResponse.ts with a new token
  return this.httpClient.post<LoginResponse>(this.refreshTokenUrl, this.refreshTokenPayload)
  //and we handle new data from spring and map received token and other data to  local storage
  .pipe(tap(response => {
    //we delete old invalid token
    this.localStorage.clear('authenticationToken');
    this.localStorage.clear('expiresAt')

    //we assign new token
    this.localStorage.store('authenticationToken', response.authenticationToken);
    this.localStorage.store('expiresAt', response.expiresAt);
  }));
}


getUserName() {
  return this.localStorage.retrieve('username')  
}

getRefreshToken() {
  return this.localStorage.retrieve('refreshToken') 
}

 //we retrieve a token from a local storage
 getJwtToken() {
  return this.localStorage.retrieve('authenticationToken')
  }


}
