import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Getmarkslists } from '../models/getmarkslists';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MarkslistService {
  readonly BaseUrl = 'https://localhost:44361/api/MarksList';
  readonly ReqHeaders= new HttpHeaders().set("Content-Type" , "application/json").set("accept" , "application/json");  
  MarksList$ : Observable<Getmarkslists[]>;
  
  constructor( private http : HttpClient )
   { }

  Add(Form : any)
  {
      var body = 
      {
          ID : Form.value.ID,
          Class : Form.value.Class,
          Subject : Form.value.Subject,
          Student : Form.value.Student,
          Marks : Form.value.Marks === null ? 0 : Form.value.Marks,
          Total : Form.value.Total,
      };
      console.log(body);
     return this.http.post(this.BaseUrl + '/Add' , body , {headers : this.ReqHeaders});
  }
  List()
  {
      if(!this.MarksList$)
      {
         return this.http.get<Getmarkslists[]>(this.BaseUrl + '/List').pipe(shareReplay());  
      }
      return this.MarksList$;
  }
  Edit(id)
  {
      return this.http.get(this.BaseUrl + '/Edit/'+id , {headers : this.ReqHeaders});
  }
  Delete(id)
  {
      return this.http.delete(this.BaseUrl + '/Delete/'+id , {headers : this.ReqHeaders});
  }
}
