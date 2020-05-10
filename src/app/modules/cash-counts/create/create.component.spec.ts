import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashCountCreateComponent } from './create.component';

describe('CreateComponent', () => {
  let component: CashCountCreateComponent;
  let fixture: ComponentFixture<CashCountCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashCountCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashCountCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
