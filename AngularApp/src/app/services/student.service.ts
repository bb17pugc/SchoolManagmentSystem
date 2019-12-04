import { Injectable } from '@angular/core';
import { HttpHeaders , HttpClient } from '@angular/common/http';
import { ReturnStatement } from '@angular/compiler';
import { Student } from '../models/student';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  Students$ : Observable<Student[]>;
  readonly BaseUrl = 'https://localhost:44361/api/Students'
  readonly reqheaders = new HttpHeaders().set("Content-Type" , "application/json").set("accept" , "application/json");          
  model = new Student();
  constructor( private http : HttpClient ) 
  { 
      this.model= new Student();
  }
Add(Form)
{
  var body = 
  {
    ID : Form.value.ID != 0?Form.value.ID : 0,
    Name : Form.value.Name,
    Father : Form.value.Father,
    ClassId : Form.value.Class,
    DateOfBirth : Form.value.DateOfBirth, 
  };
   return this.http.post(this.BaseUrl + '/Add', body , {headers : this.reqheaders} );
}
Edit(id)
{
    return this.http.get(this.BaseUrl + '/Edit/'+id , {headers : this.reqheaders});   
}
Clear()
{
  this.Students$ = null;
}

List()
{
  this.Clear();
    if(!this.Students$)
    {
      return this.http.get<Student[]>(this.BaseUrl+'/List').pipe(shareReplay());
    }
    return this.Students$;
}
Delete(id)
{
   return this.http.delete(this.BaseUrl+'/Delete/'+id , {headers : this.reqheaders} );
}
}
