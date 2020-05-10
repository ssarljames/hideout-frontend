import { TestBed } from '@angular/core/testing';

import { AddActionModalService } from './add-action-modal.service';

describe('AddActionModalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AddActionModalService = TestBed.get(AddActionModalService);
    expect(service).toBeTruthy();
  });
});
