import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { Classlistrecored } from 'src/app/models/classlistrecored';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, ReplaySubject } from 'rxjs';
import { Student } from 'src/app/models/student';
import { Studentsarray } from 'src/app/models/studentsarray';
import { ReadPropExpr } from '@angular/compiler';
import { StudentService } from 'src/app/services/student.service';
import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { MarkslistService } from 'src/app/services/markslist.service';
import { Getmarkslists } from 'src/app/models/getmarkslists';
import { Template } from '@angular/compiler/src/render3/r3_ast';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-createstudentlist',
  templateUrl: './createstudentlist.component.html',
  styleUrls: ['./createstudentlist.component.css']
})
export class CreatestudentlistComponent implements OnInit {
  @ViewChild('lblStudentName' , {static : true}) lblStudentName : ElementRef;
  @ViewChild('EditTemplate' , {static : true}) edittemp : TemplateRef<any>
  private Destroyed : ReplaySubject<boolean> = new ReplaySubject(1);
  classrecored  : Classlistrecored = new Classlistrecored();
  Students$ : Observable<Student[]>;
  Students : Studentsarray[] = []; 
  Form : FormGroup;
  CourseClass : number = 0 ;
  ClassSubject : string = "N/A";
  StudentName : string = "N/A";
  Total : number;
  StudentCount : number;
  ArrayInd  : number = 0;
  MarksList$ : Observable<Getmarkslists[]>;
  MarksList : Getmarkslists[] = [];
  ModalRef : BsModalRef;
  EditMode : string = "false" ;
  Title : string = "Marks Lists for Examination";
  constructor(private modalserv : BsModalService , private router : Router , private markslistserv : MarkslistService,private fb : FormBuilder  , private route : ActivatedRoute , private studentserv : StudentService ) { }

  ngOnInit() 
  {
    this.Form = this.fb.group({
      ID :   [0, [Validators.required]],
      Class :   ['', [Validators.required]],
      Subject:  ['' ,[Validators.required]],
      Student : ['' , [Validators.required]]  ,
      Marks : [0 , [ Validators.required]]  ,
      Total : ['' , [Validators.required]],
     });
     this.GetDataFromQuery();      
  }
  SetDataFromQuery()
  {
    this.ClassSubject = (this.classrecored.subject.name).toLocaleUpperCase();    
    this.CourseClass = this.classrecored.class.name;
    this.Total = this.classrecored.totalmarks;
    this.Form.controls['Class'].setValue(this.classrecored.class.id);
    this.Form.controls['Subject'].setValue(this.classrecored.subject.id);
    this.Form.controls['Total'].setValue(this.Total);
    this.Form.controls['Marks'].setValidators([Validators.max(this.Total) , Validators.min(0)]);        
    this.GetStudents();
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
       this.GetMarksList();
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
           this.Students = res.filter((a : any) => (a.class === null)?null:a.class.id === this.classrecored.class.id);             
           this.StudentCount = this.Students.length;
           this.SetCurrentStudent();
           this.ArrayInd = this.ArrayInd + 1;
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
  GoBack()
  {
      this.Form.reset();
      this.classrecored = new Classlistrecored();
      this.router.navigate(['examination/markslists']);
  }

 GetMarksList()
 {
    this.MarksList$=this.markslistserv.List();
    this.MarksList$.pipe(takeUntil(this.Destroyed)).subscribe((res : any) => 
    {
       this.MarksList = res.filter((a : any) => a.classes.id === this.classrecored.class.id && a.course.id === this.classrecored.subject.id );              
    } ,
     (err : HttpErrorResponse) =>
      {

    } );
 }
Edit(id : number)
{   
   this.markslistserv.Edit(id).pipe(takeUntil(this.Destroyed)).subscribe(
     (res : any) =>
      {
          this.Form.controls['ID'].setValue(res.id);
          this.Form.controls['Class'].setValue(res.classes.id);
          this.Form.controls['Subject'].setValue(res.course.id);
          this.Form.controls['Student'].setValue(res.students.id);
          this.Form.controls['Marks'].setValue(res.marks);
          this.Form.controls['Total'].setValue(res.total);
          this.StudentName = res.students.name;
          this.EditMode = "true";
          this.Title = "Edit Student Marks";          
     } , (err : HttpErrorResponse) =>
      {

      });
}
Delete(id)
{
  this.markslistserv.Delete(id).pipe(takeUntil(this.Destroyed)).subscribe((res : any) => 
  {
      alert(res);
      this.GetMarksList();
  } ,
   (err : HttpErrorResponse) =>
    {
         alert(err.error); 
    }); 
}
  AddMarks()
  {
      if(this.ArrayInd < this.StudentCount && this.Form.valid)
      { 
        localStorage.setItem('ArrayInd' , this.ArrayInd.toString());        
        this.markslistserv.Add(this.Form).pipe(takeUntil(this.Destroyed)).subscribe(
          (res : any) => 
          {
                this.Form.controls['Marks'].setValue("");
                this.GetMarksList();
                if(this.EditMode === "true")
                {
                   this.EditMode = "false";
                   this.Title = "Marks Lists for Examination";
                }
          }
           ,
          (err : HttpErrorResponse) => 
          {

          });                
       this.SetCurrentStudent();
       this.ArrayInd = this.ArrayInd + 1;      
      }
      else
      {
        localStorage.setItem('ArrayInd' , this.ArrayInd.toString());        
        this.Form.controls['Student'].setValue("");
        this.StudentName = "List ended";
      }
  }

}
