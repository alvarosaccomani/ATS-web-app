import { TestBed } from '@angular/core/testing';

import { ApplicationBackupsService } from './application-backups.service';

describe('ApplicationBackupsService', () => {
  let service: ApplicationBackupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationBackupsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
