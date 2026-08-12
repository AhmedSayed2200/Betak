import { TestBed } from '@angular/core/testing';

import { FillterationService } from './fillteration.service';

describe('FillterationService', () => {
  let service: FillterationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FillterationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
