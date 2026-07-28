import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionsTabComponent } from './subscriptions-tab.component';

describe('SubscriptionsTabComponent', () => {
  let component: SubscriptionsTabComponent;
  let fixture: ComponentFixture<SubscriptionsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionsTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubscriptionsTabComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
