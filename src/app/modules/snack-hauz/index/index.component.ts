import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class SnackHauzIndexComponent implements OnInit {

  constructor(private router: Router) {
    //router.navigate(['/snack-hauz/orders']);
  }

  ngOnInit() {
  }

}
