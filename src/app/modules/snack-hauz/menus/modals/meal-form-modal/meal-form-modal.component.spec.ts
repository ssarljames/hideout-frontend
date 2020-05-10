import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MealFormModalComponent } from './meal-form-modal.component';

describe('MealFormModalComponent', () => {
  let component: MealFormModalComponent;
  let fixture: ComponentFixture<MealFormModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MealFormModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MealFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
