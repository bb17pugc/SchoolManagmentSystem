import { Injectable } from '@angular/core';
import * as jspdf from 'jspdf';  
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  constructor() { }
  public captureScreen(data)  
  {  
    //var data = document.getElementById('contentToConvert');  
    html2canvas(data).then(canvas => {  
      // Few necessary setting options

      var imgWidth = 285;   
      var imgHeight = 150; 
      canvas.prepend();  
      const contentDataURL = canvas.toDataURL('image/png')
      
      let pdf = new jspdf('l', 'mm', 'a4'); // A4 size page of PDF  
      pdf.text(20, 20, '<h2>Do you like that?</h2>');  
      var position = 50;
      pdf.addImage(contentDataURL, 'PNG', 5 , position, imgWidth, imgHeight);  
      pdf.save('MYPdf.pdf'); // Generated PDF   
    });  
  }  
}
