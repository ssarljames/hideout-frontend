import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStatusModalComponent } from './add-status-modal.component';

describe('AddStatusModalComponent', () => {
  let component: AddStatusModalComponent;
  let fixture: ComponentFixture<AddStatusModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStatusModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStatusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
