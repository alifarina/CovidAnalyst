import { TestBed } from '@angular/core/testing';

import { ErrorHandler.ServiceService } from './error-handler.service.service';

describe('ErrorHandler.ServiceService', () => {
  let service: ErrorHandler.ServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorHandler.ServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
