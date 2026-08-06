import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationMaintenanceTabComponent } from './application-maintenance-tab.component';

describe('ApplicationMaintenanceTabComponent', () => {
  let component: ApplicationMaintenanceTabComponent;
  let fixture: ComponentFixture<ApplicationMaintenanceTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationMaintenanceTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationMaintenanceTabComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
