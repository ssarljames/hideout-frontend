import { Component, OnInit } from '@angular/core';
import {InternetPlanService} from '../../../../services/internet-plan/internet-plan.service';
import {InternetPlan} from '../../../../models/internet-plan/internet-plan';
import {ApiResponse} from '../../../../core/resource';
import {StateService} from '../../../../core/state.service';
import {AlertModalComponent} from '../../../../shared/alert-modal/alert-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CreateComponent} from '../create/create.component';

@Component({
  selector: 'app-internet-plans',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  internetPlans: InternetPlan[];

  constructor(private internetPlanService: InternetPlanService,
              private stateService: StateService,
              private modalService: NgbModal) { }

  ngOnInit(): void {

    this.internetPlans = this.stateService.get("plans", [])

    this.fetchInternetPlans();
  }

  fetchInternetPlans(): void {
    this.internetPlanService.query().subscribe( (response: ApiResponse) => {
      this.internetPlans = response.data.map(plan => new InternetPlan(plan));
      this.stateService.set("plans", this.internetPlans);
    })
  }

  showCreateModal(): void {
    const modal = this.modalService.open(CreateComponent, { size: 'sm' });

    modal.closed.subscribe( () => {
      this.fetchInternetPlans();
    });

  }

}
