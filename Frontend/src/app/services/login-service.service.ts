import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginModel, LoginResponse } from '../models/login-model';
import { AppConfigService } from './app-config.service';
import { CommonService } from './common.service';
@Injectable({
  providedIn: 'root',
})
export class LoginServiceService {
  public loginObject: LoginModel;
  readonly rootUrl = AppConfigService.settings.apiServer.baseUrl;
  readonly loginUrl = AppConfigService.settings.apiServer.loginUrl;
  noCacheHeaders = new HttpHeaders({
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0'
  });
  constructor(public commonService: CommonService) {
    this.loginObject = new LoginModel();
    this.loginObject.loginTypes = ['GP', 'Patient'];
    this.loginObject.isAuthenticated = false;
    this.loginObject.loginTypeSelected="Patient";//comment this
  }

  validateLogin(obj: LoginModel): Promise<Object> {
    return this.commonService.getPostResponse(
      obj,
      this.rootUrl + this.loginUrl,
      this.noCacheHeaders
    );
  }
}
