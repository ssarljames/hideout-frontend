import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComputerStationFormModalComponent } from './computer-station-form-modal.component';

describe('ComputerStationFormModalComponent', () => {
  let component: ComputerStationFormModalComponent;
  let fixture: ComponentFixture<ComputerStationFormModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComputerStationFormModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComputerStationFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
