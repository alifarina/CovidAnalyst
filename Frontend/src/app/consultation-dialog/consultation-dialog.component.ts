import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConsultationDialogModel } from '../models/consultations-model';
import { LoginServiceService } from '../services/login-service.service';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-consultation-dialog',
  templateUrl: './consultation-dialog.component.html',
  styleUrls: ['./consultation-dialog.component.scss']
})
export class ConsultationDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConsultationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConsultationDialogModel,
    public loginService: LoginServiceService,    
    public navigationService: NavigationService
  ) { }

  ngOnInit(): void {
  }
  onUpdateClick(): void {
    this.dialogRef.close(this.data);
  }
}
