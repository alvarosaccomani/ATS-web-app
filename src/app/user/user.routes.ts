import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth-guard';

import { UserLayoutComponent } from './user-layout/user-layout.component';
import { BackofficeSuiteComponent } from './backoffice-suite/backoffice-suite.component';
import { LauncherTabComponent } from './launcher-tab/launcher-tab.component';
import { AuditTabComponent } from './audit-tab/audit-tab.component';
import { SubscriptionsTabComponent } from './subscriptions-tab/subscriptions-tab.component';
import { ApplicationsTabComponent } from './applications-tab/applications-tab.component';
import { TicketsTabComponent } from './tickets-tab/tickets-tab.component';
import { ApplicationSettingsTabComponent } from './application-settings-tab/application-settings-tab.component';
import { ApplicationMaintenanceTabComponent } from './application-maintenance-tab/application-maintenance-tab.component';

export const USER_ROUTES: Routes = [
    {
        path: '',
        component: UserLayoutComponent,
        canActivate: [authGuard],
        children: [
            { 
                path: 'backoffice-suite', 
                component: BackofficeSuiteComponent,
                children: [
                    { path: '', redirectTo: 'launcher', pathMatch: 'full' },
                    { path: 'launcher', component: LauncherTabComponent },
                    { path: 'audit', component: AuditTabComponent },
                    { path: 'subscriptions', component: SubscriptionsTabComponent },
                    { path: 'applications', component: ApplicationsTabComponent },
                    { path: 'tickets', component: TicketsTabComponent },
                    { path: 'application-settings/:app_uuid', component: ApplicationSettingsTabComponent },
                    { path: 'application-maintenance/:app_uuid', component: ApplicationMaintenanceTabComponent }
                ]
            }
        ]
    }
];