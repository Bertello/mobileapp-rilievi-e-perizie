import { TestBed } from '@angular/core/testing';

import { ServizigeneraliService } from './servizigenerali.service';

describe('ServizigeneraliService', () => {
  let service: ServizigeneraliService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServizigeneraliService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
