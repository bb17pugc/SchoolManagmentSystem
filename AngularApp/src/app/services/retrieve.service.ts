import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { flatMap, first, shareReplay } from 'rxjs/operators';
import { ClassModel } from '../models/class-model';

@Injectable({
  providedIn: 'root'
})
export class RetrieveService {

  readonly BaseUrl = 'https://localhost:44361/api';
  Classes$: Observable<ClassModel[]>
  constructor(private http: HttpClient) {

  }

  GetClasses(): Observable<ClassModel[]> {
    if (!this.Classes$) {
      this.Classes$ = this.http.get<ClassModel[]>(this.BaseUrl + "/Add/GetClasses").pipe(shareReplay());
    }
    return this.Classes$;
  }
  
  Delete(id : number): any 
  {
    const reqHeaders = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json');
   return  this.http.delete(this.BaseUrl + "/Add/Delete/"+id , {headers : reqHeaders});
  }
 
}
