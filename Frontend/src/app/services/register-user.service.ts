import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterModel } from '../models/login-model';
import {
  PatientHealthInfo,
  PatientSymptomsInfo,
} from '../models/patient-model';
import { AppConfigService } from './app-config.service';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root',
})
export class RegisterUserService {
  readonly rootUrl = AppConfigService.settings.apiServer.baseUrl;
  readonly registerUrl=AppConfigService.settings.apiServer.registerUrl;
  noCacheHeaders = new HttpHeaders({
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0',
  });
  constructor(public commonService: CommonService) {}

  registerUser(obj: RegisterModel): Promise<Object> {
    return this.commonService
      .getPostResponse(obj, this.rootUrl + this.registerUrl, this.noCacheHeaders)      
  }

  getRegisteredUser(id:string,loginType:string):Promise<Object>{
    let params = new HttpParams();
    params = params.append('id', id);
    params = params.append('loginType', loginType);
    return this.commonService
      .getGetResponse(this.rootUrl + this.registerUrl, this.noCacheHeaders,params) 
  }

  updatePatientHealthInfo(obj: PatientHealthInfo): void {
    let patientHealthInfoUrl = '';
    this.commonService
      .getPostResponse(
        obj,
        this.rootUrl + patientHealthInfoUrl,
        this.noCacheHeaders
      )
      .then((res) => {
        let resObj = res as boolean;
      })
      .catch((error) => {
        //error.message;
      });
  }
  updatePatientSymptomsInfo(obj: PatientSymptomsInfo): void {
    let patientSymptomsInfoUrl = '';
    this.commonService
      .getPostResponse(
        obj,
        this.rootUrl + patientSymptomsInfoUrl,
        this.noCacheHeaders
      )
      .then((res) => {
        let resObj = res as boolean;
      })
      .catch((error) => {
        //error.message;
      });
  }
}
