import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CourseModel } from '../models/course-model';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CourseserviceService {
  readonly BaseUrl = 'https://localhost:44361/api';
  readonly reqheaders = new HttpHeaders().set('Content-Type' , 'application/json').set('accept' , 'application/json');
  List$ : Observable<CourseModel[]>

  constructor( private http : HttpClient ) { }
  Add(Form)
  {
    var body = 
    {
        ID : Form.ID != 0 ? Form.value.ID : 0,
        Name : Form.value.Name,
        Class : Form.value.Class
    }
    return this.http.post(this.BaseUrl+'/Course/Add' , body , {headers : this.reqheaders});
  }
  Edit(id)
  {
     return this.http.get(this.BaseUrl+'/Course/Edit/'+id , {headers : this.reqheaders});
  }
  Delete(id)
  {
    return this.http.delete(this.BaseUrl + '/Course/Delete/'+ id , {headers : this.reqheaders});
  }
  GetList() : Observable<CourseModel[]>
  {
    this.Clear();
      if(!this.List$)
      {
         this.List$ = this.http.get<CourseModel[]>(this.BaseUrl + "/Course/List").pipe(shareReplay());
      }
      return this.List$;
  }
  Clear()
  {
    this.List$ = null;
  }
}
