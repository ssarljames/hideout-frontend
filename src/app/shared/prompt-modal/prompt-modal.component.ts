import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-prompt-modal',
  templateUrl: './prompt-modal.component.html',
  styleUrls: ['./prompt-modal.component.scss']
})
export class PromptModalComponent implements OnInit {

  @Input() message: string;
  @Input() color: string;
  @Input() value: string;

  userInput: string = '';


  constructor(private activeModal: NgbActiveModal) { }
  
  ngOnInit() {
    this.color = this.color ? this.color : 'info';
    this.userInput = this.value;
  }

  close(val: string): void{
    this.activeModal.close(val);
  }
  
}
