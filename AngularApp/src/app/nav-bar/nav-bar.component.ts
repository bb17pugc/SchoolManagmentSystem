import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  ShowMenu: boolean;
  ngOnInit(): void {
    if (localStorage.getItem('jwttoken') != null) {
      this.ShowMenu = true;
    }
    else
    {
      this.ShowMenu = false;
    }

    }
  constructor(private router: Router)
  {
  }

  logout()
  {
    localStorage.removeItem('jwttoken');
    location.reload();
    this.router.navigateByUrl('/login'); 
  }
}
