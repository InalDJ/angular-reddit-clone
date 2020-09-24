import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, from, Observable, throwError } from 'rxjs';
import {AuthService} from './services/auth/shared/auth.service'
import { catchError, switchMap } from 'rxjs/operators';
import { LoginResponse } from './components/login/login.response.payload'


//This class is like "filter" in java
//angular needs to add a token to each get or post, delete etc method
//we set it up to intercept all the requests and add a toke there and check for a refresh token
@Injectable({
    providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {

    isTokenRefreshing = false;
    //These subjects blocks outgoing calls
    //these behaivorSubjects can have a value assigned to them
    //when we refresh a token and get a new token we assign it to it
    refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject(null);

    constructor(public authService: AuthService){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>   {
       
        const jwtToken = this.authService.getJwtToken();

        //if the token is valid we add it to authorization headers like in postman
        if(jwtToken) {
            this.addToken(req, jwtToken);
        }
        //this method handles the process if the token is valid
        return next.handle(req)
        //if the token is invalid we get an error from spring so we need to handle it
        .pipe(catchError(error => {
            if(error instanceof HttpErrorResponse && error.status === 403){
                return this.handleAuthErrors(req, next);
            } else {
                return throwError(error);
            }
        }));
    }

    //this is a method to add tokens to the header
    addToken(req: HttpRequest<any>, jwtToken: any){
        return req.clone({
            headers: req.headers.set('Authorization',
            'Bearer ' + jwtToken)
        });
    }

    private handleAuthErrors(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if(!this.isTokenRefreshing) {
            this.isTokenRefreshing = true;
            this.refreshTokenSubject.next(null);

            //when we get an error from an invalid token
            //we block all the requests
            //then after we get a new token we recommence all the requests
            //then refresh token accepts 2 fields: refreshToken and username
            return this.authService.refreshToken().pipe(
                switchMap((refreshTokenResponse: LoginResponse) => {
                    this.isTokenRefreshing = false;
                    this.refreshTokenSubject
                        .next(refreshTokenResponse.authenticationToken);
                    return next.handle(this.addToken(req,
                        refreshTokenResponse.authenticationToken));
                })
            )
        } 
    }
}