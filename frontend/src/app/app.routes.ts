import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LeaveRequestComponent } from './components/leave-request/leave-request.component';
import { PayslipComponent } from './components/payslip/payslip.component';
import { LayoutComponent } from './components/layout/layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'leave-request', component: LeaveRequestComponent },
      { path: 'payslip', component: PayslipComponent }
    ]
  }
];