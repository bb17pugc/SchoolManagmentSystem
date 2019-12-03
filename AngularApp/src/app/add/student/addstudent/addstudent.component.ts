import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ClassModel } from 'src/app/models/class-model';
import { Observable, ReplaySubject } from 'rxjs';
import { AddService } from 'src/app/services/add.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { StudentService } from 'src/app/services/student.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-addstudent',
  templateUrl: './addstudent.component.html',
  styleUrls: ['./addstudent.component.css']
})
export class AddstudentComponent implements OnInit {
  private Destroyed  : ReplaySubject<boolean> = new ReplaySubject();
  @ViewChild('NameInput' , {static : true}) NameInput: ElementRef; 
  Form : FormGroup;
  myDate : string;
  EditMode : string;
  Title : string = "New Student";
  Classes$ : Observable<ClassModel[]>;
  Classes : ClassModel[] = [];

  constructor( private classserv : AddService , private router : Router , private route : ActivatedRoute , private fb : FormBuilder , private studentserv : StudentService) 
  {
  }

  ngOnInit() 
  {   
      var textPattern = "^([a-z A-Z]+)$";   
      var CnicPattern = "^[0-9]{5}-[0-9]{7}-[0-9]$";   
      this.Form = this.fb.group({
            ID : [0],
            Name : ['' , [Validators.required , Validators.pattern(textPattern)]],
            Father : ['' , [Validators.required , Validators.pattern(textPattern)]],
            Class : ['' , [Validators.required]],
            DateOfBirth : ['' , [Validators.required]] 
          } , {validator : CompareDate('DateOfBirth')});

          function CompareDate(controlName: string) {
            return (formGroup: FormGroup) => {
              const control = formGroup.controls[controlName];
              // set error on matchingControl if validation fails
              let dateToBeCheckOut = new Date(control.value);
              let today = new Date(Date.parse(Date()));
              if(dateToBeCheckOut >= today)
              {
                control.setErrors({ invalidDate: true });
              }
            
            }
          }
          this.NameInput.nativeElement.focus();
          //getting id for edit from previos page
          this.route.queryParams.subscribe(data => 
          {
            if(data.id != null)
            {
              this.GetStudent(data.id);
            }
               
          });

     this.ClassesList();
  }
  GetStudent(id)
  {
      this.studentserv.Edit(id).pipe(takeUntil(this.Destroyed)).subscribe(res =>
        {
          console.log(res);
        }
         ,
         (err : HttpErrorResponse) =>
         {

         } 
      );
  }
  ClassesList()
  {
      this.classserv.Clear();
       this.Classes$ = this.classserv.GetClasses();
       this.Classes$.pipe(takeUntil(this.Destroyed)).subscribe((res : ClassModel[]) => {
              this.Classes = res;
       });     
       console.log(this.Classes);
  }
  onSubmit()
  {

    if(this.Form.valid)
    {
      this.studentserv.Add(this.Form).subscribe(res => 
      {
        this.Form.reset();
      }
       ,
      (err:HttpErrorResponse) =>
    {
        
    }
     );
    }
  
   }
   ngOnDestroy() {
    this.Destroyed.next(true);
    this.Destroyed.complete();
  }
}
