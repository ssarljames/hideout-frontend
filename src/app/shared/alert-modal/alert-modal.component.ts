import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss']
})
export class AlertModalComponent implements OnInit {

  @Input() message: string;
  @Input() color: string;

  constructor(private activeModal: NgbActiveModal) {}

  ngOnInit() {
    this.color = this.color ? this.color : 'info';
  }

  close(): void{
    this.activeModal.close();
  }

}
