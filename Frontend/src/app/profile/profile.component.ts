import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SlideInOutAnimation } from 'src/imports/custom-animations';
import { DisplayMessageDialogueModel } from '../models/display-message-dialogue.model';
import { RegisterModel, RegisterResponseModel } from '../models/login-model';
import {
  PatientDailyRecordResponse,
  PatientHealthInfo,
  PatientListModel,
} from '../models/patient-model';
import { ErrorHandlerService } from '../services/error-handler.service.service';
import { LoginServiceService } from '../services/login-service.service';
import { NavigationService } from '../services/navigation.service';
import { PatientDetailsService } from '../services/patient-details.service';
import { RegisterUserService } from '../services/register-user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [SlideInOutAnimation],
})
export class ProfileComponent implements OnInit {
  profileBoxVisible = false;
  patientHealthInfo: PatientHealthInfo;
  profileInfo: RegisterModel;
  patientHealthInfoFormGroup: FormGroup;
  _formBuilder: FormBuilder;
  colsValue: number;
  constructor(
    formBuilder: FormBuilder,
    public registerService: RegisterUserService,
    public loginService: LoginServiceService,
    public patientDetailsService: PatientDetailsService,
    private errorHandlerService: ErrorHandlerService,
    public navigationService: NavigationService
  ) {
    this._formBuilder = formBuilder;
  }

  ngOnInit(): void {
    if (!this.loginService.loginObject.isAuthenticated) {
      this.navigationService.defaultNavigation();
    }
    this.colsValue =
      this.loginService.loginObject.loginTypeSelected.toLowerCase() == 'gp'
        ? 1
        : 2;
    this.patientHealthInfo = new PatientHealthInfo();
    this.profileInfo = new RegisterModel();
    this.patientHealthInfoFormGroup = this._formBuilder.group({
      hasHypertensionField: ['', []],
      hasDiabetesField: ['', []],
      hasCardiovascularDiseaseField: ['', []],
      hasChronicRespiratoryDiseaseField: ['', []],
    });
    this.getProfileInfo();
    if (this.loginService.loginObject.loginTypeSelected !== 'GP') {
      this.getPatientHealthProfile();
    }

    setTimeout(() => {
      this.profileBoxVisible = true;
    }, 500);
  }
  getProfileInfo(): void {
    // this.profileInfo.name='Ankit Nagar';
    // this.profileInfo.age=27;
    // this.profileInfo.bloodGroup='O+';
    // this.profileInfo.location='Paris';
    // this.profileInfo.sex='Male';
    // this.patientHealthInfo.hasDiabetes=1;
    //let id='e6f048a5-a18b-42eb-aefd-b4d491596dcb';
    //let loginType='GP'
    this.registerService
      .getRegisteredUser(
        this.loginService.loginObject.id,
        this.loginService.loginObject.loginTypeSelected
      )
      .then((res) => {
        let resObj = res as RegisterResponseModel;
        if (resObj.success) {
          this.profileInfo.name = resObj.name;
          this.loginService.loginObject.name = this.profileInfo.name;
          this.profileInfo.age = resObj.age;
          this.profileInfo.bloodGroup = resObj.bloodGroup;
          this.profileInfo.location = resObj.location;
          this.profileInfo.sex = resObj.sex;
          console.log('Got Details successfull');
        } else {
          alert('Got Details Error');
        }
      })
      .catch((error) => {
        //error.message;
      });
  }

  getPatientHealthProfile() {
    this.patientDetailsService
      .getPatientHealthProfile(this.loginService.loginObject.id)
      .then((res) => {
        let data = res as Array<PatientHealthInfo>;
        if (data) {
          if (data.length > 0) {
            this.patientHealthInfo.hasDiabetes = data[0].hasDiabetes;
            this.patientHealthInfo.hasHypertension = data[0].hasHypertension;
            this.patientHealthInfo.hasChronicRespiratoryDisease =
              data[0].hasChronicRespiratoryDisease;
            this.patientHealthInfo.hasCardiovascularDisease =
              data[0].hasCardiovascularDisease;
          }
        }
      })
      .catch((error) => {
        //error.message;
      });
  }

  healthDetailsSubmit($event): void {
    let patientProfile = new PatientListModel();
    patientProfile.patientId = this.loginService.loginObject.id;
    patientProfile.hasCardiovascularDisease = this.patientHealthInfo.hasCardiovascularDisease;
    patientProfile.hasChronicRespiratoryDisease = this.patientHealthInfo.hasChronicRespiratoryDisease;
    patientProfile.hasDiabetes = this.patientHealthInfo.hasDiabetes;
    patientProfile.hasHypertension = this.patientHealthInfo.hasHypertension;
    patientProfile.registeredOn = new Date();
    this.patientDetailsService
      .insertOrUpdatePatientProfile(patientProfile)
      .then((res) => {
        let data = res as PatientDailyRecordResponse;
        if (data) {
          if (data.success) {
            let errorData = new DisplayMessageDialogueModel();
            errorData.header = 'Success';
            errorData.description = 'Profile Updated';
            this.errorHandlerService.showDialog(errorData);
          } else {
            let errorData = new DisplayMessageDialogueModel();
            errorData.header = 'Error';
            errorData.description = 'Error while updating profile';
            this.errorHandlerService.showDialog(errorData);
          }
        }
      })
      .catch((error) => {
        let errorData = new DisplayMessageDialogueModel();
        errorData.header = 'Error';
        errorData.description = 'Error while updating profile';
        this.errorHandlerService.showDialog(errorData);
        //error.message;
      });
  }
}
