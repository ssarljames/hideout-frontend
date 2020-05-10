import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaundryEditComponent } from './edit.component';

describe('LaundryEditComponent', () => {
  let component: LaundryEditComponent;
  let fixture: ComponentFixture<LaundryEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaundryEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaundryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
