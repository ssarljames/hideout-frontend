import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenusIndexComponent } from './index.component';

describe('IndexComponent', () => {
  let component: MenusIndexComponent;
  let fixture: ComponentFixture<MenusIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenusIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenusIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
