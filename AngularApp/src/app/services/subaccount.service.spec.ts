import { TestBed } from '@angular/core/testing';

import { SubaccountService } from './subaccount.service';

describe('SubaccountService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubaccountService = TestBed.get(SubaccountService);
    expect(service).toBeTruthy();
  });
});
