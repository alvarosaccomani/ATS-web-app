import { TestBed } from '@angular/core/testing';

import { ApplicationMaintenancesService } from './application-maintenances.service';

describe('ApplicationMaintenancesService', () => {
  let service: ApplicationMaintenancesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationMaintenancesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
