import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackHauzIndexComponent } from './index.component';

describe('IndexComponent', () => {
  let component: SnackHauzIndexComponent;
  let fixture: ComponentFixture<SnackHauzIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnackHauzIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackHauzIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
