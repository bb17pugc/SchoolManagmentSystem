import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AddService } from 'src/app/services/add.service';
import { Observable, ReplaySubject } from 'rxjs';
import { ClassModel } from 'src/app/models/class-model';
import { HttpErrorResponse } from '@angular/common/http';
import { Sorting } from 'src/app/sorting/sorting';
import { Element } from '@angular/compiler';
import { parse } from 'querystring';

@Component({
  selector: 'app-datesheet',
  templateUrl: './datesheet.component.html',
  styleUrls: ['./datesheet.component.css']
})
export class DatesheetComponent implements OnInit {
private  Destroyed : ReplaySubject<boolean> = new ReplaySubject(1);
Classes$ : Observable<ClassModel[]>;
Classes  : ClassModel[];
CurrentDate :Date = new Date();
Today : any;
CurrentYear : any;
StartDate : Date;
EndDate : Date;
  constructor(private ClassesServ  : AddService , private sort : Sorting) 
  {

  }

  ngOnInit() 
  {
    this.Today = this.CurrentDate.toDateString();
    this.GetClasses();
    this.CurrentYear = this.CurrentDate.getFullYear();
  }
SetDates(val)
{
  this.StartDate = new Date(Date.parse(val));
  console.log(this.StartDate.getDate());
    for(var c= 1 ; c <=10  ;c++ )
    {

    }  
}
  GetClasses()
{
    this.Classes$ = this.ClassesServ.GetClasses();
    this.Classes$.subscribe((res : any)=>
    {
          this.Classes = res;
          this.Classes.sort(this.sort.SortData("name" , "asc" , "number"));    
        } ,
     (err : HttpErrorResponse) =>
      {

      });
}
 ngOnDestroyed()
{
   this.Destroyed.next(true);
   this.Destroyed.complete();
}
}
