import { TestBed } from '@angular/core/testing';

import { SystemEventsService } from './system-events.service';

describe('SystemEventsService', () => {
  let service: SystemEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SystemEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
