import { TestBed } from '@angular/core/testing';

import { AppUpdatesService } from './app-updates.service';

describe('AppUpdatesService', () => {
  let service: AppUpdatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppUpdatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
