import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Classlistrecored } from 'src/app/models/classlistrecored';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, ReplaySubject } from 'rxjs';
import { Student } from 'src/app/models/student';
import { Studentsarray } from 'src/app/models/studentsarray';
import { ReadPropExpr } from '@angular/compiler';
import { StudentService } from 'src/app/services/student.service';
import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { MarkslistService } from 'src/app/services/markslist.service';

@Component({
  selector: 'app-createstudentlist',
  templateUrl: './createstudentlist.component.html',
  styleUrls: ['./createstudentlist.component.css']
})
export class CreatestudentlistComponent implements OnInit {
  @ViewChild('lblStudentName' , {static : true}) lblStudentName : ElementRef;
  private Destroyed : ReplaySubject<boolean> = new ReplaySubject(1);
  classrecored  : Classlistrecored = new Classlistrecored();
  Students$ : Observable<Student[]>;
  Students : Studentsarray[] = []; 
  Form : FormGroup;
  CourseClass : string = "N/A" ;
  ClassSubject : string = "N/A";
  StudentName : string = "N/A";
  Total : number;
  StudentCount : number;
  ArrayInd  : number = 0

  constructor(private markslistserv : MarkslistService,private fb : FormBuilder  , private route : ActivatedRoute , private studentserv : StudentService ) { }

  ngOnInit() 
  {
    this.Form = this.fb.group({
      Class :   ['', [Validators.required]],
      Subject:  ['' ,[Validators.required]],
      Student : ['' , [Validators.required]]  ,
      Marks : ['' , [ Validators.required]]  ,
      Total : ['' , [Validators.required]],
     });
     this.GetDataFromQuery();     
  }
  SetDataFromQuery()
  {
    this.ClassSubject = (this.classrecored.subject.name).toLocaleUpperCase();    
    this.CourseClass = this.classrecored.class.name;
    this.Total = this.classrecored.totalmarks;
    this.Form.controls['Class'].setValue(this.CourseClass);
    this.Form.controls['Subject'].setValue(this.classrecored.subject.id);
    this.Form.controls['Total'].setValue(this.Total);
    this.Form.controls['Marks'].setValidators([Validators.max(this.Total) , Validators.min(0)]);        
    this.GetStudents();
    this.ArrayInd = +localStorage.getItem('ArrayInd') === null ? 0 :+localStorage.getItem('ArrayInd') ;   
  }
  GetDataFromQuery()
  {
    this.route.queryParams
    .subscribe((a : any) => {
       this.classrecored = JSON.parse(a.data === undefined ? null : a.data);
     // popular
    });
    if(this.classrecored.class !== undefined)
    {
       this.SetDataFromQuery();
    }
    else
    {
        alert("No recored found");
    }
  }
  GetStudents()
  {
 this.Students$ = this.studentserv.List();
      this.Students$.pipe(takeUntil(this.Destroyed)).subscribe(
        (res : any)=>
        {        
           this.Students = res.filter((a : any) => a.class.id === this.classrecored.class.id);             
           this.StudentCount = this.Students.length;
           this.SetCurrentStudent();
        }
       , (err : HttpErrorResponse)=>
        {

        });
  }
  SetCurrentStudent()
  {
      this.Form.controls['Student'].setValue(this.Students[this.ArrayInd].id);
      this.StudentName = this.Students[this.ArrayInd].name;
  }
  AddMarks()
  {
      if(this.ArrayInd < this.StudentCount && this.Form.valid)
      {

        this.SetCurrentStudent();
        this.markslistserv.Add(this.Form);
        localStorage.setItem('ArrayInd' , this.ArrayInd.toString());
        this.ArrayInd = this.ArrayInd + 1;                
      }
      else
      {
        localStorage.setItem('ArrayInd' , this.ArrayInd.toString());
        this.ArrayInd = 0;
      }
  }

}
