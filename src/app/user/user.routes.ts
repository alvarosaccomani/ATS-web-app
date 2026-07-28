import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth-guard';

import { UserLayoutComponent } from './user-layout/user-layout.component';
import { BackofficeSuiteComponent } from './backoffice-suite/backoffice-suite.component';
import { LauncherTabComponent } from './launcher-tab/launcher-tab.component';
import { AuditTabComponent } from './audit-tab/audit-tab.component';
import { SubscriptionsTabComponent } from './subscriptions-tab/subscriptions-tab.component';
import { ApplicationsTabComponent } from './applications-tab/applications-tab.component';

export const USER_ROUTES: Routes = [
    {
        path: '',
        component: UserLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: 'backoffice-suite', component: BackofficeSuiteComponent},
            { path: 'backoffice-suite/launcher', component: LauncherTabComponent},
            { path: 'backoffice-suite/audit', component: AuditTabComponent},
            { path: 'backoffice-suite/subscriptions', component: SubscriptionsTabComponent},
            { path: 'backoffice-suite/applications', component: ApplicationsTabComponent}
        ]
    }
];