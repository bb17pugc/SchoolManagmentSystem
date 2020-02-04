import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, Form } from '@angular/forms';
import { Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthServicesService } from '../services/auth-services.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  Form: FormGroup;
  Reg_Error: string;
  constructor(private router: Router, private fb: FormBuilder, private appservice: AuthServicesService) {

  }

  onSubmit(): void
  {
    this.appservice.Registration(this.Form).subscribe(
      (res: any) =>
      {
        if (res.succeeded)
        {
          this.router.navigate(['/registration-status'], { queryParams: { status: true } });
        }
      },
      (err: HttpErrorResponse) =>
      {
        alert("hi");
        this.Reg_Error = err.error;
      }

    );
  }

  ngOnInit(): void {
    var unamePattern = "^([a-z A-Z]+)$";   
    this.Form = this.fb.group({
      FullName: ['', [Validators.required, Validators.pattern(unamePattern)]],
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(7)]],
      ConfirmPassword: ['', Validators.required]},{validator: MustMatch('Password', 'ConfirmPassword')}
    );


    function MustMatch(controlName: string, matchingControlName: string) {
      return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
          // return if another validator has already found an error on the matchingControl
          return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ mustMatch: true });
        } else {
          matchingControl.setErrors(null);
        }
      }
    }


  }
 
}
