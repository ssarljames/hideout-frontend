import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/services/user';
import { fetchAnimation } from 'app/animations/animations';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  animations:[fetchAnimation]
})
export class UserIndexComponent implements OnInit {


  queryParams: any = {
    q: '',
    page: 1,
    per_page: 20,
    sort_active: 'fullname',
    sort_direction: 'asc'

  }
  users: any[] = [];
  meta: any = {};
  isFetching = false;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.fetchUsers();
  }


  fetchUsers(event: KeyboardEvent = null) {
    if (this.isFetching || (event && event.key !== 'Enter')) {
      return;
    }
    this.isFetching = true;
    this.userService.query({
      params: this.queryParams
    }).subscribe(
      data => {
        this.users = data;
        this.isFetching = false;
        this.meta = this.userService.getMeta();
      }
    )
  }

  pageChange($event){
    this.queryParams.page = $event.pageIndex + 1;
    this.queryParams.per_page = $event.pageSize;
    this.fetchUsers();
  }


  sortData($event){
    this.queryParams.sort_active = $event.active;
    this.queryParams.sort_direction = $event.direction;
    this.fetchUsers();
  }

}
