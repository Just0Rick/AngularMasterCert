import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit, OnDestroy{
  @Input()
  buttonArray: ConfirmationDialogAction[] = [];

  @Input()
  name: string = "default";

  private self: HTMLElement;

  public open: boolean = false;
  constructor(private el: ElementRef){
    this.self = el.nativeElement;
  }

  ngOnInit(): void {
    document.body.appendChild(this.self);
  }

  ngOnDestroy(): void {
    document.body.removeChild(this.self);
  }

  openDialog(){
    this.open = true;
  }

  closeDialog(){
    this.open = false;
  }
}

export interface ConfirmationDialogAction{
  text: string,
  delegate: (reference: ConfirmationDialogComponent, evt?: MouseEvent) => void,
  buttonStyle: "primary" | "secondary" | "default"
}
