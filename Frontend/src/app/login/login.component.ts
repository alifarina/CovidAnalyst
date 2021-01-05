import { Component, Input, OnInit } from '@angular/core';
import { SlideInOutAnimation } from '../../imports/custom-animations';
import { LoginServiceService } from '../services/login-service.service';
import { RegisterUserService } from '../services/register-user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  LoginModel,
  LoginResponse,
  RegisterModel,
  RegisterResponseModel,
} from '../models/login-model';
import { MatTabChangeEvent } from '@angular/material/tabs';

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
        } else {
          alert('Login Error');
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
        } else {
          alert('Register Error');
        }
      })
      .catch((error) => {
        //error.message;
      });
    $event.stopPropagation();
  }
}
