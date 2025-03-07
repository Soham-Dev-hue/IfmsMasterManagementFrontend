import { TestBed } from '@angular/core/testing';

import { SaoService } from './sao.service';

describe('SaoService', () => {
  let service: SaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
