import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { PatientListModel } from '../models/patient-model';
import { PaginationModel } from '../models/pagination.model';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { SlideInOutAnimation } from 'src/imports/custom-animations';
import { PatientDetailsService } from '../services/patient-details.service';
import { LoginServiceService } from '../services/login-service.service';
import { NavigationService } from '../services/navigation.service';
import {
  ConsultationDetails,
  ConsultationDialogModel,
  ConsultationUpdateRecordResponse,
} from '../models/consultations-model';
import { ConsultationDialogComponent } from '../consultation-dialog/consultation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { GpDetailsService } from '../services/gp-details.service';
import { ErrorHandlerService } from '../services/error-handler.service.service';
import { DisplayMessageDialogueModel } from '../models/display-message-dialogue.model';
@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss'],
  animations: [SlideInOutAnimation],
})
export class PatientListComponent implements OnInit, AfterViewInit {
  loading: boolean;
  loginBoxVisible: boolean;
  noDataAvailable: boolean;
  paginationInfo: PaginationModel;
  filters: JSON;
  dataSource: MatTableDataSource<PatientListModel>;
  displayedColumns: string[] = [
    'name',
    'age',
    'sex',
    'bloodGroup',
    'registeredOn',
    'hasHypertension',
    'hasDiabetes',
    'hasCardiovascularDisease',
    'hasChronicRespiratoryDisease',    
    'patientId'
  ];

  displayedColumnsHeaders: string[] = [
    'Full Name',
    'Age',
    'Sex',
    'Blood Group',
    'Registered on',
    'HyperTension',
    'Diabetes',
    'Cardiovascular Disease',
    'Chronic Respiratory Disease',    
    'Details',
  ];
  pageEvent: PageEvent;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    public patientDetailsService: PatientDetailsService,
    public loginService: LoginServiceService,
    public navigationService: NavigationService,
    public gpDetailsService: GpDetailsService,
    private errorHandlerService: ErrorHandlerService,
    public dialog: MatDialog
  ) {}

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
  initPaginationValues(): void {
    this.paginationInfo = new PaginationModel();
    this.paginationInfo.pageSize = 10;
    this.paginationInfo.sortOrder = 'asc';
    this.paginationInfo.currentPage = 1;
  }
  initPageChange(e: PageEvent): void {
    this.paginationInfo.currentPage = e.pageIndex + 1;
    this.paginationInfo.pageSize = e.pageSize;
    this.getPatientList();
  }
  sortChanged(sort: Sort): void {
    this.paginationInfo.sortOrder = sort.direction;
    this.paginationInfo.sortBy = sort.active;
    this.getPatientList();
  }
  refreshData(): void {
    this.getPatientList();
  }

  getPatientList(): void {
    this.loading = true;
    this.noDataAvailable = false;
    this.patientDetailsService
      .getPatientList(this.loginService.loginObject.id)
      .then((res) => {
        let data = res as Array<PatientListModel>;
        if (data) {
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

  redirectToPatientDailyList(id: string) {
    this.navigationService.changeNavigationByParams('patientdailylist', {
      patientId: id,
    });
    console.log(id);
  }
  redirectToPatientRecommendation(obj: PatientListModel) {
    this.loading = true;
    let dialogData = new ConsultationDialogModel();
    dialogData.gpName = this.loginService.loginObject.name;
    dialogData.gpId = this.loginService.loginObject.id;
    dialogData.header = 'Recommendation by: ' + dialogData.gpName;
    dialogData.patientName = obj.name;
    dialogData.patientId = obj.patientId;
    dialogData.isCovidTestRequired = 0;
    dialogData.consultationText = '';
    this.gpDetailsService
      .getConsultationByGPandPatientId(obj.patientId, dialogData.gpId)
      .toPromise()
      .then((res) => {
        let data1 = res as Array<ConsultationDetails>;
        if (data1.length > 0) {
          dialogData.isCovidTestRequired = data1[0].isCovidTestRequired;
          dialogData.consultationText = data1[0].consultationText;
        } else {
          dialogData.patientName = obj.name;
          dialogData.patientId = obj.patientId;
        }
        this.loading = false;
        const dialogRef = this.dialog.open(ConsultationDialogComponent, {
          width: '450px',
          data: dialogData,
        });
        dialogRef.afterClosed().subscribe((result: ConsultationDialogModel) => {
          console.log(result); // Pizza!

          let obj = new ConsultationDetails();
          obj.patientId = result.patientId;
          obj.gpId = result.gpId;
          obj.consultationText = result.consultationText;
          obj.isCovidTestRequired = result.isCovidTestRequired;

          this.gpDetailsService
            .updateGpConsultation(obj)
            .then((res) => {
              let s = res as ConsultationUpdateRecordResponse;
              if (!s.success) {
                setTimeout(() => {
                  let errorData = new DisplayMessageDialogueModel();
                  errorData.header = 'Error';
                  errorData.description =
                    'Some error occurred while updating consultation';
                  this.errorHandlerService.showDialog(errorData);
                }, 100);
              } else {
                setTimeout(() => {
                  let successData = new DisplayMessageDialogueModel();
                  successData.header = 'Success';
                  successData.description = 'Consultation Updated';
                  this.errorHandlerService.showDialog(successData);
                }, 100);
              }
            })
            .catch((error) => {
              this.loading = false;
              //error.message;
            });
        });
      })
      .catch((error) => {
        this.loading = false;
        //error.message;
      });
  }
}
