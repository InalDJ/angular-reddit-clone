import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/shared/auth.service';
import { LoginRequestPayload } from './login.request.payload';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loginRequestPayload: LoginRequestPayload;
  registerSuccessMessage: string;
  isError: boolean;

  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute,
    private router: Router, private toastr: ToastrService) {
    this.loginRequestPayload = {
      username: '',
      password: ''
    };
   }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
    //a router from login.component sends us here. We add activated router to accept it here
    //we show a message to a user

    this.activatedRoute.queryParams
    .subscribe(params => {
      if(params.registered !== undefined && params.registered === 'true'){
        this.toastr.success('Signup Successful');
        this.registerSuccessMessage = 'Please Check your inbox for activation email' + 'activate your account before you login!';
      }
   });
  }

  login(){
      this.loginRequestPayload.username = this.loginForm.get('username').value;
      this.loginRequestPayload.password = this.loginForm.get('password').value;

      this.authService.login(this.loginRequestPayload).subscribe(
        //we subscribe to the response from authServise login method
        //from Spring
        //if it ontains errors we show this.
        data => {
         if(data){
           this.isError = false;
           this.router.navigateByUrl('/');
           this.toastr.success('Login Successful!');
         } else{
           this.isError = true;
         }
        }
      );
  }

}
