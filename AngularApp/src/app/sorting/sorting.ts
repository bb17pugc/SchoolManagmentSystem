import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })

export class Sorting 
{
  SortNumbers(pro , order)
  {
    if(order == "asc")
    {
      return function(a, b) 
      {
        return a[pro] - b[pro]; 
      }     
    }
    else
    {
      return function(a, b) 
      {
        return b[pro] - a[pro]; 
      }           
    }
  }
  SortString(property , order) {
  if(order == "asc")
  {
    return function (a,b) {
      return a[property].localeCompare(b[property]);        
     }
  }
  else
  {
    return function (a,b) {
      return b[property].localeCompare(a[property]);        
      }
    }

  }

}
