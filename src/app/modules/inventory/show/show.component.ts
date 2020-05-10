import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InventoryItemService } from 'app/services/inventory_item';
import { fetchAnimation } from 'app/animations/animations';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss'],
  animations:[fetchAnimation]
})
export class InventoryShowComponent implements OnInit {

  item: any = {};
  isFetching: boolean = true;

  constructor(private route: ActivatedRoute,
              private inventoryService: InventoryItemService) {
  }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];
    this.isFetching = true;
    this.inventoryService.read(id).subscribe(
      data => {
        this.item = data;
        this.isFetching = false;

      }
    );


  }

}
