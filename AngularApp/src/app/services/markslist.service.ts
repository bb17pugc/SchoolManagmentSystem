import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MarkslistService {

  constructor() { }
  Add(Form)
  {
      alert(Form.value.Class);
      alert(Form.value.Subject);
      alert(Form.value.Student);
      alert(Form.value.Marks);
      alert(Form.value.Total);
  }
}
