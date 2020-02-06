import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { ClassModel } from 'src/app/models/class-model';
import { DateVal } from 'src/app/models/date-val';
import { Datesheet } from 'src/app/models/datesheet';
import { Router, ActivatedRoute } from '@angular/router';
import { DatesheetService } from 'src/app/services/datesheet.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TeacherService } from 'src/app/services/teacher.service';
import { CourseserviceService } from 'src/app/services/courseservice.service';
import { DatePipe } from '@angular/common';
import { AddService } from 'src/app/services/add.service';
import { Sorting } from 'src/app/sorting/sorting';
import { takeUntil } from 'rxjs/operators';
import { Teahcer } from 'src/app/models/teahcer';
import { HttpErrorResponse } from '@angular/common/http';
import { CourseModel } from 'src/app/models/course-model';
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  @ViewChild('FormTemplate' , {static : true}) FormTemplate : TemplateRef<any>;
  private  Destroyed : ReplaySubject<boolean> = new ReplaySubject(1);
  Classes$ : Observable<ClassModel[]>;
  Classes  : ClassModel[];
  Teachers$ : Observable<Teahcer[]>;
 teachers : Teahcer[] = [];
  Dates : DateVal[]=[];
  Today : Date = new Date();
  PaperDate :any;
  Courses$ : Observable<CourseModel[]>;
 courses : CourseModel[] = [];
  PaperClass : any;
  Form : FormGroup;
  DateSheetName : string;
  StartDate : Date = new Date();
  EndDate : Date = new Date();
  CourseClass: any;
  DateError: string;
  CountClasses: number;
  modalRef : BsModalRef;
  plainText:string = "i am boy";  
  encryptText: string;  
  encPassword: string = "ars1234.";
  constructor(private route : Router ,  private actroute : ActivatedRoute , private datesheetserv : DatesheetService , private fb : FormBuilder  , private modalservice : BsModalService , private teacherserv : TeacherService , private coursesserv : CourseserviceService  , private datePipe: DatePipe , private ClassesServ  : AddService , private sort : Sorting) { }

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
      DateSheetHeader : ['' , Validators.required],
    });
    this.Today =  new Date(Date.parse( this.datePipe.transform(this.Today , "yyyy-MM-dd")));
    this.GetClasses();
    this.GetTeachers();
    this.GetCourses();   
   // get the datesheetname from url coming from datesheetlist comp.  
    this.actroute.queryParams.subscribe(
      data => {
          let id = CryptoJS.AES.decrypt(data.id, this.encPassword.trim()).toString(CryptoJS.enc.Utf8);
        if(data)
        {
             this.GetDateSheet(id);
        }
        else
        {
          alert("invalid data");
          this.route.navigate(['examination/datesheet']);
        }
      }
    );
  }
  //method to clear the datesheet and get back to create new
  ClearDateSheet()
{
  this.route.navigate(['examination/datesheet']);  
}
GetDateSheet(id)
{
    this.datesheetserv.GetDateSheet(id).pipe(takeUntil(this.Destroyed)).subscribe(
      res =>
      {
        this.StartDate =  new Date(Date.parse(res.start));
        this.EndDate = new Date(Date.parse(res.end));
        this.Form.controls['DateSheetHeader'].setValue(res.id);
        this.SetDates();
      } 
      ,
       err=>
       {});  

}
//reset variables after submitting the data
ResetAfterSubmit()
{
  this.PaperClass = null;
  this.CourseClass = null;
  this.PaperDate = null;  
}
//method to set the start and end dates of papers
SetDates()
{
  localStorage.setItem('StartDate' , this.StartDate.toString());    
  if(this.EndDate >= this.StartDate)
  {
   this.DateError = ""; 
   var i= 1;
   while(this.StartDate <= this.EndDate)
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
//method to get the classes from the database
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
//method to get the teachers from the database
GetTeachers()
{
    this.Teachers$ = this.teacherserv.List();
    this.Teachers$.pipe(takeUntil(this.Destroyed)).subscribe((list : any[]) => {
         this.teachers = list;
    }); 
}
//set the peper detail to add data to the database
SetSubDetails(item : any ,classVal : any )
{
   this.PaperClass = classVal;
   this.CourseClass = classVal.name;
   this.PaperDate = this.datePipe.transform(item, 'dd-MM-yyyy');
   this.modalRef = this.modalservice.show(this.FormTemplate);
   this.Form.controls['Class'].setValue(classVal.id);
   this.Form.controls['Date'].setValue(this.PaperDate);
   this.Form.controls['StartDate'].setValue(this.datePipe.transform(this.StartDate, 'yyyy-MM-dd'));
   this.Form.controls['EndDate'].setValue(this.datePipe.transform(this.EndDate, 'yyyy-MM-dd'));        
   this.GetCourses(); 
   console.log(this.Form);
  }
  //method to get the courses from the database
  GetCourses()
  {
    this.Courses$ = this.coursesserv.GetList();
    this.Courses$.pipe(takeUntil(this.Destroyed)).subscribe((List : any[] ) => 
      {
        this.courses = List.filter(a => a.classes.name === this.CourseClass); 
      });
  }
  //method to add the current paper data to the database
  onSubmit()
{
  this.datesheetserv.Add(this.Form).pipe(takeUntil(this.Destroyed)).subscribe(
    res =>
    {
        this.Form.untouched;
        this.modalRef.hide();
    } 
    ,
     (err : HttpErrorResponse) =>
      {
          console.log(err.error);
      }
      );
}
//method to unsubscribe from the data
ngOnDestroyed()
{
   this.Destroyed.next(true);
   this.Destroyed.complete();
}
see()
{
    alert();
}
}
