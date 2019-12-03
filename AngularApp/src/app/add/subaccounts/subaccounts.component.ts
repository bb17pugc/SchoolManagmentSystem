import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SubaccountService } from 'src/app/services/subaccount.service';
import { HttpErrorResponse } from '@angular/common/http';
import { format } from 'url';

@Component({
  selector: 'app-subaccounts',
  templateUrl: './subaccounts.component.html',
  styleUrls: ['./subaccounts.component.css']
})
export class SubaccountsComponent implements OnInit {

  Form : FormGroup;
  constructor( private fb : FormBuilder , private subaccserv : SubaccountService ) 
  { }

  ngOnInit() 
  {
       var NamePattern = "^([a-z A-Z]+)$";
       this.Form = this.fb.group({
       Name : ['' , [Validators.required  , Validators.pattern(NamePattern)]] ,
       Password : ['' , Validators.required ] , 
       UserName : [''  ,  ]
       
      });
  }
  onSubmit()
  {
      if(this.Form.valid)
      {
          this.Form.controls['UserName'].setValue(localStorage.getItem('username'));
          this.subaccserv.Add(this.Form).subscribe((res :any) => 
          {
              alert( res.userName);
          }
          ,
          (err : HttpErrorResponse) => 
          {
              alert(err.error);  
          });
      }
  }


}
