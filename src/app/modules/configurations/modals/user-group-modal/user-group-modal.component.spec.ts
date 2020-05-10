import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGroupModalComponent } from './user-group-modal.component';

describe('UserGroupModalComponent', () => {
  let component: UserGroupModalComponent;
  let fixture: ComponentFixture<UserGroupModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserGroupModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGroupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
