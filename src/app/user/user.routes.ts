import { Routes } from '@angular/router';

import { UserLayoutComponent } from './user-layout/user-layout.component';
import { BackofficeSuiteComponent } from './backoffice-suite/backoffice-suite.component';

export const USER_ROUTES: Routes = [
    {
        path: '',
        component: UserLayoutComponent,
        children: [
            { path: 'backoffice-suite', component: BackofficeSuiteComponent}
        ]
    }
];