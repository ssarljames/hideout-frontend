import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashCountIndexComponent } from './index.component';

describe('CashCountIndexComponent', () => {
  let component: CashCountIndexComponent;
  let fixture: ComponentFixture<CashCountIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashCountIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashCountIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
