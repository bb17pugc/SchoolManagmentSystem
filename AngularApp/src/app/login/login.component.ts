import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthServicesService } from '../services/auth-services.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  Form: FormGroup;
  LoginError: string
  fullname : string;
  username : string; 
  constructor(private lc: Location, private fb: FormBuilder, private service: AuthServicesService, private router: Router) {

  } 
  ngOnInit(): void {
    this.Form = this.fb.group({
      UserName: ['', [Validators.required, Validators.email]],
      Password: ['', Validators.required]
    });

    if(localStorage.getItem('jwttoken')!=null)
    {
      this.router.navigateByUrl('/home');
    }
  }

  onSubmit(): void {
    this.service.Login(this.Form).subscribe(
      (res: any) => {
        localStorage.setItem('jwttoken', res.jwttoken);
        localStorage.setItem('fullname', res.fullname);
        localStorage.setItem('username', res.username);
        location.reload();
        this.router.navigateByUrl('/home');
      },
      (error: HttpErrorResponse) => {
        // let validationErrorDictionary = JSON.parse(error.text());
        // for (var fieldName in validationErrorDictionary) {
        //     if (validationErrorDictionary.hasOwnProperty(fieldName)) {
        //         this.errors.push(validationErrorDictionary[fieldName]);
        //     }
        // }
        // this.alertService.errorMsg(this.errors);
        this.LoginError = error.error;
      }

    );
}

}
