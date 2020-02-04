import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TeacherService } from 'src/app/services/teacher.service';
import { CourseserviceService } from 'src/app/services/courseservice.service';
import { DatePipe } from '@angular/common';
import { AddService } from 'src/app/services/add.service';
import { Sorting } from 'src/app/sorting/sorting';
import { Observable, ReplaySubject } from 'rxjs';
import { ClassModel } from 'src/app/models/class-model';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { CourseModel } from 'src/app/models/course-model';
import { StudentService } from 'src/app/services/student.service';
import { Student } from 'src/app/models/student';
import { Currentstudent } from 'src/app/models/currentstudent';
import { Studentsarray } from 'src/app/models/studentsarray';
import { parse } from 'querystring';
import { Classlistrecored } from 'src/app/models/classlistrecored';
import { Router } from '@angular/router';

@Component({
  selector: 'app-marklists',
  templateUrl: './marklists.component.html',
  styleUrls: ['./marklists.component.css']
})
export class MarklistsComponent implements OnInit {
  @ViewChild('MarksInput' , {static : true}) MarksInput: ElementRef;
  @ViewChild('dataContainer' , {static : true} ) dataContainer: ElementRef;

  private Destroyed : ReplaySubject<boolean> = new ReplaySubject(1);
  Classes$ : Observable<ClassModel[]>;
  Classes : ClassModel[] = [];
  Form :  FormGroup;   
  CourseClass : any;
  ClassSubject : any;
  Courses$ : Observable<CourseModel[]>;
  courses : CourseModel[] = [];                                                                                           
  ClassListRecored : Classlistrecored = new Classlistrecored();
  constructor(private fb : FormBuilder , private route : Router  ,private coursesserv : CourseserviceService  , private datePipe: DatePipe , private ClassesServ  : AddService , private sort : Sorting) 
  {
  }

  ngOnInit() 
  {
    this.Form = this.fb.group({
      Class : ['' , [Validators.required]] , 
      Subject : ['', [Validators.required]] ,
      Total  : ['', [Validators.required , Validators.min(0)]] ,

    });    
    this.GetClasses();
    this.GetCourses();
  }

  GetCourses()
  {
    this.Courses$ = this.coursesserv.GetList();
    this.Courses$.pipe(takeUntil(this.Destroyed)).subscribe((List : CourseModel[] ) => 
      {
        this.courses = List.filter(a => a.class === this.CourseClass);
      });
  }
  onSubmit()
  {
    if(this.Form.valid)
    {
        this.ClassListRecored.totalmarks = this.Form.controls['Total'].value;
        this.route.navigate(['/examination/createstudentlist'] , {queryParams : {data : JSON.stringify(this.ClassListRecored)}});
       

    }  
  }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
  
  changeclass(e) 
  {
     this.ClassListRecored.class = this.Classes.find(a => a.id === +e.target.value);     
     this.CourseClass = this.ClassListRecored.class.name;
     this.GetCourses();
  }
  changesubject(e) 
  {
     this.ClassListRecored.subject = this.courses.find(a => a.id === +e.target.value);     
  }
  GetClasses()
  {
      this.Classes$ = this.ClassesServ.GetClasses();
      this.Classes$.pipe(takeUntil(this.Destroyed)).subscribe((res : any)=>
      {
            this.Classes = res;            
            this.Classes.sort(this.sort.SortData("name" , "asc" , "number"));    
          } ,
       (err : HttpErrorResponse) =>
        {
  
        });
  }
}
