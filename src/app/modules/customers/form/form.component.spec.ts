import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { customerFormComponent } from './form.component';

describe('customerFormComponent', () => {
  let component: customerFormComponent;
  let fixture: ComponentFixture<customerFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ customerFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(customerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
