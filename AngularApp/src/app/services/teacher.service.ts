import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Teahcer } from '../models/teahcer';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  readonly BaseUrl = 'https://localhost:44361/api';
  teacher$ : Observable<Teahcer[]>;
  readonly reqheaders = new HttpHeaders().set("Content-Type" , "application/json").set("accept" , "application/json");

  constructor(private http : HttpClient) 
  { }
  Add(Form)
  {
      var body = 
      {
         ID : Form.value.ID > 0?Form.value.ID : 0,
         Name : Form.value.Name,
         Cnic : Form.value.Cnic,
         Education : Form.value.Education,
         Institute : Form.value.Institute,
         CompletionDate : Form.value.CompletionDate,
      }
        return this.http.post(this.BaseUrl + '/Teacher/Add' , body , {headers : this.reqheaders});
  }
  Edit(id)
  {
      return this.http.get(this.BaseUrl + '/Teacher/Edit/'+id , {headers : this.reqheaders});
  }
  List()
  {
    this.Clear();
     if(!this.teacher$)
     {
        return this.http.get<Teahcer[]>(this.BaseUrl + '/Teacher/List').pipe(shareReplay());
     }
     return this.teacher$;
  }
  Delete(id)
  {
    return this.http.delete(this.BaseUrl + '/Teacher/Delete/'+id ,{headers : this.reqheaders});
  }
  Clear()
  {
    this.teacher$ = null;
  }

}
