import { TestBed } from '@angular/core/testing';

import { DdoService } from './ddo.service';

describe('DdoService', () => {
  let service: DdoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DdoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
