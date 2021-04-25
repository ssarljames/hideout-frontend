import { TestBed } from '@angular/core/testing';

import { InternetPlanService } from './internet-plan.service';

describe('InternetPlanService', () => {
  let service: InternetPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InternetPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
