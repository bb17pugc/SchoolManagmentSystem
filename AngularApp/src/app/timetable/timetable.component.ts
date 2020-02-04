import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AddService } from '../services/add.service';
import { ClassModel } from '../models/class-model';
import { Observable } from 'rxjs';
import { Sorting } from '../sorting/sorting';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeacherService } from '../services/teacher.service';
import { CourseserviceService } from '../services/courseservice.service';
import { CourseModel } from '../models/course-model';
import { Teahcer } from '../models/teahcer';
import { TimetableService } from '../services/timetable.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PeriodsDetail } from '../models/periods-detail';
import { Periods } from '../models/periods';
import { Alert } from 'selenium-webdriver';
import { PrintService } from '../services/print.service';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {
  @ViewChild('FormTemplate' , {static : true}) FormTemplate : TemplateRef<any>;
  Title : string = "Time Table";
  Classes$ : Observable<ClassModel[]>;
  classes : ClassModel[] = [];
  Teachers$ : Observable<Teahcer[]>;
  teachers : Teahcer[] = [];
  modalRef : BsModalRef;
  Courses$ : Observable<CourseModel[]>;
  courses : CourseModel[] = [];
  CourseClass : string;
  perioddetail$ : Observable<PeriodsDetail[]>;
  perioddetails : PeriodsDetail[];
  Form : FormGroup;
  periods : Array<Periods> = []; 
  period : Periods = new Periods();
  id : number;
  TeacherDetail : string;
  NotFree : any[] = [];
  constructor(private p :  PrintService , private timetableserv : TimetableService , private teacherserv : TeacherService , private coursesserv : CourseserviceService  , private fb : FormBuilder , private modalservice : BsModalService , private classserv : AddService , private sort : Sorting ) 
  {

  }

  GetTeacherId(id)
{
   this.TeacherDetail = id;
}
  print()
  {
    var data = document.getElementById('contentToConvert');  
    this.p.captureScreen(data);
  }

  ngOnInit() 
  {
    
    this.Form = this.fb.group({
      ID : [0],
      Class : [''],
      Section : [''],
      Period : [''],
      Teacher : ['' , Validators.required],
      Subject : [ '' , Validators.required],
    }); 
    this.GetClasses();
    this.List();
  }
  GetCourses()
  {
    this.CourseClass = this.CourseClass;
    this.Courses$ = this.coursesserv.GetList();
    this.Courses$.subscribe((List : any[] ) => 
      { 
        this.courses = List.filter(a => a.classes.name === this.CourseClass);

      });
  }
  GetTeachers()
  {
      this.Teachers$ = this.teacherserv.List();
      this.Teachers$.subscribe(list => {
           this.teachers = list;
           console.log(this.teachers);
           this.NotFree.forEach(b => {
            this.teachers = this.teachers.filter(a => a.id !== b.teacher.id);  
          });
      }); 
  }
  changecourse(e) 
  {
     this.Form.controls['Subject'].setValue(e.target.value);
  }
  changeteahcer(e)
  {
    this.Form.controls['Teacher'].setValue(e.target.value);
  }
  SetPeriod(ClassName  , Period , section)
  {
    this.Form.controls['ID'].setValue(this.id);
    this.CourseClass = ClassName;
    this.Form.controls['Class'].setValue(ClassName);
    this.Form.controls['Section'].setValue(section);
    this.Form.controls['Period'].setValue(Period);
    this.modalRef = this.modalservice.show(this.FormTemplate);
    this.GetCourses();
    this.GetTeachers();
    this.id=0;
  }
Edit(id)
{
    this.id=id;
}
  onSubmit()
  {
      if(this.Form.valid)
      {
      this.timetableserv.Add(this.Form).subscribe((res : any[])=>
        {
          this.NotFree = res;
          this.List();
        } 
        ,
         (err : HttpErrorResponse) =>
         {
            alert(err.message);
         }
         );
           this.GetTeachers();
         this.modalRef.hide();
        }
      }
  List()
  {
      this.perioddetail$ = this.timetableserv.List();
      this.perioddetail$.subscribe((obj : any) => {
            this.NotFree=obj.notfree;
           this.perioddetails = obj.list;
           this.periods.length = 0;
           this.classes.forEach(element => {
               this.periods.push(
                  {
                    class : element,
                    p1 : this.perioddetails.filter(a => ((a.classes === null) ? 0 : a.classes.id) === element.id && a.period == '1'),
                    p2 : this.perioddetails.filter(a => ((a.classes === null) ? 0 : a.classes.id) === element.id && a.period == '2'), 
                    p3 : this.perioddetails.filter(a => ((a.classes === null) ? 0 : a.classes.id) === element.id && a.period == '3'), 
                    p4 : this.perioddetails.filter(a => ((a.classes === null) ? 0 : a.classes.id) === element.id && a.period == '4'), 
                    p5 : this.perioddetails.filter(a => ((a.classes === null) ? 0 : a.classes.id) === element.id && a.period == '5'), 
                    p6 : this.perioddetails.filter(a => ((a.classes === null) ? 0 : a.classes.id) === element.id && a.period == '6'), 
                    p7 : this.perioddetails.filter(a => ((a.classes === null) ? 0 : a.classes.id) === element.id && a.period == '7'), 
                    p8 : this.perioddetails.filter(a => ((a.classes === null) ? 0 : a.classes.id) === element.id && a.period == '8'), 
                    p9 : this.perioddetails.filter(a => ((a.classes === null) ? 0 : a.classes.id) === element.id && a.period == '9'), 
                  }
                 ); 
              });
              console.log(this.periods);  
      });
  }
  GetClasses()
  {
     this.Classes$ = this.classserv.GetClasses();
     this.Classes$.subscribe(list => {  
         this.classes = list.sort(this.sort.SortNumbers("name" , "asc"));        
     });
 
  }
}
