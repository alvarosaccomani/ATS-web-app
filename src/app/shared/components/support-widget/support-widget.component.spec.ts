import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportWidgetComponent } from './support-widget.component';

describe('SupportWidgetComponent', () => {
  let component: SupportWidgetComponent;
  let fixture: ComponentFixture<SupportWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportWidgetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SupportWidgetComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
