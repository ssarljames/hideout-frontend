import { UserGroupService } from 'app/services/user_group';
import { UserGroup } from 'app/models/user-group/user-group';
import { ComputerStation } from 'app/models/computer-station/computer-station';
import { ComputerStationService } from 'app/services/computer-station';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-computer-station-form-modal',
  templateUrl: './computer-station-form-modal.component.html',
  styleUrls: ['./computer-station-form-modal.component.scss']
})
export class ComputerStationFormModalComponent implements OnInit {

  @Input() computer_station_id: number;

  computerStation: ComputerStation;

  user_groups: UserGroup[] = [];

  constructor(private activeModal: NgbActiveModal,
              private computerStationService: ComputerStationService,
              private userGroupService: UserGroupService,
              private toastr: ToastrService) { }

  ngOnInit() {
    if(this.computer_station_id)
      this.computerStationService.read(this.computer_station_id).subscribe(
        data => {
          this.computerStation = data;
        }
      )
    else
        this.computerStation = new ComputerStation();

    this.userGroupService.query().subscribe(
      data => {
        this.user_groups = data;
      }
    )

  }

  dismiss(): void{
    this.activeModal.dismiss();
  }


  save(){
    let req: Observable<any>;
    if(this.computerStation.id)
      req = this.computerStationService.update(this.computerStation);
    else
      req = this.computerStationService.create(this.computerStation);

    req.subscribe(
      data => {
        this.toastr.success('Saved!');
        this.activeModal.close();
      }
    );
  }

}
