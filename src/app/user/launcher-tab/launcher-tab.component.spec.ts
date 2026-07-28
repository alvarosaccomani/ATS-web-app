import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LauncherTabComponent } from './launcher-tab.component';

describe('LauncherTabComponent', () => {
  let component: LauncherTabComponent;
  let fixture: ComponentFixture<LauncherTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LauncherTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LauncherTabComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
