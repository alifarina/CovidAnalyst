import { Component, Input, OnInit } from '@angular/core';
import { SlideInOutAnimation } from '../../imports/custom-animations';
import { LoginServiceService } from '../services/login-service.service';
import { RegisterUserService } from '../services/register-user.service';
import { ErrorHandlerService } from '../services/error-handler.service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  LoginModel,
  LoginResponse,
  RegisterModel,
  RegisterResponseModel,
} from '../models/login-model';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { NavigationService } from '../services/navigation.service';
import { DisplayMessageDialogueModel } from '../models/display-message-dialogue.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [SlideInOutAnimation],
})
export class LoginComponent implements OnInit {
  _formBuilder: FormBuilder;
  loginForm: FormGroup;
  registerForm: FormGroup;
  loginModel: LoginModel;
  registerModel: RegisterModel;

  constructor(
    public loginService: LoginServiceService,
    public registerService: RegisterUserService,
    public navigationService: NavigationService,
    private errorHandlerService: ErrorHandlerService,
    formBuilder: FormBuilder
  ) {
    this._formBuilder = formBuilder;
  }
  resetLoginForm(): void {
    this.loginForm.reset();
    this.loginModel = new LoginModel();
    this.loginModel.loginTypeSelected = 'GP';
  }
  resetRegisterForm(): void {
    this.registerForm.reset();
    this.registerModel = new RegisterModel();
    this.registerModel.sex = 'Male';
    this.registerModel.loginTypeSelected = 'GP';
    this.registerModel.bloodGroup = 'O+';
  }
  tabClick($event: MatTabChangeEvent): void {
    if ($event.index === 0) {
      this.resetLoginForm();
    } else {
      this.resetRegisterForm();
    }
  }
  loginBoxVisible: boolean = false;
  ngOnInit(): void {
    if (this.loginService.loginObject.isAuthenticated) {
      this.navigationService.changeNavigation('profile');
    } else {
      setTimeout(() => {
        this.loginBoxVisible = true;
      }, 500);

      this.loginForm = this._formBuilder.group({
        usernameTextField: ['', [Validators.required]],
        passwordTextField: ['', [Validators.required]],
        loginTypeField: ['', [Validators.required]],
      });
      this.registerForm = this._formBuilder.group({
        usernameTextField: ['', [Validators.required]],
        passwordTextField: ['', [Validators.required]],
        confirmPasswordTextField: ['', [Validators.required]],
        fullNameTextField: ['', [Validators.required]],
        ageTextField: ['', [Validators.required]],
        loginTypeField: ['', [Validators.required]],
        sexTextField: ['', [Validators.required]],
        locationTextField: ['', [Validators.required]],
        bloodGroupField: ['', [Validators.required]],
      });
      this.resetLoginForm();
      this.resetRegisterForm();
    }
  }
  loginSubmit($event): void {
    // pass this.loginModel ahead
    this.loginService
      .validateLogin(this.loginModel)
      .then((res) => {
        let resObj = res as LoginResponse;
        if (resObj.success) {
          console.log('Login successfull');
          this.loginService.loginObject.isAuthenticated = resObj.success;
          this.loginService.loginObject.id = resObj.id;
          this.loginService.loginObject.loginTypeSelected = this.loginModel.loginTypeSelected;

          this.navigationService.changeNavigation('profile');
        } else {
          console.log('Login Error');
          let errorData=new DisplayMessageDialogueModel();
          errorData.header='Error';
          errorData.description='Incorrect Username or Password or Login Type';
          this.errorHandlerService.showDialog(errorData);

          this.loginService.loginObject.isAuthenticated = resObj.success;
          this.loginService.loginObject.id = '';
          this.loginService.loginObject.loginTypeSelected = '';
        }
      })
      .catch((error) => {
        //error.message;
      });
    $event.stopPropagation();
  }
  registerSubmit($event): void {
    this.registerService
      .registerUser(this.registerModel)
      .then((res) => {
        let resObj = res as RegisterResponseModel;
        if (resObj.success) {
          console.log('Register successfull');
          this.loginService.loginObject.isAuthenticated = resObj.success;
          this.loginService.loginObject.id = resObj.id;   
          this.loginService.loginObject.loginTypeSelected = this.registerModel.loginTypeSelected;

          this.navigationService.changeNavigation('profile');
        } else {
          console.log('Register Error');
          let errorData=new DisplayMessageDialogueModel();
          errorData.header='Error';
          errorData.description='Some error occurred while registering user';
          this.errorHandlerService.showDialog(errorData);
          this.loginService.loginObject.isAuthenticated = resObj.success;
          this.loginService.loginObject.id = '';
          this.loginService.loginObject.loginTypeSelected = '';
        }
      })
      .catch((error) => {
        //error.message;
      });
    $event.stopPropagation();
  }
}
