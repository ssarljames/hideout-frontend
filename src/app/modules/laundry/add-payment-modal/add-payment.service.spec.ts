import { TestBed } from '@angular/core/testing';

import { AddPaymentService } from './add-payment.service';

describe('AddPaymentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AddPaymentService = TestBed.get(AddPaymentService);
    expect(service).toBeTruthy();
  });
});
