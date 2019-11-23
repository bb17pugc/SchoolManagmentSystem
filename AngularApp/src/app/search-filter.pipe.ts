import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(classes: any[] , searchvalue: any): any 
  {
    if(!searchvalue) 
    {
      return classes;
    }

    return classes.filter( it =>  it.name == searchvalue );
  }

}
