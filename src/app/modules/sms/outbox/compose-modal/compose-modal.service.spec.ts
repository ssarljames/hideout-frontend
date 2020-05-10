import { TestBed } from '@angular/core/testing';

import { ComposeModalService } from './compose-modal.service';

describe('ComposeModalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComposeModalService = TestBed.get(ComposeModalService);
    expect(service).toBeTruthy();
  });
});
