import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaundryIndexComponent } from './index.component';

describe('LaundryIndexComponent', () => {
  let component: LaundryIndexComponent;
  let fixture: ComponentFixture<LaundryIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaundryIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaundryIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
