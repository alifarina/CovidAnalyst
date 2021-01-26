import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from '../services/login-service.service';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    public loginService: LoginServiceService,    
    public navigationService: NavigationService,
  ) { }

  ngOnInit(): void {
  }

  onLogOut():void {
    this.loginService.logOut();
    this.navigationService.changeNavigation('login');
  }
  redirectToPatientList():void{
    this.navigationService.changeNavigation('patientlist');
  }

}
