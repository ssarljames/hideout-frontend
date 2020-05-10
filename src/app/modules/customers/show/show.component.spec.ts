import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerShowComponent } from './show.component';

describe('CustomerShowComponent', () => {
  let component: CustomerShowComponent;
  let fixture: ComponentFixture<CustomerShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
