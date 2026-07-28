import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTabComponent } from './audit-tab.component';

describe('AuditTabComponent', () => {
  let component: AuditTabComponent;
  let fixture: ComponentFixture<AuditTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuditTabComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
