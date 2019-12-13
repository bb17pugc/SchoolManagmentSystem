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
  @ViewChild('dataContainer' , {static : true} ) dataContainer: ElementRef;

  private Destroyed : ReplaySubject<boolean> = new ReplaySubject(1);
  Students$ : Observable<Student[]>;
  Students : any[] = []; 
  Classes$ : Observable<ClassModel[]>;
  Classes : ClassModel[] = [];
  Form : FormGroup;   
  CourseClass : any;
  ClassSubject : any;
  Courses$ : Observable<CourseModel[]>;
  courses : CourseModel[] = [];
  ClassData : ClassModel; 
  ShowStudents : any;
  ArrayInd : number = 0;                                                                                      
  StudentName: any ="" ;
  StudentData : any;
  data : any;
  constructor(private studentserv : StudentService , private fb : FormBuilder  , private modalservice : BsModalService , private teacherserv : TeacherService , private coursesserv : CourseserviceService  , private datePipe: DatePipe , private ClassesServ  : AddService , private sort : Sorting) 
  {
  }

  ngOnInit() 
  {
    this.ArrayInd = +localStorage.getItem('ArrayInd');
    this.data = localStorage.getItem('StudentData');
    this.StudentData = JSON.parse(this.data);
    this.CourseClass = localStorage.getItem('CourseClass');
    this.ClassSubject = localStorage.getItem('ClassSubject');
    this.ShowStudents = localStorage.getItem('ShowStudents');
    this.Form = this.fb.group({
      Class : ['' , [Validators.required]] , 
      Subject : ['' , [Validators.required]],
      Marks  : [''],
      Student : ['']
    });
    this.GetClasses();
    this.GetCourses();
    this.SetCurrentStudent();
    this.GetStudents();
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
  GetStudents()
  {
     this.onSubmit();
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
           localStorage.setItem('ShowStudents' , this.ShowStudents);
           this.Students = res.filter((a : any) => a.class.id === this.ClassData.id);
           console.log(this.Students);
           this.StudentData = this.Students[this.ArrayInd];
           console.log(this.Students);
           this.SetCurrentStudent();
        }
       , (err : HttpErrorResponse)=>
        {

        });
  }
  }
  SetCurrentStudent()
  {
    localStorage.setItem('StudentData' , JSON.stringify(this.StudentData)) ;
    this.Form.controls['Student'].setValue(this.StudentData.id);                        
  }
  AddMarks()
  {
    if(this.ArrayInd < this.Students.length)
    {
      this.StudentData = this.Students[++this.ArrayInd];
      localStorage.setItem('ArrayInd' , JSON.stringify(this.ArrayInd));      
      localStorage.setItem('StudentData' , JSON.stringify(this.StudentData)) ;
      this.Form.controls['Student'].setValue(this.StudentData.id);
      this.Form.reset();    
    }
  }
  DeleteList()
  {
     this.ShowStudents = "";
     localStorage.setItem('ShowStudents' , this.ShowStudents);
     this.CourseClass = "-";
     localStorage.setItem('CourseClass' , this.CourseClass);
     this.ClassSubject = "-";
     localStorage.setItem('ClassSubject' , this.ClassSubject);
     //localStorage.removeItem('StudentData'); 
  }
  changeclass(e) 
  {
     this.ClassData = this.Classes.find(a => a.id === +e.target.value);     
     this.CourseClass = this.ClassData.name;
     localStorage.setItem('CourseClass' , this.CourseClass);    
     this.GetCourses();
  }
  changesubject(e) 
  {
     this.ClassSubject = e.target.value;
     localStorage.setItem('ClassSubject' , this.ClassSubject);         
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
