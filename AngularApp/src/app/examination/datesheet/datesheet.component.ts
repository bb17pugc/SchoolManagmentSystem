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
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Datesheet } from 'src/app/models/datesheet';

@Component({
  selector: 'app-datesheet',
  templateUrl: './datesheet.component.html',
  styleUrls: ['./datesheet.component.css']
})
export class DatesheetComponent implements OnInit {
private  Destroyed : ReplaySubject<boolean> = new ReplaySubject(1);
@ViewChild('FormTemplate' , {static : true}) FormTemplate : TemplateRef<any>;
Classes$ : Observable<ClassModel[]>;
Classes  : ClassModel[];
CurrentDate :Date = new Date();
Today : any;
CurrentYear : any;
StartDate : Date = new Date();
EndDate : Date = new Date();
Dates : DateVal[]=[];
DateError : any ;
CountClasses : any;
PaperDate :any;
PaperClass : any;
Title : string = "Time Table";
Teachers$ : Observable<Teahcer[]>;
teachers : Teahcer[] = [];
modalRef : BsModalRef;
Courses$ : Observable<CourseModel[]>;
courses : CourseModel[] = [];
CourseClass : any;
Form : FormGroup;
DateSheetData : Datesheet[];
  constructor(private fb : FormBuilder  , private modalservice : BsModalService , private teacherserv : TeacherService , private coursesserv : CourseserviceService  , private datePipe: DatePipe , private ClassesServ  : AddService , private sort : Sorting) 
  {

  }

  ngOnInit() 
  {
    
    this.Form = this.fb.group({
      Class : ['' , [Validators.required]],
      Date : ['' , [Validators.required]],
      Subject : ['' , [Validators.required]],
      Teacher : ['' , [Validators.required]],
   });
    this.Today = this.CurrentDate.toDateString();
    this.GetClasses();
    this.GetCourses();
    this.GetTeachers();
    this.CurrentYear = this.CurrentDate.getFullYear();
    this.Dates = JSON.parse(this.GetDates());    
  }
  
SetStartDates(val)
{
  if(val !=  null)
  {
    this.StartDate = new Date(Date.parse(val));
  }
}
onSubmit()
{
  this.DateSheetData.push({
     Class : this.Form.get('Class').value ,
     date : this.Form.get('Date').value , 
     Subject : this.Form.get('Subject').value ,
     Teacher : this.Form.get('Teacher').value ,     
  });
  this.Form.reset();
  console.log(this.DateSheetData);
  this.modalRef.hide();
}
SetSubDetails(item : any ,classVal : any)
{
   this.Form.reset();
   this.PaperClass = classVal;
   this.CourseClass = classVal.name;
   this.PaperDate = this.datePipe.transform(item, 'dd-MM-yyyy');
   this.modalRef = this.modalservice.show(this.FormTemplate);
   this.Form.controls['Class'].setValue(classVal.id);
   this.Form.controls['Date'].setValue(this.PaperDate);   
  }
GetCourses()
{
  this.CourseClass = this.CourseClass;
  this.Courses$ = this.coursesserv.GetList();
  this.Courses$.pipe(takeUntil(this.Destroyed)).subscribe((List : any[] ) => 
    {
      this.courses = List.filter(a => a.classes.name === this.CourseClass)
    });
}
GetTeachers()
{
    this.Teachers$ = this.teacherserv.List();
    this.Teachers$.pipe(takeUntil(this.Destroyed)).subscribe((list : any[]) => {
         this.teachers = list;
    }); 
}

SetEndDates(val)
{
  this.ClearDateSheet();
  if( val != null)
  {

    if(new Date(Date.parse(val)) <= this.StartDate)
    {      
      this.DateError = "End date must be greater than start date";
      console.log(this.DateError);
    }
    else
    {
      this.EndDate = new Date(Date.parse(val));
      this.DateError = "";
    }
  }
}
SetDates()
{      
  var i= 0;
  while(this.StartDate < this.EndDate)
  {
      this.Dates.push({
      date : this.StartDate.setDate(this.StartDate.getDate()+i),
       });
     i=1;
  }
  this.StoreData(); 
}
ClearDateSheet()
{
  sessionStorage.removeItem('DateSheet');
  this.Dates.length = 0;
}
StoreData()
{
  sessionStorage.setItem('DateSheet' ,  JSON.stringify(this.Dates));
}
GetDates()
{
  if(!sessionStorage.getItem('DateSheet'))
  {
    sessionStorage.setItem('DateSheet' ,  JSON.stringify(this.Dates));
    return sessionStorage.getItem('DateSheet');
  }
  else
  {
    return sessionStorage.getItem('DateSheet');
  }
}
  GetClasses()
{
    this.Classes$ = this.ClassesServ.GetClasses();
    this.Classes$.pipe(takeUntil(this.Destroyed)).subscribe((res : any)=>
    {
          this.Classes = res;
          console.log(this.Classes);
          this.CountClasses = this.Classes.length;
          this.Classes.sort(this.sort.SortData("name" , "asc" , "number"));    
        } ,
     (err : HttpErrorResponse) =>
      {

      });
}
 ngOnDestroyed()
{
   this.Destroyed.next(true);
   this.Destroyed.complete();
}
}
