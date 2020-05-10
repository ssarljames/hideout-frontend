import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {

  @Input() message: string;
  @Input() color: string;
  @Input() withPrompt: boolean;

  equation: string;
  answer: number;
  userInput: number;

  constructor(private activeModal: NgbActiveModal) {}

  ngOnInit() {
    if(this.withPrompt){
      const r1 = Math.floor(Math.random() * 100);
      const r2 = Math.floor(Math.random() * 10) + 1;
      this.equation = r1 + ' + ' + r2;
      this.answer = r1 + r2;
    }

    this.color = this.color ? this.color : 'warning';
  }

  close(): void{

    if(this.answer != Number(this.userInput) && this.withPrompt)
      return;

    this.activeModal.close();
  }

  dismiss(): void{
    this.activeModal.dismiss();
  }

}
