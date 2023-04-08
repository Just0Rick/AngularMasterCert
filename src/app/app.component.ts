import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationDialogAction, ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  @ViewChild(ConfirmationDialogComponent, { static: true}) confDialog!: ConfirmationDialogComponent;

  dialogActions: ConfirmationDialogAction[] = [
    {
      text: 'No',
      buttonStyle: 'default',
      delegate: (reference) => reference.closeDialog()
    },
    {
      text: 'Yes',
      buttonStyle: 'secondary',
      delegate: (reference) => reference.closeDialog()
    }
  ];

  ngOnInit(): void {
    this.confDialog.openDialog();
  }
}
