import { TestBed } from '@angular/core/testing';

import { GpDetailsService } from './gp-details.service';

describe('GpDetailsService', () => {
  let service: GpDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GpDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
