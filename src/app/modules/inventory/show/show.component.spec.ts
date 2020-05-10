import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryShowComponent } from './show.component';

describe('ShowComponent', () => {
  let component: InventoryShowComponent;
  let fixture: ComponentFixture<InventoryShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
