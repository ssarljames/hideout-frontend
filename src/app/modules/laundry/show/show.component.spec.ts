import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaundryShowComponent } from './show.component';

describe('LaundryShowComponent', () => {
  let component: LaundryShowComponent;
  let fixture: ComponentFixture<LaundryShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaundryShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaundryShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
