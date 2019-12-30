import { Component, OnInit, NgModule } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { Observable, ReplaySubject } from 'rxjs';
import { Datesheet } from 'src/app/models/datesheet';
import { DatesheetService } from 'src/app/services/datesheet.service';
import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

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
  DateSheet$ : Observable<Datesheet[]>;
  DateSheet :Datesheet[] = [];
  constructor( private route : Router , private datesheetserv : DatesheetService ) { }

  ngOnInit()
  {
    this.GetDateSheet();
  }

  
//method to obtain the lists of past datesheets
GetDateSheet() : void
{ 
    this.DateSheet$ = this.datesheetserv.List();
    this.DateSheet$.pipe(takeUntil(this.Destroyed)).subscribe((res : any[]) =>
     {
        this.DateSheet = res.filter(
          (thing, i, arr) => arr.findIndex(t => t.dateSheetName === thing.dateSheetName) === i
        );               
     }
      ,
       (err : HttpErrorResponse) =>
    {

    });
}
//method to send datesheetname to other method for edit purpose
Edit(val : string) : void
{
   this.route.navigate(['/examination/datesheet'] , {queryParams : {datesheetname : val}});
}
}
