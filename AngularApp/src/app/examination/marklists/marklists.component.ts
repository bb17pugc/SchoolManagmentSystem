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

@Component({
  selector: 'app-marklists',
  templateUrl: './marklists.component.html',
  styleUrls: ['./marklists.component.css']
})
export class MarklistsComponent implements OnInit {
  @ViewChild('MarksInput' , {static : true}) MarksInput: ElementRef;
  @ViewChild('NameInput' , {static : true}) NameInput: ElementRef; 

  private Destroyed : ReplaySubject<boolean> = new ReplaySubject(1);
  Students$ : Observable<Student[]>;
  Students : any[]; 
  Classes$ : Observable<ClassModel[]>;
  Classes : ClassModel[] = [];
  Form : FormGroup;   
  CourseClass : any;
  Courses$ : Observable<CourseModel[]>;
  courses : CourseModel[] = [];
  ClassData : ClassModel; 
  ShowStudents : any;
  ArrayInd : number = 0;                                                                                      

  constructor(private studentserv : StudentService , private fb : FormBuilder  , private modalservice : BsModalService , private teacherserv : TeacherService , private coursesserv : CourseserviceService  , private datePipe: DatePipe , private ClassesServ  : AddService , private sort : Sorting) 
  {
  }

  ngOnInit() 
  {
    this.Form = this.fb.group({
      Class : ['' , [Validators.required]] , 
      Subject : ['' , [Validators.required]],
      Marks  : [''],
      Student : ['']
    });
    this.GetClasses();
    this.GetCourses();
  }
  GetCourses()
  {
    this.CourseClass = this.CourseClass;
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
      this.Students$ = this.studentserv.List();
      this.Students$.pipe(takeUntil(this.Destroyed)).subscribe(
        (res : any)=>
        {
           this.ShowStudents=true;
           this.Students = res.filter((a : any) => a.class.id === this.ClassData.id);
           this.Form.controls['Student'].setValue(this.Students[0].name); 
        }
       , (err : HttpErrorResponse)=>
        {

        });
  }
  }
  AddMarks()
  {
    this.MarksInput.nativeElement.focus();
    alert();
  }
  DeleteList()
  {
     this.ShowStudents = false;
  }
  changeclass(e) 
  {
     this.ClassData = this.Classes.find(a => a.id === +e.target.value);     
     this.CourseClass = this.ClassData.name;
     //console.log(this.CourseClass);     
     this.GetCourses();
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
