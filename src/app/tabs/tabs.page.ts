import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServizigeneraliService } from '../services/servizigenerali.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private router: Router, public servizigenerali: ServizigeneraliService) {}

  logout(){
    this.servizigenerali.username = "";
    this.servizigenerali.password = "";
    localStorage.removeItem("token");
		this.router.navigate(['/login']);
  }

}
