import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryCreateComponent } from './create.component';

describe('CreateComponent', () => {
  let component: InventoryCreateComponent;
  let fixture: ComponentFixture<InventoryCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
