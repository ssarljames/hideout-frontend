import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPaymentModalComponent } from './add-payment-modal.component';

describe('AddPaymentModalComponent', () => {
  let component: AddPaymentModalComponent;
  let fixture: ComponentFixture<AddPaymentModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPaymentModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPaymentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
