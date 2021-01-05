import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SlideInOutAnimation } from 'src/imports/custom-animations';
import { RegisterModel, RegisterResponseModel } from '../models/login-model';
import { PatientHealthInfo } from '../models/patient-model';
import { LoginServiceService } from '../services/login-service.service';
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
  colsValue:number;
  constructor
  (
    formBuilder: FormBuilder,
    public registerService: RegisterUserService,
    public loginService: LoginServiceService

  ) 
  {
    this._formBuilder = formBuilder;
  }

  ngOnInit(): void {    
    this.colsValue=(this.loginService.loginObject.loginTypeSelected.toLowerCase()=="gp"?1:2);
    this.patientHealthInfo = new PatientHealthInfo();
    this.profileInfo = new RegisterModel();
    this.patientHealthInfoFormGroup = this._formBuilder.group({
      hasHypertensionField: ['', []],
      hasDiabetesField: ['', []],
      hasCardiovascularDiseaseField: ['', []],
      hasChronicRespiratoryDiseaseField: ['', []],
    });
    this.getProfileInfo();
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
    let id='e6f048a5-a18b-42eb-aefd-b4d491596dcb';
    let loginType='GP'
    this.registerService.getRegisteredUser(id,loginType).then((res) => {
      let resObj = res as RegisterResponseModel;
      if (resObj.success) {
        this.profileInfo.name=resObj.name;
        this.profileInfo.age=resObj.age;
        this.profileInfo.bloodGroup=resObj.bloodGroup;
        this.profileInfo.location=resObj.location;
        this.profileInfo.sex=resObj.sex;
        console.log('Got Details successfull');       
      } else {
        alert('Got Details Error');
      }
    })
    .catch((error) => {
      //error.message;
    });
    
  }
  healthDetailsSubmit($event):void{

  }
}
