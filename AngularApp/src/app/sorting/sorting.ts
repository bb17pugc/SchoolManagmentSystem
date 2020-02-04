import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })

export class Sorting 
{

  SortData(property : string , order : string , type : string)
  {
     if(type == 'string')
     {
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
     else
     {
      if(order == "asc")
      {
        return function(a, b) 
        {
          return a[property] - b[property]; 
        }     
      }
      else
      {
        return function(a, b) 
        {
          return b[property] - a[property]; 
        }           
      }
     }
  } 

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
  SortString(property : string , order : string) 
  {
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
