import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EllipsisLoadingComponent } from './ellipsis-loading.component';

describe('EllipsisLoadingComponent', () => {
  let component: EllipsisLoadingComponent;
  let fixture: ComponentFixture<EllipsisLoadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EllipsisLoadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EllipsisLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
