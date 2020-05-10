import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VaultCreateComponent } from './create.component';

describe('VaultCreateComponent', () => {
  let component: VaultCreateComponent;
  let fixture: ComponentFixture<VaultCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VaultCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VaultCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
