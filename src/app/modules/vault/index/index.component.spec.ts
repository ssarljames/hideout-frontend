import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VaultIndexComponent } from './index.component';

describe('IndexComponent', () => {
  let component: VaultIndexComponent;
  let fixture: ComponentFixture<VaultIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VaultIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VaultIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
