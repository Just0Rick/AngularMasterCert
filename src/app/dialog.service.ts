import { Injectable } from '@angular/core';
import { ConfirmationDialogAction, ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialogs: ConfirmationDialogComponent[] = [];
  constructor() { }

  registerDialog(dialog: ConfirmationDialogComponent){
    if(!this.dialogs.find(x => x.name == dialog.name))
      this.dialogs.push(dialog);
  }

  removeDialog(name: string){
    this.dialogs.splice(this.dialogs.findIndex(x => x.name == name), 1);
  }

  openDialog(name: string){
    let temp = this.dialogs.find(x => x.name == name);
    if(!temp) console.log('no temp');
    else temp.openDialog();
  }

  closeDialog(name: string){
    this.dialogs.find(x => x.name == name)?.closeDialog();
  }

  setActions(name:string, actions: ConfirmationDialogAction[]){
    let dialog = this.dialogs.find(x => x.name == name);
    if(dialog) dialog.buttonArray = actions;
  }
}
