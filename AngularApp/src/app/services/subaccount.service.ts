import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SubaccountService {

  readonly BaseUrl = 'https://localhost:44361/api';
  readonly reqheaders = new HttpHeaders().set("Content-type" , "application/json").set("accept" , "application/json");
  constructor( private http : HttpClient ) 
  {

   }

   Add(Form)
   {
      var body = 
      {
          Name  : Form.value.Name , 
          Password  : Form.value.Password , 
          UserName : Form.value.UserName
      }
      return this.http.post(this.BaseUrl + '/SubAccounts/Add'  , body , {headers : this.reqheaders});
   }
}
