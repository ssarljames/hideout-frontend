import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ellipsis-loading',
  templateUrl: './ellipsis-loading.component.html',
  styleUrls: ['./ellipsis-loading.component.scss']
})
export class EllipsisLoadingComponent implements OnInit {

  @Input() class: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
