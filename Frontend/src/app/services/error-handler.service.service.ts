import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DisplayMessageDialogueModel } from '../models/display-message-dialogue.model';
import { DisplayMessageDialogueComponent } from '../display-message-dialogue/display-message-dialogue.component';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(public dialog: MatDialog) {}

  showDialog(data: DisplayMessageDialogueModel): MatDialogRef<DisplayMessageDialogueComponent, any> {
    const dialogRef = this.dialog.open(DisplayMessageDialogueComponent, {
      width: '350px',
      data: data,
    });
    return dialogRef;
  }
}
