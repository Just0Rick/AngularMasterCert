import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { DialogService } from './dialog.service';
import { NbaService } from './nba.service';
import { faBan, faCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  @ViewChild(ConfirmationDialogComponent, { static: true}) confDialog!: ConfirmationDialogComponent;

  public static DIALOG_NAME = "DeleteConfirmationDialog";
  public banIcon = faBan;
  public checkIcon = faCheck;
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
