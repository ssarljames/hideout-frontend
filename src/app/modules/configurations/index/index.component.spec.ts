import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationIndexComponent } from './index.component';

describe('ConfigurationIndexComponent', () => {
  let component: ConfigurationIndexComponent;
  let fixture: ComponentFixture<ConfigurationIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
