import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-subaccounts',
  templateUrl: './subaccounts.component.html',
  styleUrls: ['./subaccounts.component.css']
})
export class SubaccountsComponent implements OnInit {

  Form : FormGroup;
  constructor( private fb : FormBuilder ) 
  { }

  ngOnInit() 
  {
       var NamePattern = "^([a-z A-Z]+)$";
       this.Form = this.fb.group({
       Name : ['' , Validators.required  , Validators.pattern(NamePattern) ] ,
       Password : ['' , Validators.required ]
      });
  }
  onSubmit()
  {
      alert(this.Form.controls['Name'].value);
      alert(this.Form.controls['Password'].value);
  }


}
