import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { flatMap, first, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthServicesService {
  readonly BaseUrl = 'https://localhost:44361/api';

  constructor(private http: HttpClient) { }

  Registration(Form)
  {
    var body = {
      Name:Form.value.FullName,
      Email:Form.value.Email,
      Password:Form.value.Password
    };
    const reqHeaders = new HttpHeaders().set('Content-Type' , 'application/json').set('Accept' , 'application/json');
    return this.http.post(this.BaseUrl + '/auth/registration', body, { headers: reqHeaders });

  }

  Login(Form: FormGroup)
  {
    var body = {
      UserName: Form.value.UserName,
      Password: Form.value.Password
    }
    const reqHeader = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return this.http.post(this.BaseUrl + '/auth/Login', body,{ headers: reqHeader });
  }

}
