import { TestBed } from '@angular/core/testing';

import { ApplicationResponsiblesService } from './application-responsibles.service';

describe('ApplicationResponsiblesService', () => {
  let service: ApplicationResponsiblesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationResponsiblesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
