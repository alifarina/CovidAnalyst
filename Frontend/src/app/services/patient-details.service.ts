import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PatientListModel, PatientSymptomsInfo } from '../models/patient-model';
import { AppConfigService } from './app-config.service';
import { CommonService } from './common.service';
import { LoginServiceService } from './login-service.service';

@Injectable({
  providedIn: 'root',
})
export class PatientDetailsService {
  readonly rootUrl = AppConfigService.settings.apiServer.baseUrl;
  readonly dailyRecordUrl =
    AppConfigService.settings.apiServer.patientDailyRecord;
  readonly allPatientsUrl = AppConfigService.settings.apiServer.allPatients;
  noCacheHeaders = new HttpHeaders({
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0',
    'X-Auth': '',
  });
  constructor(
    public commonService: CommonService,
    public loginService: LoginServiceService
  ) {}

  initAuthHeader(): void {
    this.noCacheHeaders = this.noCacheHeaders.set(
      'X-Auth',
      this.loginService.loginObject.username +
        ':' +
        this.loginService.loginObject.password
    );
  }

  getPatientHealthProfile(patientId: string) {
    this.initAuthHeader();

    let pram = new HttpParams()
      .set('patientId', patientId)
      .set('key', 'patientprofile');

    return this.commonService.getGetResponse(
      this.rootUrl + this.allPatientsUrl,
      this.noCacheHeaders,
      pram
    );
  }

  insertOrUpdatePatientProfile(obj: PatientListModel) {
    this.initAuthHeader();

    return this.commonService.getPostResponse(
      obj,
      this.rootUrl + this.allPatientsUrl,
      this.noCacheHeaders
    );
  }

  getPatientList(gpId: string): Promise<Object> {
    // let listP = new Array<PatientListModel>();
    // let patient = new PatientListModel();
    // patient.patientId = 'da7b3722-5530-40db-8be1-1dfb8d1afc80';
    // patient.name = 'Bla bla bla';
    // patient.age = 27;
    // patient.sex = 'Male';
    // patient.bloodGroup = 'O+';
    // patient.hasCardiovascularDisease = 1;
    // patient.hasChronicRespiratoryDisease = 0;
    // patient.hasDiabetes = 1;
    // patient.hasHypertension = 1;
    // patient.registeredOn = new Date();
    // listP.push(patient);
    // patient = new PatientListModel();
    // patient.name = 'Bla bla';
    // patient.patientId = '6c85d2f4-1210-4d94-8576-3cdeaf27f41c';
    // patient.age = 28;
    // patient.sex = 'Female';
    // patient.bloodGroup = 'O+';
    // patient.hasCardiovascularDisease = 0;
    // patient.hasChronicRespiratoryDisease = 0;
    // patient.hasDiabetes = 1;
    // patient.hasHypertension = 1;
    // patient.registeredOn = new Date();
    // listP.push(patient);

    // return new Promise(function (resolve, reject) {
    //   resolve(listP);
    // });
    this.initAuthHeader();

    let pram = new HttpParams()
      .set('gpId', gpId)
      .set('key', 'patientsWithConsultation');

    return this.commonService.getGetResponse(
      this.rootUrl + this.allPatientsUrl,
      this.noCacheHeaders,
      pram
    );
  }

  getPatientDailyActivityList(patientId: string): Promise<Object> {
    // let listP = Array<PatientSymptomsInfo>();
    // let activity = new PatientSymptomsInfo();
    // activity.bloodPressure = 100;
    // activity.hasBreathlessness = 1;
    // activity.hasDryCough = 0;
    // activity.hasFever = 1;
    // activity.hasLossOfTasteSmell = 1;
    // activity.hasSoreThroat = 0;
    // activity.heartRate = 90;
    // activity.oxygenLevel = 90;
    // activity.temperature = 85;
    // listP.push(activity);
    // return new Promise(function (resolve, reject) {
    //   resolve(listP);
    // });
    this.initAuthHeader();

    let pram = new HttpParams().set('id', patientId);

    return this.commonService.getGetResponse(
      this.rootUrl + this.dailyRecordUrl,
      this.noCacheHeaders,
      pram
    );
  }

  patientSubmitDailyEntry(entry: PatientSymptomsInfo): Promise<Object> {
    this.initAuthHeader();

    return this.commonService.getPostResponse(
      entry,
      this.rootUrl + this.dailyRecordUrl,
      this.noCacheHeaders
    );
  }
}
