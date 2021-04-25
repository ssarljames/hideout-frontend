import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {InternetPlan} from '../../../../models/internet-plan/internet-plan';
import {FormGroup} from '../../../../core/utils/form-group/form-group';
import {FormControl, Validators} from '@angular/forms';
import {InternetPlanService} from '../../../../services/internet-plan/internet-plan.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  form: FormGroup;

  constructor(private activeModal: NgbActiveModal,
              private internetPlanService: InternetPlanService) {
    this.form = new FormGroup({
      name: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
      bill: new FormControl("", [Validators.required]),
    });
  }

  ngOnInit() {

  }

  close(): void{
    this.activeModal.close();
  }

  save(): void {
    if (this.form.valid) {
      this.internetPlanService.create(this.form.value).subscribe( (response) => {
        this.close();
      });
    }
  }

}
