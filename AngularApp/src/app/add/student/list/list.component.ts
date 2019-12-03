import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { Student } from 'src/app/models/student';
import { StudentService } from 'src/app/services/student.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Teahcer } from 'src/app/models/teahcer';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { TeacherService } from 'src/app/services/teacher.service';
import { Sorting } from 'src/app/sorting/sorting';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListStudentsComponent implements OnInit {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  Students$ : Observable<Student[]>;
  Students : Student[];
  @ViewChild('editTemplate' , {static : false}) edtitemplate : TemplateRef<any>;
  teachers$ : Observable<Teahcer[]>;
  teachers : Teahcer[];
  searchText : string;
  PageSize : number = 10;
  Title : string = "Teachers";
  Asc: string;
  CurrentPage : number = 1;
  TotalPages : number = 0;
  SkipEl: number;
  modalRef : BsModalRef;
  DeleteItemId: any;

  constructor(private StdServ : StudentService , private modalservice : BsModalService , private router : Router , private teacherserv : TeacherService , private sort : Sorting) { }

  ngOnInit() 
  {
      this.GetStudents();
  }
  SortBy(col : string , type : string)
  {
    if(this.Asc == "true")
  {
    this.Students.sort(this.sort.SortData(col , "dsc" , type));
    this.Asc = "false";
  }
  else
  {
    this.Students.sort(this.sort.SortData(col , "asc" , type));
    this.Asc = "true";
  }
  }
  List()
  {
      this.teachers$ = this.teacherserv.List();
      this.teachers$.subscribe(res => 
        {
           this.teachers = res;
        });

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
  ConfirmDelete(id)
  {
      this.DeleteItemId = id;
      this.modalRef = this.modalservice.show(this.edtitemplate);
  }
  Edit(id)
  {
     this.router.navigate(['add/student'] , {queryParams : {id : id}});
  }
Delete()
{
     this.teacherserv.Delete(this.DeleteItemId).subscribe((res : any) =>
     {
         alert("Deleted successfully");
         this.List();
     } ,
      (err : HttpErrorResponse) => 
      {
        alert(err.error);
      });
}
GetStudents()
{
     this.Students$ = this.StdServ.List(); 
    this.Students$.pipe(takeUntil(this.destroyed$)).subscribe(res => 
      {
            this.Students = res;
            this.TotalPages = this.Students.length / this.PageSize;
            this.TotalPages = Math.ceil(this.TotalPages); 
            
      }
       , 
      (err : HttpErrorResponse)=>
      {

      });   
    }

}

