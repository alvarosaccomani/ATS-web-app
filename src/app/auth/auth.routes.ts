import { Routes } from '@angular/router';

import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ConfirmAccountComponent } from './confirm-account/confirm-account.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

export const AUTH_ROUTES: Routes = [
    {
        path: '',
        component: AuthLayoutComponent,
        children: [
            { path: 'register', component: RegisterComponent},
            { path: 'login', component: LoginComponent},
            { path: 'confirm-account', component: ConfirmAccountComponent},
            { path: 'forgot-password', component: ForgotPasswordComponent},
            { path: 'reset-password', component: ResetPasswordComponent},
        ]
    }
];