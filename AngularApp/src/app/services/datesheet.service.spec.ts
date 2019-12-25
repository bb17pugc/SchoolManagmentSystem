import { TestBed } from '@angular/core/testing';

import { DatesheetService } from './datesheet.service';

describe('DatesheetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatesheetService = TestBed.get(DatesheetService);
    expect(service).toBeTruthy();
  });
});
