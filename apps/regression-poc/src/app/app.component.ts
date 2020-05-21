import { Component, OnInit } from '@angular/core';
import { LoginService } from '../Shared/services/login.service';

@Component({
  selector: 'qa-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  loggedIn$ = this.loginService.LoggedOn$;

  constructor(private loginService:LoginService) {
  }

  ngOnInit(): void {
    this.loginService.isUserLoggedIn();
  }


}
