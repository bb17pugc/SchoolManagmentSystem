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
  Students : Studentsarray[] = []; 
  Classes$ : Observable<ClassModel[]>;
  Classes : ClassModel[] = [];
  Form :  FormGroup;   
  CourseClass : any;
  ClassSubject : any;
  Courses$ : Observable<CourseModel[]>;
  courses : CourseModel[] = [];
  ClassData : ClassModel = new ClassModel(); 
  ShowStudents : string = "";
  ArrayInd : number = 0;                                                                                      
  StudentName: any ;
  StudentData : any;
  CurrentStudent : Currentstudent = new Currentstudent();
  data : any;
  StudentCount : number;
  constructor(private studentserv : StudentService , private fb : FormBuilder  , private modalservice : BsModalService , private teacherserv : TeacherService , private coursesserv : CourseserviceService  , private datePipe: DatePipe , private ClassesServ  : AddService , private sort : Sorting) 
  {
  }

  ngOnInit() 
  {
    this.Form = this.fb.group({
      Class : ['' , [Validators.required]] , 
      Subject : ['', [Validators.required]],
      Marks  : [''],
      Student : ['']
    });
    this.GetValuesFromLocalStorage();
    this.CheckLocalStorage();
    this.GetStudents();
    this.GetClasses();
    this.GetCourses();
   // this.SetCurrentStudent();
  }

  GetValuesFromLocalStorage()
  {
    this.ArrayInd = JSON.parse(localStorage.getItem('ArrayInd')) === null ? 0 : JSON.parse(localStorage.getItem('ArrayInd'));
    this.StudentCount = JSON.parse(localStorage.getItem('StudentCount')) === null ? 0 : JSON.parse(localStorage.getItem('StudentCount'));
    this.data = JSON.parse(localStorage.getItem('CurrentStudent'));
    this.ClassData = JSON.parse(localStorage.getItem('ClassData'));
    this.ClassSubject = localStorage.getItem('ClassSubject');
    this.Form.controls['Class'].setValue(this.ClassData.id);
    this.Form.controls['Subject'].setValue(this.ClassSubject);
    this.Form.controls['Student'].setValue(this.CurrentStudent.id);   
  }

  CheckLocalStorage()
  {
    if(this.data === null)
    {
        this.data = Currentstudent;
        this.ShowStudents = "";
        localStorage.setItem('ShowStudents' , this.ShowStudents);         
    }
    else
    {
      this.CurrentStudent.id = this.data.id;
      this.CurrentStudent.name = this.data.name;
      this.CurrentStudent.father = this.data.father;
      this.CurrentStudent.class = this.data.class;
      this.CurrentStudent.dateOfBirth = this.data.dateOfBirth;
      this.CourseClass = localStorage.getItem('CourseClass');
      this.ShowStudents = localStorage.getItem('ShowStudents');     
    }
    
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
      this.GetStudents();  
    }  
  }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
  GetStudents()
  {
 this.Students$ = this.studentserv.List();
      this.Students$.pipe(takeUntil(this.Destroyed)).subscribe(
        (res : any)=>
        {        
           this.ShowStudents="true";
           localStorage.setItem('ShowStudents' , this.ShowStudents);
           this.Students = res.filter((a : any) => a.class.id === this.ClassData.id);             
           this.StudentCount = this.Students.length;
           localStorage.setItem('StudentCount' , JSON.stringify(this.StudentCount));                               
           this.SetCurrentStudent();
          // this.AddMarks();
        }
       , (err : HttpErrorResponse)=>
        {

        });
  }
  SetCurrentStudent()
  {

    this.CurrentStudent.id = this.Students[this.ArrayInd].id;
    this.CurrentStudent.name = this.Students[this.ArrayInd].name;
    this.CurrentStudent.father = this.Students[this.ArrayInd].father;
    this.CurrentStudent.class = this.Students[this.ArrayInd].class;
    this.CurrentStudent.dateOfBirth = this.Students[this.ArrayInd].dateOfBirth;
    localStorage.setItem('CurrentStudent' , JSON.stringify(this.CurrentStudent)) ;
    this.Form.controls['Student'].setValue(this.Students[this.ArrayInd].id);                        
  }
  AddMarks()
  {
    alert(this.Form.controls['Class'].value);
    alert(this.Form.controls['Subject'].value);
    alert(this.Form.controls['Student'].value);
    alert(this.Form.controls['Marks'].value);
    if(this.ArrayInd < this.Students.length)
    {
      localStorage.setItem('ArrayInd' , JSON.stringify(this.ArrayInd));            
      this.StudentData = this.Students[++this.ArrayInd];          
      this.CurrentStudent.id = this.StudentData.id;
      this.CurrentStudent.name = this.StudentData.name;
      this.CurrentStudent.father = this.StudentData.father;
      this.CurrentStudent.class = this.StudentData.class;
      localStorage.setItem('CurrentStudent' , JSON.stringify(this.CurrentStudent)) ;
      this.Form.controls['Student'].setValue(this.StudentData.id);
      this.Form.controls['Marks'].setValue("");      
    }
    else
    {
      this.ArrayInd = 0;
    }
  }
  DeleteList()
  {     
     this.ShowStudents = "";
     localStorage.removeItem('ShowStudents');
     this.CourseClass = "-";
     localStorage.setItem('CourseClass' , this.CourseClass);
     this.ClassSubject = "-";
     localStorage.setItem('ClassSubject' , this.ClassSubject);
     localStorage.removeItem('CurrentStudent');
     localStorage.removeItem('ArrayInd');
     localStorage.removeItem('ClassData');
     localStorage.removeItem('StudentCount');          
     this.ArrayInd = 0;
     this.CurrentStudent = new Currentstudent();
     this.Form.reset();
  }
  changeclass(e) 
  {
     this.ClassData = this.Classes.find(a => a.id === +e.target.value);     
     this.CourseClass = this.ClassData.name;
     localStorage.setItem('CourseClass' , this.CourseClass);
     localStorage.setItem('ClassData' , JSON.stringify(this.ClassData));    
     this.GetCourses();
  }
  changesubject(e) 
  {
     this.ClassSubject = this.courses.find(a => a.id === +e.target.value).name.toUpperCase();
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
