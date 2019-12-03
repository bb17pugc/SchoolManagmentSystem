import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Teahcer } from 'src/app/models/teahcer';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherService } from 'src/app/services/teacher.service';
import { HttpErrorResponse, HttpHeaderResponse } from '@angular/common/http';
import { CourseserviceService } from 'src/app/services/courseservice.service';
import { CourseModel } from 'src/app/models/course-model';
import { Observable } from 'rxjs';
import { ClassModel } from 'src/app/models/class-model';
import { AddService } from 'src/app/services/add.service';
import { splitAtColon, splitAtPeriod } from '@angular/compiler/src/util';
import { wordBreak } from 'html2canvas/dist/types/css/property-descriptors/word-break';
import { StudentService } from 'src/app/services/student.service';
import { Alert } from 'selenium-webdriver';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  @ViewChild('NameInput' , {static : true}) NameInput: ElementRef; 
  Form : FormGroup;
  myDate : string;
  teacher : Teahcer ;
  EditMode : string;
  Title : string = "New Student";
  Classes$ : Observable<ClassModel[]>;
  Classes : ClassModel[] = [];
  Section : any;
  constructor(private classserv : AddService , private router : Router , private route : ActivatedRoute , private fb : FormBuilder , private studentserv : StudentService) 
  {
  }

  ngOnInit() 
  {   
      var textPattern = "^([a-z A-Z]+)$";   
      var CnicPattern = "^[0-9]{5}-[0-9]{7}-[0-9]$";   
      this.Form = this.fb.group({
            ID : [0],
            Name : ['' , [Validators.required , Validators.pattern(textPattern)]],
            Father : ['' , [Validators.required , Validators.pattern(textPattern)]],
            Class : ['' , [Validators.required]],
            DateOfBirth : ['' , [Validators.required]] 
          } , {validator : CompareDate('DateOfBirth')});

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

          });
     this.ClassesList();
  }

  ClassesList()
  {
      this.classserv.Clear();
       this.Classes$ = this.classserv.GetClasses();
       this.Classes$.subscribe((res : ClassModel[]) => {
              this.Classes = res;
       });     
  }
  onSubmit()
  {

    if(this.Form.valid)
    {
      this.studentserv.Add(this.Form).subscribe(res => 
      {
        this.Form.reset();
      }
       ,
      (err:HttpErrorResponse) =>
    {
        
    }
     );
    }
  
   }
}
