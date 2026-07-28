import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationSettingsTabComponent } from './application-settings-tab.component';

describe('ApplicationSettingsTabComponent', () => {
  let component: ApplicationSettingsTabComponent;
  let fixture: ComponentFixture<ApplicationSettingsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationSettingsTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationSettingsTabComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
