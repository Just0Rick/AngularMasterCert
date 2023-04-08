import { Injectable } from '@angular/core';
import { ConfirmationDialogAction, ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialog?: ConfirmationDialogComponent = undefined;
  constructor() { }

  registerDialog(dialog: ConfirmationDialogComponent){
    this.dialog = dialog;
  }

  removeDialog(){
    this.dialog = undefined;
  }

  openDialog(){
    this.dialog?.openDialog();
  }

  closeDialog(){
    this.dialog?.closeDialog();
  }

  setActions(actions: ConfirmationDialogAction[]){
    if(this.dialog) this.dialog.buttonArray = actions;
  }
}
