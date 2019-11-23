import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { ClassModel } from 'src/app/models/class-model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CourseserviceService } from 'src/app/services/courseservice.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CourseModel } from 'src/app/models/course-model';
import { Observable , Subscription, Subject } from 'rxjs';
import { AddService } from 'src/app/services/add.service';
import { Sorting } from 'src/app/sorting/sorting';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { map } from 'rxjs/operators';



@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent implements OnInit {
  @ViewChild('NameInput' , {static : true}) NameInput: ElementRef; 
  @ViewChild('DeleteTemplate' , {static : false}) Deletetemplate : TemplateRef<any>;
  Title : string = "Add New Subject";
  Classes$ : Observable<ClassModel[]>;
  Classes : ClassModel[] = [];
  Form : FormGroup;
  dropdownval : any ;
  Courses$ : Observable<CourseModel[]>;
  courses : CourseModel[] = [];
  dtTrigger: Subject<any> = new Subject();
  searchText : any;
  PageSize : number = 10;
  CurrentPage : number = 1;
  SkipEl : number = 0;
  TotalPages : number=0;
  Asc : string = "false";
  EditMode : string = "false";
  modalRef : BsModalRef;
  DeleteItemId : any;
  DistinctClass : Array<number>;

  constructor ( private modalService :BsModalService ,private sort : Sorting , private courseserv : CourseserviceService , private classserv : AddService , private fb : FormBuilder) 
  {

  }

  ngOnInit() 
  {
    var unamePattern = "^([a-z A-Z]+)$";   
    this.Form = this.fb.group({
    ID:[0],
    Name : ['' , [Validators.required , Validators.pattern(unamePattern)]] , 
    Class : ['' , Validators.required] 
     });
   this.NameInput.nativeElement.focus(); 
   this.ClassesList();
   this.List();
   this.SkipEl = (this.CurrentPage-1)*this.PageSize;
  }
  nextpage()
  {
    this.CurrentPage = this.CurrentPage+1;
    this.SkipEl = (this.CurrentPage-1)*this.PageSize;
  }
  previouspage()
  {
    this.CurrentPage = this.CurrentPage-1;
    this.SkipEl = (this.CurrentPage-1)*this.PageSize;    
  }
SortBy(col , datatype)
{
  if(this.Asc == "true")
  {
    this.courses.sort(this.sort.SortString(col , "dsc"));
    this.Asc = "false";
  }
  else
  {
    this.courses.sort(this.sort.SortString(col , "asc"));
    this.Asc = "true";
  }

}

Edit(id)
{
   this.courseserv.Edit(id).subscribe((res : any) =>
     {
        this.Form.controls['ID'].setValue(res.id);
        this.Form.controls['Name'].setValue(res.name);
        this.Form.controls['Class'].setValue(res.class); 
        this.EditMode = "true";
        this.Title = "Edit Subject " + res.name + " for " + res.class;
      } 
     ,
      err =>
     {
         alert(err.error);
     });
}
List()
{
       this.courseserv.Clear();
       this.Courses$ = this.courseserv.GetList();      
       this.Courses$.subscribe(res => 
         {
           this.courses =res;
           this.TotalPages = this.courses.length / this.PageSize;
           this.TotalPages = Math.ceil(this.TotalPages);
         }); 
         
      }


      changeVal(e) 
      {
         this.Form.get['Class'].set(e.target.value);
}
      
onSubmit()
{
  if(this.Form.valid)
  {
     this.courseserv.Add(this.Form).subscribe(
       res => 
       {
          this.Form.controls['Name'].setValue("");
          this.NameInput.nativeElement.focus();
          this.List();
          if(this.EditMode == "true")
          {
            this.EditMode = "false";
          }
       } ,
        (err : HttpErrorResponse) =>
         {
            alert(err.error);
         });
}
}
ClassesList()
{
    this.classserv.Clear();
     this.Classes$ = this.classserv.GetClasses();
     this.Classes$.subscribe((res : ClassModel[]) => {
            this.DistinctClass = [...new Set(res.map(item => item.name))];
            ;
     } );     
}
ConfirmDelete(id)
{
   this.DeleteItemId = id;
   this.modalRef = this.modalService.show(this.Deletetemplate);
}  
Delete()
{
     this.courseserv.Delete(this.DeleteItemId).subscribe(res =>
      {
        this.List();
      },
      (err : HttpErrorResponse) =>
      {
        alert(err.error);
      });  
}

}