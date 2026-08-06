import { TestBed } from '@angular/core/testing';

import { ApplicationUpdatesService } from './application-updates.service';

describe('ApplicationUpdatesService', () => {
  let service: ApplicationUpdatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationUpdatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
