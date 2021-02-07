import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DisplayMessageDialogueModel } from '../models/display-message-dialogue.model';

@Component({
  selector: 'app-display-message-dialogue',
  templateUrl: './display-message-dialogue.component.html',
  styleUrls: ['./display-message-dialogue.component.scss']
})
export class DisplayMessageDialogueComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DisplayMessageDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DisplayMessageDialogueModel
  ) { }

  ngOnInit(): void {
  }
  onOkClick(): void {
    this.dialogRef.close();
  }
}
