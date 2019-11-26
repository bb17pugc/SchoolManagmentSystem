import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PeriodsDetail } from '../models/periods-detail';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TimetableService {

  readonly BaseUrl = 'https://localhost:44361/api';
  readonly reqheaders = new HttpHeaders().set("Content-Type" , "application/json").set("accept" , "application/json");
  perioddetail$ : Observable<PeriodsDetail[]>

  constructor( private http : HttpClient ) { }
  Add(Form)
  {
      var body = 
      {
          ID : Form.value.ID ,      
          Classes : Form.value.Class,
          Section : Form.value.Section,
          Period : Form.value.Period,
          Course : Form.value.Subject,
          Teacher : Form.value.Teacher
      }
      
   return this.http.post(this.BaseUrl+'/TimeTable/Add' , body , {headers : this.reqheaders})
  }
  List()
  {
    this.Clear();
    if(!this.perioddetail$)
    {
      return this.http.get<PeriodsDetail[]>(this.BaseUrl + '/TimeTable/List').pipe(shareReplay());
    }
    return this.perioddetail$;
  }
  Clear()
  {
    this.perioddetail$ = null;
  }
}
