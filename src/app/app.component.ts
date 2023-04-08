import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationDialogAction, ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { DialogService } from './dialog.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  @ViewChild(ConfirmationDialogComponent, { static: true}) confDialog!: ConfirmationDialogComponent;

  constructor(private dialogService: DialogService) { }

  ngOnInit(): void {
    this.dialogService.registerDialog(this.confDialog);
  }
}
