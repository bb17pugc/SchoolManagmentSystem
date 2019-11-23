import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-registration-status',
  templateUrl: './registration-status.component.html',
  styleUrls: ['./registration-status.component.css']
})
export class RegistrationStatusComponent implements OnInit {
  registration: string;
  message: string;
  /** registration-status ctor */
  constructor(private route: ActivatedRoute) {
  }
  ngOnInit(): void
  {
    if (localStorage.getItem('jwttoken') != null) {
      this.message = "your email is Confirmed already!";
    }
    else if (this.registration != "true")
    {
      this.message = "your email is not Confirmed yet!";       
    }

    this.route.queryParams
      .subscribe(pa => {
        this.registration = pa.status;
       // popular
      });
   
    }
}
