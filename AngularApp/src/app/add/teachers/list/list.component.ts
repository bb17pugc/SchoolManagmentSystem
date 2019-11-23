import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Teahcer } from 'src/app/models/teahcer';
import { TeacherService } from 'src/app/services/teacher.service';
import { Sorting } from 'src/app/sorting/sorting';
import { Route, Router, NavigationExtras } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
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

  constructor(private modalservice : BsModalService , private router : Router , private teacherserv : TeacherService , private sort : Sorting) { }

  ngOnInit() 
  {
      this.List();
  }
  SortBy(col)
  {
    if(this.Asc == "true")
  {
    this.teachers.sort(this.sort.SortString(col , "dsc"));
    this.Asc = "false";
  }
  else
  {
    this.teachers.sort(this.sort.SortString(col , "asc"));
    this.Asc = "true";
  }
  }
  List()
  {
      this.teachers$ = this.teacherserv.List();
      this.teachers$.subscribe(res => 
        {
           this.teachers = res;
           this.TotalPages = this.teachers.length / this.PageSize;
           this.TotalPages = Math.ceil(this.TotalPages);
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
     this.router.navigate(['add/add-teachers'] , {queryParams : {id : id}});
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
}
