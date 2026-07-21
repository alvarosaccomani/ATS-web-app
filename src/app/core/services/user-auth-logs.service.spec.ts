import { TestBed } from '@angular/core/testing';

import { UserAuthLogsService } from './user-auth-logs.service';

describe('UserAuthLogsService', () => {
  let service: UserAuthLogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserAuthLogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
