import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-custom-button',
  templateUrl: './custom-button.component.html',
  styleUrls: ['./custom-button.component.css']
})
export class CustomButtonComponent implements OnInit{
  @Output()
  public onAction = new EventEmitter<MouseEvent>();

  @Input('class')
  public classes: string = "";

  constructor() { }

  ngOnInit(): void {
    console.log(this.classes);
  }

  onClick(evt: MouseEvent){
    this.onAction.emit(evt);
  }

}
