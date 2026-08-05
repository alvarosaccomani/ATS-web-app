import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SupportWidgetComponent } from '../../shared/components/support-widget/support-widget.component';

@Component({
  selector: 'app-user-layout',
  imports: [
    RouterModule,
    SupportWidgetComponent
  ],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.scss',
})
export class UserLayoutComponent {}
