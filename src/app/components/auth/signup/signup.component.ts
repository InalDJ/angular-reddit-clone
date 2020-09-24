import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupRequestPayload } from 'src/app/components/auth/signup/signup-request.payload';
import {AuthService} from 'src/app/services/auth/shared/auth.service'
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
//step1.we create a form Object
  signupForm: FormGroup;

  //step 7 implement it 
  signupRequestPayload: SignupRequestPayload;

  //step 9 add a dependency
  constructor(private authService: AuthService,
    private router: Router,
    private toastr: ToastrService) { 

    this.signupRequestPayload = {
      username: '',
      email: '',
      password: ''

    }
  }

  //step 8. we initialize this form and add fields and validation to it
  ngOnInit(): void {
    this.signupForm = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    })
  }

  //step 9 we assign formvalues to our interface
  signup(){
    this.signupRequestPayload.email = this.signupForm.get('email').value;
    this.signupRequestPayload.username = this.signupForm.get('email').value;
    this.signupRequestPayload.password = this.signupForm.get('email').value;

    this.authService.signup(this.signupRequestPayload).subscribe(
      //this is if successful we go to the login page
      ()=> {
        this.router.navigate(['/login'], {queryParams: {registered: 'true'}})
      }, //this if login is not successful
      () => {
        this.toastr.error('Registration failed! Please try again!');
      }
    )
  }

}
