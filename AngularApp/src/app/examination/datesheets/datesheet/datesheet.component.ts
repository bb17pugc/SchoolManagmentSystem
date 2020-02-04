import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { AddService } from 'src/app/services/add.service';
import { Observable, ReplaySubject } from 'rxjs';
import { ClassModel } from 'src/app/models/class-model';
import { HttpErrorResponse } from '@angular/common/http';
import { Sorting } from 'src/app/sorting/sorting';
import { Element } from '@angular/compiler';
import { parse } from 'querystring';
import { DateVal } from 'src/app/models/date-val';
import { DatePipe } from '@angular/common';
import { Teahcer } from 'src/app/models/teahcer';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CourseModel } from 'src/app/models/course-model';
import { TeacherService } from 'src/app/services/teacher.service';
import { CourseserviceService } from 'src/app/services/courseservice.service';
import { takeUntil, take } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Datesheet } from 'src/app/models/datesheet';
import { DatesheetService } from 'src/app/services/datesheet.service';
import { ActivatedRoute, Router } from '@angular/router';
import { join } from 'path';

@Component({
  selector: 'app-datesheet',
  templateUrl: './datesheet.component.html',
  styleUrls: ['./datesheet.component.css']
})
export class DatesheetComponent implements OnInit {
private Destroyed  : ReplaySubject<boolean> = new ReplaySubject(1);
Form : FormGroup;
Today :Date;
  constructor(private datepipe : DatePipe ,  private route : Router ,  private actroute : ActivatedRoute , private datesheetserv : DatesheetService , private fb : FormBuilder  , private modalservice : BsModalService , private teacherserv : TeacherService , private coursesserv : CourseserviceService  , private datePipe: DatePipe , private ClassesServ  : AddService , private sort : Sorting) 
  {
     
  }

  ngOnInit() 
  {     
     this.Today = new Date(Date.parse( this.datePipe.transform(new Date() , "yyyy-MM-dd")));    
     this.Form=this.fb.group({
          DateSheetName : ['' , [Validators.required]],
          StartDate : ['' , [Validators.required]],
          EndDate : ['' , Validators.required]
       } , {validator : CompareDates('StartDate' , 'EndDate' , this.Today)} );
       function CompareDates(controlName: string, matchingControlName: string , Today : any) {
        return (formGroup: FormGroup) => {
          const StartDate = formGroup.controls[controlName];
          const EndDate = formGroup.controls[matchingControlName];
  
          if (StartDate.errors && !EndDate.errors.DateError) {
            // return if another validator has already found an error on the matchingControl
            return;
          }
  
          // set error on matchingControl if validation fails
          if (StartDate.value >= EndDate.value)
          {
            EndDate.setErrors({ DateError: true });
          }
           else if( new Date(Date.parse(StartDate.value)) < Today)
           {              
            EndDate.setErrors({ DateError: true });
           } 
          else
          {
            EndDate.setErrors(null);
          }
        }
      }
  }
  Send()
  {
     let datasheetname = this.Form.controls['DateSheetName'].value + new Date().toUTCString().split(":").join(" ");
     this.Form.controls['DateSheetName'].setValue(datasheetname);
     this.route.navigate(['examination/edit-datesheet'] ,  { queryParams :{Form : JSON.stringify(this.Form)}});
  }
  
}

