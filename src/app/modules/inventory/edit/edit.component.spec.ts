import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryItemEditComponent } from './edit.component';

describe('InventoryItemEditComponent', () => {
  let component: InventoryItemEditComponent;
  let fixture: ComponentFixture<InventoryItemEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryItemEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryItemEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
