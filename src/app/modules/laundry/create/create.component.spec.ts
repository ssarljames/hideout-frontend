import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaundryCreateComponent } from './create.component';

describe('LaundryCreateComponent', () => {
  let component: LaundryCreateComponent;
  let fixture: ComponentFixture<LaundryCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaundryCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.LaundryCreateComponent(LaundryCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
