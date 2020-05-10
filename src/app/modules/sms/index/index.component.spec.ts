import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsIndexComponent } from './index.component';

describe('IndexComponent', () => {
  let component: SmsIndexComponent;
  let fixture: ComponentFixture<SmsIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
