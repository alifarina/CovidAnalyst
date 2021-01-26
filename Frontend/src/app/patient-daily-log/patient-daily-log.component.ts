import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SlideInOutAnimation } from 'src/imports/custom-animations';
import { PaginationModel } from '../models/pagination.model';
import { PatientSymptomsInfo } from '../models/patient-model';
import { LoginServiceService } from '../services/login-service.service';
import { NavigationService } from '../services/navigation.service';
import { PatientDetailsService } from '../services/patient-details.service';

@Component({
  selector: 'app-patient-daily-log',
  templateUrl: './patient-daily-log.component.html',
  styleUrls: ['./patient-daily-log.component.scss'],
  animations: [SlideInOutAnimation],
})
export class PatientDailyLogComponent implements OnInit {
  loading: boolean;
  loginBoxVisible: boolean;
  noDataAvailable: boolean;
  paginationInfo: PaginationModel;
  filters: JSON;
  patientId: string;
  dataSource: MatTableDataSource<PatientSymptomsInfo>;
  displayedColumns: string[] = [
    'dateCreated',
    'hasBreathlessness',
    'hasFever',
    'hasLossOfTasteSmell',
    'hasDryCough',
    'hasSoreThroat',
    'oxygenLevel',
    'heartRate',
    'bloodPressure',
    'temperature',
    'inContactWithCovidPositivePatient'
  ];

  displayedColumnsHeaders: string[] = [
    'Date',
    'Breathlessness',
    'Fever',
    'Loss Of Taste/Smell',
    'Dry Cough',
    'Sore Throat',
    'Oxygen Level',
    'Heart Rate',
    'Blood Pressure',
    'Temperature',
    'In Contact with Covid Positive Patient'
  ];
  pageEvent: PageEvent;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    public patientDetailsService: PatientDetailsService,
    public loginService: LoginServiceService,
    public navigationService: NavigationService,
    private router: Router
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      if (this.router.getCurrentNavigation().extras.state.patientId) {
        this.patientId = this.router.getCurrentNavigation().extras.state.patientId;
      }
    } else {
      if (this.loginService.loginObject.loginTypeSelected === 'Patient') {
        this.patientId = this.loginService.loginObject.id;
      } else {
        let navigationRoute = 'patientlist';
        this.navigationService.changeNavigation(navigationRoute);
      }
    }
  }

  ngOnInit(): void {
    if (!this.loginService.loginObject.isAuthenticated) {
      this.navigationService.defaultNavigation();
    }
    this.initPaginationValues();
    this.refreshData();
    setTimeout(() => {
      this.loginBoxVisible = true;
    }, 500);
  }
  ngAfterViewInit(): void {}
  navigateToForm(): void {
    this.navigationService.changeNavigation('patient');
  }
  initPaginationValues(): void {
    this.paginationInfo = new PaginationModel();
    this.paginationInfo.pageSize = 10;
    this.paginationInfo.sortOrder = 'asc';
    this.paginationInfo.currentPage = 1;
  }
  initPageChange(e: PageEvent): void {
    this.paginationInfo.currentPage = e.pageIndex + 1;
    this.paginationInfo.pageSize = e.pageSize;
    this.getPatientActivityList();
  }
  sortChanged(sort: Sort): void {
    this.paginationInfo.sortOrder = sort.direction;
    this.paginationInfo.sortBy = sort.active;
    this.getPatientActivityList();
  }
  refreshData(): void {
    this.getPatientActivityList();
  }

  getPatientActivityList(): void {
    console.log(this.patientId);
    this.loading = true;
    this.noDataAvailable = false;
    this.patientDetailsService
      .getPatientDailyActivityList(this.patientId)
      .then((res) => {
        let data = res as Array<PatientSymptomsInfo>;
        if (data.length > 0) {          
          if (this.dataSource == undefined) {
            this.dataSource = new MatTableDataSource(data);
          } else {
            this.dataSource.data = data;
          }
          this.paginationInfo.totalLength = data.length;
        } else {
          this.noDataAvailable = true;
        }
        this.loading = false;
      })
      .catch((error) => {
        this.loading = false;
        //error.message;
      });
    //if (this.noDataAvailable) {

    //}
    this.paginationInfo.filter = this.filters;
  }
}
