import { TestBed } from '@angular/core/testing';

import { AppBackupsService } from './app-backups.service';

describe('AppBackupsService', () => {
  let service: AppBackupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppBackupsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
