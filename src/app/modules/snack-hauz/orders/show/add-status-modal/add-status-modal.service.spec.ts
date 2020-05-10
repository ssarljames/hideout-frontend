import { TestBed } from '@angular/core/testing';

import { AddStatusModalService } from './add-status-modal.service';

describe('AddStatusModalServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AddStatusModalService = TestBed.get(AddStatusModalService);
    expect(service).toBeTruthy();
  });
});
