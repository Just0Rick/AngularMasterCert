import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationDialogAction, ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { DialogService } from './dialog.service';
import { NbaService } from './nba.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  @ViewChild(ConfirmationDialogComponent, { static: true}) confDialog!: ConfirmationDialogComponent;

  public static DIALOG_NAME = "DeleteConfirmationDialog";
  public dialogName: string = "";
  
  constructor(
    private dialogService: DialogService,
    private nbaService: NbaService
    ) { 
    this.dialogName = AppComponent.DIALOG_NAME;
  }

  ngOnInit(): void {
    this.dialogService.registerDialog(this.confDialog);
  }

  onNoClick(){
    this.confDialog.closeDialog();
  }

  onYesClick(){
    this.confDialog.closeDialog();
    this.nbaService.removeTrackedTeam(this.confDialog.dialogData);
  }
}
