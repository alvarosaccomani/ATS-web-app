import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeSuiteComponent } from './backoffice-suite.component';

describe('BackofficeSuiteComponent', () => {
  let component: BackofficeSuiteComponent;
  let fixture: ComponentFixture<BackofficeSuiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackofficeSuiteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BackofficeSuiteComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
