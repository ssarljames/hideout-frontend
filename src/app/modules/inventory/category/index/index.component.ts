import { CategoryService } from '../../../../services/category';
import { Component, OnInit } from '@angular/core';
import { fetchAnimation } from 'app/animations/animations';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  animations: [fetchAnimation]
})
export class InventoryCategoryIndexComponent implements OnInit {

  categories: any[] = [];
  isFetching: boolean = false;

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.isFetching = true;
    this.categoryService.query().subscribe(
      data => {
        this.categories = data;
        this.isFetching = false;
      }
    )
  }

}
