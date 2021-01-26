import { Component, OnInit, ViewChild } from '@angular/core';
import { SlideInOutAnimation } from 'src/imports/custom-animations';
import { PaginationModel } from '../models/pagination.model';
import { GPDetails, GPResponse } from '../models/gp-model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { LoginServiceService } from '../services/login-service.service';
import { NavigationService } from '../services/navigation.service';
import { GpDetailsService } from '../services/gp-details.service';
import {
  AddConsultation,
  ConsultationDetails,
  ConsultationDialogModel,
} from '../models/consultations-model';
import { forkJoin } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConsultationDialogComponent } from '../consultation-dialog/consultation-dialog.component';

@Component({
  selector: 'app-gp-list',
  templateUrl: './gp-list.component.html',
  styleUrls: ['./gp-list.component.scss'],
  animations: [SlideInOutAnimation],
})
export class GpListComponent implements OnInit {
  loading: boolean;
  loginBoxVisible: boolean;
  noDataAvailable: boolean;
  paginationInfo: PaginationModel;
  filters: JSON;
  dataSource: MatTableDataSource<GPDetails>;
  displayedColumns: string[] = [
    'name',
    'age',
    'sex',
    'location',
    'alreadyConsulted',
  ];

  displayedColumnsHeaders: string[] = [
    'Full Name',
    'Age',
    'Sex',
    'Location',
    ' ',
  ];
  pageEvent: PageEvent;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public gpDetailsService: GpDetailsService,
    public loginService: LoginServiceService,
    public navigationService: NavigationService,
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
    this.getGPList();
  }
  sortChanged(sort: Sort): void {
    this.paginationInfo.sortOrder = sort.direction;
    this.paginationInfo.sortBy = sort.active;
    this.getGPList();
  }
  refreshData(): void {
    this.getGPList();
  }

  getGPList(): void {
    this.loading = true;
    this.noDataAvailable = false;

    forkJoin([
      this.gpDetailsService.getGpList(),
      this.gpDetailsService.getAlreadyConsultedGPByPatient(
        this.loginService.loginObject.id
      ),
    ]).subscribe(
      (results) => {
        let data = results[0] as Array<GPDetails>;
        data.forEach((element) => {
          if(!element.consultationText){
            element.consultationText = '';
          }
          if(!element.isCovidTestRequired){
            element.isCovidTestRequired = 0;
          }
          if(!element.alreadyConsulted){
            element.alreadyConsulted = 0;
          }         
        });

        let data1 = results[1] as Array<ConsultationDetails>;
        if (data1) {
          if (data1.length > 0) {
            data1.forEach((element) => {
              let alreadyConsultedGP = data.filter((e) => {
                return e.id == element.gpId;
              })[0];
              if (alreadyConsultedGP) {
                alreadyConsultedGP.alreadyConsulted = 1;
                alreadyConsultedGP.consultationText = element.consultationText;
                alreadyConsultedGP.isCovidTestRequired =
                  element.isCovidTestRequired;
              }
            });
          } else {
            data.forEach((element) => {
              element.alreadyConsulted = 0;
              element.consultationText = '';
              element.isCovidTestRequired = 0;
            });
          }
        }

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
      },
      (error) => {
        //handle your error here
      },
      () => {
        //observable completes
      }
    );
    //  this.gpDetailsService
    // .getGpList()
    // .then((res) => {
    //   let data = res as Array<GPDetails>;
    //   if (data.length > 0) {
    //     if (this.dataSource == undefined) {
    //       this.dataSource = new MatTableDataSource(data);
    //     } else {
    //       this.dataSource.data = data;
    //     }
    //     this.paginationInfo.totalLength = data.length;
    //   } else {
    //     this.noDataAvailable = true;
    //   }
    //   this.loading = false;
    // })
    // .catch((error) => {
    //   this.loading = false;
    //   //error.message;
    // });
    //if (this.noDataAvailable) {

    //}
    this.paginationInfo.filter = this.filters;
  }
  viewGPRecommendation(obj: GPDetails): void {
    let dialogData = new ConsultationDialogModel();
    dialogData.gpName = obj.name;
    dialogData.patientName = this.loginService.loginObject.name;
    dialogData.gpId = obj.id;
    dialogData.patientId = this.loginService.loginObject.id;
    dialogData.isCovidTestRequired = obj.isCovidTestRequired;
    dialogData.consultationText = obj.consultationText;
    dialogData.header = 'Recommendation by: ' + dialogData.gpName;
    const dialogRef = this.dialog.open(ConsultationDialogComponent, {
      width: '450px',
      data: dialogData,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result); // Pizza!
    });
  }
  consultGP(id: string, consulted: boolean): void {
    //console.log('id:' + id + ' already consulted:' + consulted);
    let obj = new AddConsultation();
    obj.gpId = id;
    obj.isActive = consulted ? 0 : 1;
    obj.patientId = this.loginService.loginObject.id;

    this.loading = true;
    this.gpDetailsService
      .AddGpConsultation(obj)
      .then((res) => {
        let responseG = res as GPResponse;
        if (responseG) {
          if (responseG.success) {
            // let el = this.dataSource.data.filter((x) => {
            //   return x.id == responseG.gpId;
            // })[0];
            // el.alreadyConsulted = consulted ? 0 : 1;
            // el.consultationText= el.alreadyConsulted===0?'':el.consultationText;
            this.refreshData();
          } else {
            //some error
          }
        } else {
          //some error
        }
        this.loading = false;
      })
      .catch((error) => {
        this.loading = false;
        //error.message;
      });
  }
}
