import { ToastrService } from 'ngx-toastr';
import { UserGroupService } from 'app/services/user_group';
import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserGroup } from 'app/models/user-group/user-group';

@Component({
  selector: 'app-user-group-modal',
  templateUrl: './user-group-modal.component.html',
  styleUrls: ['./user-group-modal.component.scss']
})
export class UserGroupModalComponent implements OnInit {

  @Input() user_group_id: number;

  selectedUserGroup: UserGroup;


  constructor(private activeModal: NgbActiveModal,
              private userGroupService: UserGroupService,
              private toastr: ToastrService) { }

  ngOnInit() {
    console.log(this.user_group_id);

    this.userGroupService.read(this.user_group_id).subscribe(
      (data) => {
        this.selectedUserGroup = data;
      }
    )
  }

  dismiss(): void{
    this.activeModal.close('');
  }



  saveUserGroup(): void{

    this.userGroupService.update(this.selectedUserGroup).subscribe(
      userGroup => {
        this.toastr.success('Group has been updated!');
        this.activeModal.close('');
      }
    )
  }

}
