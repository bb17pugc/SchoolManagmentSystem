import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Form } from '@angular/forms';
import { Observable } from 'rxjs';
import { Datesheet } from '../models/datesheet';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatesheetService {
   readonly BaseUrl ='https://localhost:44361/api/DateSheet';
   private readonly reqheaders = new HttpHeaders().set("Content-Type" , "application/json").set("accept" , "application/json");
   DateSheet$: Observable<Datesheet[]>
   constructor(private http : HttpClient) { }
   
   //creating method to submit datesheet data
   Add(Form : any)
   {
       var body=
       {
          ID : 0,
          Name : Form.value.DateSheetName,
          Start : Form.value.StartDate,
          End : Form.value.EndDate
       };
       return this.http.post( this.BaseUrl+'/Add' , body ,  { headers : this.reqheaders });
   }
   AddFullDetails(Form)
   {
      var body = 
      {
         ID : Form.value.ID == 0 ? 0 : Form.value.ID,
         Class : Form.value.Class,
         Date : Form.value.Date,
         Subject : Form.value.Subject,
         Teacher : Form.value.Teacher,
         StartDate : Form.value.StartDate,
         EndDate : Form.value.EndDate,
         DateSheetHeader : Form.value.DateSheetHeader,
      };
   }
   //method to list of datesheet papers from api
   List() : Observable<Datesheet[]>
   {
      this.Clear();
      if(!this.DateSheet$)
      {
          this.DateSheet$ = this.http.get<Datesheet[]>(this.BaseUrl+'/List').pipe(shareReplay());          
      }
       return this.DateSheet$
   }
   Edit(name : string)
   {
      return this.http.get<any[]>(this.BaseUrl + '/Edit/'+name ,{headers : this.reqheaders});   
   }
   Clear() : void
   {

      this.DateSheet$ = null; 
   }
   GetDateSheet(id)
   {
         return this.http.get<any>(this.BaseUrl+'/GetDateSheet/'+id , {headers :this.reqheaders });
   }
   Delete(id)
   {
       return this.http.get<any>(this.BaseUrl+'/Delete/'+id , {headers : this.reqheaders});  
   }
}
