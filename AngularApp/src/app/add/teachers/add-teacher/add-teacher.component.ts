import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { strictEqual } from 'assert';
import { DatePipe } from '@angular/common';
import { TeacherService } from 'src/app/services/teacher.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Teahcer } from 'src/app/models/teahcer';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-teacher',
  templateUrl: './add-teacher.component.html',
  styleUrls: ['./add-teacher.component.css']
})
export class AddTeacherComponent implements OnInit {
  @ViewChild('NameInput' , {static : true}) NameInput: ElementRef; 
  Form : FormGroup;
  myDate : string;
  teacher : Teahcer ;
  EditMode : string;
  Title : string = "Add New Teacher";
  constructor(private router : Router , private route : ActivatedRoute , private fb : FormBuilder , private teacherserv : TeacherService) 
  {
  }

  ngOnInit() 
  {   
      var textPattern = "^([a-z A-Z]+)$";   
      var CnicPattern = "^[0-9]{5}-[0-9]{7}-[0-9]$";   
      this.Form = this.fb.group({
            ID : [0],
            Name : ['' , [Validators.required , Validators.pattern(textPattern)]],
            Cnic : ['' , [Validators.required, Validators.pattern(CnicPattern)]],
            Education : ['' , [Validators.required]],
            Institute : ['' , [Validators.required, Validators.pattern(textPattern)]],
            CompletionDate : ['' , [Validators.required]] 
          } , {validator : CompareDate('CompletionDate')});

          function CompareDate(controlName: string) {
            return (formGroup: FormGroup) => {
              const control = formGroup.controls[controlName];
              // set error on matchingControl if validation fails
              let dateToBeCheckOut = new Date(control.value);
              let today = new Date(Date.parse(Date()));
              if(dateToBeCheckOut >= today)
              {
                control.setErrors({ invalidDate: true });
              }
            
            }
          }
          this.NameInput.nativeElement.focus();
          this.route.queryParams.subscribe(data => 
            {
              if(data.id != null)
              {
                 this.GetTeacher(data.id);
              }
          });

  }
  GetTeacher(id)
  {
      this.teacherserv.Edit(id).subscribe((data : any) =>
      {
         this.Form.controls['ID'].setValue(data.id);
         this.Form.controls['Name'].setValue(data.name);
         this.Form.controls['Cnic'].setValue(data.cnic);
         this.Form.controls['Education'].setValue(data.education);
         this.Form.controls['Institute'].setValue(data.institute);
         this.Form.controls['Completiondate'].setValue(data.completionDate);
          this.EditMode = "true"
      }
      ,
      (err : HttpErrorResponse) =>
      {
        alert("server is offline");
      });       
  }
  onSubmit()
  {
    if(this.Form.valid)
    {
      this.teacherserv.Add(this.Form).subscribe(res => 
        {
           this.Form.reset();
           this.NameInput.nativeElement.focus();
           if(this.EditMode == "true")
           {
             this.router.navigate(['add/list-teachers']);
             this.EditMode = "false";
           }
        } 
        ,
         (err : HttpErrorResponse) =>
          {
              alert(err.error);
          });
        }
  
    } 
}
