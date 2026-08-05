import { TestBed } from '@angular/core/testing';

import { AppResponsiblesService } from './app-responsibles.service';

describe('AppResponsiblesService', () => {
  let service: AppResponsiblesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppResponsiblesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
