import { TestBed } from '@angular/core/testing';

import { AppMaintenancesService } from './app-maintenances.service';

describe('AppMaintenancesService', () => {
  let service: AppMaintenancesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppMaintenancesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
