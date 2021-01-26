import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SlideInOutAnimation } from 'src/imports/custom-animations';
import {
  PatientDailyRecordResponse,
  PatientHealthInfo,
  PatientSymptomsInfo,
} from '../models/patient-model';
import { LoginServiceService } from '../services/login-service.service';
import { NavigationService } from '../services/navigation.service';
import { PatientDetailsService } from '../services/patient-details.service';
@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss'],
  animations: [SlideInOutAnimation],
})
export class PatientComponent implements OnInit, AfterViewInit {
  isLinear = true;
  loading:boolean;
  patientBoxVisible = false;  
  patientSymptomsInfoFormGroup: FormGroup;
  patientHealthInfo: PatientHealthInfo;
  patientSymptomsInfo: PatientSymptomsInfo;
  _formBuilder: FormBuilder;
  
  constructor
  (
    formBuilder: FormBuilder,
    public loginService: LoginServiceService,
    public navigationService: NavigationService,
    public patientDetailsService: PatientDetailsService
  ) 
  {
    this._formBuilder = formBuilder;
  }
  ngAfterViewInit(): void {
    
  }
  submitStepperForm(): void {
    this.patientSymptomsInfo.patientId=this.loginService.loginObject.id;
    this.patientSymptomsInfo.dateCreated=new Date();
    this.patientDetailsService.patientSubmitDailyEntry(this.patientSymptomsInfo)
    .then((res) => {
      let resp=res as PatientDailyRecordResponse;
      if (resp.success) {
        this.navigationService.changeNavigation('patientdailylist');
      }
      else{
        //some error
      }
    })
    .catch((error) => {
      this.loading = false;
      //error.message;
    });
  }

  ngOnInit(): void {   
    if (!this.loginService.loginObject.isAuthenticated) {
      this.navigationService.defaultNavigation();
    }    
    this.patientSymptomsInfo = new PatientSymptomsInfo();

    this.patientSymptomsInfoFormGroup = this._formBuilder.group({
      hasBreathlessnessField: ['', []],
      hasFeverField: ['', []],
      hasLossOfTasteSmellField: ['', []],
      hasDryCoughField: ['', []],
      hasSoreThroatField: ['', []],
      inContactWithCovidPositivePatientField: ['', []],
      oxygenLevelTextField: ['', [Validators.required]],
      heartRateTextField: ['', [Validators.required]],
      bloodPressureTextField: ['', [Validators.required]],
      temperatureTextField: ['', [Validators.required]]
    });
    setTimeout(() => {
      this.patientBoxVisible = true;      
    }, 500);
  }
}
