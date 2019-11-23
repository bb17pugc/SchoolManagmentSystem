import { ReactiveFormsModule } from '@angular/forms';
import { Injectable, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClassModel } from '../models/class-model';
import { shareReplay } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AddService {

  Classes$: Observable<ClassModel[]>;
  readonly BaseUrl = 'https://localhost:44361/api';
  readonly reqheaders = new HttpHeaders().set('Content-Type' , 'application/json').set('accept' , 'application/json');
  
  constructor(private fb: ReactiveFormsModule, private http: HttpClient) {

  }

  GetClasses(): Observable<ClassModel[]> 
  {
    this.Clear();
    if (!this.Classes$) {
      this.Classes$ = this.http.get<ClassModel[]>(this.BaseUrl + "/Add/GetClasses").pipe(shareReplay());
    }
    return this.Classes$;
  }
  Clear()
  {
    this.Classes$ = null;
  }
  Delete(id : number): any 
  {
   return  this.http.delete(this.BaseUrl + "/Add/Delete/"+id , {headers : this.reqheaders});
  }
 
  AddClasses(Form) {
    var body =
    {
      ID: Form.value.ID != 0?Form.value.ID:0,
      Name: Form.value.Name,
      Fee: Form.value.Fee,
      Section: Form.value.Section,
    }
    return this.http.post(this.BaseUrl + '/Add/AddClass', body, { headers: this.reqheaders });
  }

  GetClassById(Id)
  {
    return this.http.get(this.BaseUrl + '/Add/EditClass/'+Id , { headers: this.reqheaders });     
  }
}
