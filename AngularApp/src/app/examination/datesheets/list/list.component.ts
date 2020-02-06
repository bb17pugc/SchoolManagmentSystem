import { Component, OnInit, NgModule, ViewChild, TemplateRef } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { Observable, ReplaySubject } from 'rxjs';
import { Datesheet } from 'src/app/models/datesheet';
import { DatesheetService } from 'src/app/services/datesheet.service';
import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Sorting } from 'src/app/sorting/sorting';
import { Template } from '@angular/compiler/src/render3/r3_ast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
@NgModule({
  declarations: [ListDateSheetComponent],
  exports: [ListDateSheetComponent],
  imports: [AppComponent],
  providers: []
})
export class ListDateSheetComponent implements OnInit {
  private  Destroyed : ReplaySubject<boolean> = new ReplaySubject(1);
  @ViewChild('DeleteTemplate' , {static:false}) DeleteRef : TemplateRef<any>
  DateSheet$ : Observable<Datesheet[]>;
  DateSheet :Array<Datesheet>[] = [];
  searchText : any;
  PageSize : number = 10;
  Title : string = "Students";
  Asc: string;
  CurrentPage : number = 1;
  TotalPages : number = 0;
  Students: any;
  SkipEl: number;
  modelRef : BsModalRef;
  DeleteId  : number = 0;
  encPassword: string = "ars1234.";  
  constructor(private modelservice:BsModalService , private sort:Sorting , private route : Router , private datesheetserv : DatesheetService ) { }

  ngOnInit()
  {
    this.GetDateSheet();
  }

  search(value : any)
  {
    this.searchText = value;
  }
  SortBy(col : string , type : string)
  {
    if(this.Asc == "true")
  {
    this.DateSheet.sort(this.sort.SortData(col , "dsc" , type));
    this.Asc = "false";
  }
  else
  {
    this.DateSheet.sort(this.sort.SortData(col , "asc" , type));
    this.Asc = "true";
  }
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
//method to obtain the lists of past datesheets
GetDateSheet() : void
{ 
    this.DateSheet$ = this.datesheetserv.List();
    this.DateSheet$.pipe(takeUntil(this.Destroyed)).subscribe((res : any[]) =>
     {
          this.DateSheet=res;
          this.TotalPages = this.DateSheet.length / this.PageSize; 
          this.TotalPages = Math.ceil(this.TotalPages); 
          console.log(this.DateSheet);     
     }
      ,
       (err : HttpErrorResponse) =>
    {

    });
}
ConfirmDelete(id)
{
    this.modelRef=this.modelservice.show(this.DeleteRef);
    this.DeleteId = id;
}
//to delete from database
Delete()
{
   this.datesheetserv.Delete(this.DeleteId).pipe(takeUntil(this.Destroyed)).subscribe(
     res =>
     {
        this.DateSheet.length = 0;
        this.GetDateSheet();
     }
      ,
     err=>
     {

     });
     this.modelRef.hide(); 
}
//method to send datesheetname to other method for edit purpose
Edit(id)
{
  let encid = CryptoJS.AES.encrypt(id.toString() , this.encPassword).toString();
   this.route.navigate(['/examination/edit-datesheet'] , {queryParams : {id :encid}});
}
}
