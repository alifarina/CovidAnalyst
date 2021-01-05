import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SlideInOutAnimation } from 'src/imports/custom-animations';
import {
  PatientHealthInfo,
  PatientSymptomsInfo,
} from '../models/patient-model';
@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss'],
  animations: [SlideInOutAnimation],
})
export class PatientComponent implements OnInit, AfterViewInit {
  isLinear = true;
  patientBoxVisible = false;
  patientHealthInfoFormGroup: FormGroup;
  patientSymptomsInfoFormGroup: FormGroup;
  patientHealthInfo: PatientHealthInfo;
  patientSymptomsInfo: PatientSymptomsInfo;
  _formBuilder: FormBuilder;
  
  constructor(formBuilder: FormBuilder) {
    this._formBuilder = formBuilder;
  }
  ngAfterViewInit(): void {
    
  }
  submitStepperForm(): void {
    let z = '';
  }

  ngOnInit(): void {   
    this.patientHealthInfo = new PatientHealthInfo();
    this.patientSymptomsInfo = new PatientSymptomsInfo();

    this.patientSymptomsInfoFormGroup = this._formBuilder.group({
      hasBreathlessnessField: ['', []],
      hasFeverField: ['', []],
      hasLossOfTasteSmellField: ['', []],
      hasDryCoughField: ['', []],
      hasSoreThroatField: ['', []],
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
