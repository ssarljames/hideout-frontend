import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialAutocompleteChipComponent } from './material-autocomplete-chip.component';

describe('MaterialAutocompleteChipComponent', () => {
  let component: MaterialAutocompleteChipComponent;
  let fixture: ComponentFixture<MaterialAutocompleteChipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialAutocompleteChipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialAutocompleteChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
