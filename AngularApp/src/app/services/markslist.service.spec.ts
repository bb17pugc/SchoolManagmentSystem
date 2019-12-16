import { TestBed } from '@angular/core/testing';

import { MarkslistService } from './markslist.service';

describe('MarkslistService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MarkslistService = TestBed.get(MarkslistService);
    expect(service).toBeTruthy();
  });
});
