import { TestBed } from '@angular/core/testing';

import { TypeApplicationsService } from './type-applications.service';

describe('TypeApplicationsService', () => {
  let service: TypeApplicationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeApplicationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
