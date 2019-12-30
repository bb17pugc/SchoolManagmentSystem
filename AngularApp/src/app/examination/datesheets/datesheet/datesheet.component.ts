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
private  Destroyed : ReplaySubject<boolean> = new ReplaySubject(1);
@ViewChild('FormTemplate' , {static : true}) FormTemplate : TemplateRef<any>;
Classes$ : Observable<ClassModel[]>;
Classes  : ClassModel[];
StartDate : Date = new Date();
EndDate : Date = new Date();
Dates : DateVal[]=[];
DateError : string ;
CountClasses : any;
Today : Date;
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
DateSheet$ : Observable<Datesheet[]>;
DateSheet :Datesheet[] = [];
data :Datesheet[];
DateSheetName : string=null;
EditMode :boolean=false;
  constructor( private route : Router ,  private actroute : ActivatedRoute , private datesheetserv : DatesheetService , private fb : FormBuilder  , private modalservice : BsModalService , private teacherserv : TeacherService , private coursesserv : CourseserviceService  , private datePipe: DatePipe , private ClassesServ  : AddService , private sort : Sorting) 
  {

  }

  ngOnInit() 
  {
    
    this.Form = this.fb.group({
      ID : [0],
      Class : ['' , Validators.required],
      Date : ['' , Validators.required],
      Subject : ['' , Validators.required],
      Teacher : ['' , Validators.required],
      StartDate : ['' , Validators.required],
      EndDate : ['' , Validators.required],
      DateSheetName : ['' , Validators.required],
    });
    this.Today = new Date();
    this.GetClasses();
    this.GetTeachers();
    this.Dates = JSON.parse(this.GetDates()); 
    this.GetLocalStorage();       
   // get the datesheetname from url coming from datesheetlist comp.  
    this.actroute.queryParams.subscribe(
      a => {
        if(a.datesheetname !== undefined)
        {
           this.EditMode = true;
           this.Edit(a.datesheetname);
        }
      }
    );
  }
  //method to get values from local storage
  GetLocalStorage()
  {
      this.DateSheetName = (localStorage.getItem('DateSheetName') === undefined) ?null:localStorage.getItem('DateSheetName');
  }
onSubmit()
{
  this.datesheetserv.Add(this.Form).pipe(takeUntil(this.Destroyed)).subscribe(
    res =>
    {
        this.Form.reset();
        this.ResetAfterSubmit();
    } 
    ,
     (err : HttpErrorResponse) =>
      {
          console.log(err.error);
      }
      );
  this.modalRef.hide();
}
//method to obtain the lists of past datesheets
Edit(name : string) : void
{ 
    this.DateSheet$ = this.datesheetserv.Edit(name);
    this.DateSheet$.pipe(takeUntil(this.Destroyed)).subscribe((res : Datesheet[]) =>
     {
         this.data=res.filter(
        (thing, i, arr) => arr.findIndex(t => t.dateSheetName === thing.dateSheetName) === i
      );     
      this.StartDate = new Date(Date.parse(this.data[0].startDate.toString()));
      this.EndDate =  new Date(Date.parse(this.data[0].endDate.toString()));;
      this.DateSheetName = this.data[0].dateSheetName;      
      this.DateSheet = res;
      console.log(this.DateSheet);
      this.EditDateSheet();
      localStorage.setItem('DateSheetName' , this.DateSheetName);
     }
      ,
       (err : HttpErrorResponse) =>
    {

    });
}
//reset values after submittting the data
ResetAfterSubmit()
{
  this.PaperClass = null;
  this.CourseClass = null;
  this.PaperDate = null;  
}
SetSubDetails(item : any ,classVal : any )
{
   this.StartDate = new Date(Date.parse(localStorage.getItem('StartDate')));
   this.PaperClass = classVal;
   this.CourseClass = classVal.name;
   this.PaperDate = this.datePipe.transform(item, 'dd-MM-yyyy');
   this.modalRef = this.modalservice.show(this.FormTemplate);
   this.Form.controls['Class'].setValue(classVal.id);
   this.Form.controls['Date'].setValue(this.PaperDate);
   this.Form.controls['StartDate'].setValue(this.datePipe.transform(this.StartDate, 'yyyy-MM-dd'));
   this.Form.controls['EndDate'].setValue(this.datePipe.transform(this.EndDate, 'yyyy-MM-dd'));   
   this.Form.controls['DateSheetName'].setValue((this.DateSheetName === undefined)?localStorage.getItem('DateSheetName') : this.DateSheetName);      
   this.GetCourses(); 
  }
GetCourses()
{
  this.CourseClass = this.CourseClass;
  this.Courses$ = this.coursesserv.GetList();
  this.Courses$.pipe(takeUntil(this.Destroyed)).subscribe((List : any[] ) => 
    {
      this.courses = List.filter(a => a.classes.name === this.CourseClass); 
    });
}
GetTeachers()
{
    this.Teachers$ = this.teacherserv.List();
    this.Teachers$.pipe(takeUntil(this.Destroyed)).subscribe((list : any[]) => {
         this.teachers = list;
    }); 
}
//method to edit datesheet
EditDateSheet()
{
  localStorage.setItem('StartDate' , this.StartDate.toString());    
  localStorage.setItem('DateSheetName' , this.DateSheetName); 
  if(this.EndDate >= this.StartDate)
  {
   this.DateError = ""; 
   var i= 0;
   while(this.StartDate < this.EndDate)
   {
       this.Dates.push({
       date : this.StartDate.setDate(this.StartDate.getDate()+i),
        });
      i=1;
   }
  } 
  else
  {
   this.DateError = "End date must be greater than start date";    
 }
}
SetDates()
{ 
  if(this.DateSheetName === null)
  {
    alert("write date sheet name");
  }   
  else
  {
    this.DateSheetName = this.DateSheetName + new Date().toLocaleTimeString().split(":").join("");;
    this.StartDate = new Date(Date.parse(this.datePipe.transform(this.StartDate, 'yyyy-MM-dd')));        
    this.EndDate = new Date(Date.parse(this.datePipe.transform(this.EndDate, 'yyyy-MM-dd')));
    if(this.EndDate >= this.StartDate  && this.StartDate >= this.Today )
   {
    this.DateError = ""; 
    var i= 0;
    while(this.StartDate < this.EndDate)
    {
        this.Dates.push({
        date : this.StartDate.setDate(this.StartDate.getDate()+i),
         });
       i=1;
    }
   } 
   else
   {
    this.DateSheetName = null;
    this.DateError = "End date must be greater than start date or start date not less than today date";    
   }
  }  
  
}
ClearDateSheet()
{
  sessionStorage.removeItem('DateSheet');  
  sessionStorage.removeItem('DateSheetName');
  this.DateSheetName = null;
  this.Dates.length = 0;
  this.StartDate = null;
  this.EndDate = null;
  this.DateError = null; 
  this.Form.reset();
  this.EditMode = false;
  this.route.navigate(['examination/datesheet']);
  
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
          this.CountClasses = this.Classes.length;
          this.Classes.sort(this.sort.SortData("name" , "asc" , "number"));   
          document.getElementById('headerrow').setAttribute('colspan' , (this.Classes.length + 1).toString()); 
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
