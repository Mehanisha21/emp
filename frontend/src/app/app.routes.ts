import { Routes } from '@angular/router';
import { LoginComponent } from './components/login.component';
import { ProfileComponent } from './components/profile.component';
import { DashboardComponent } from './components/dashboard.component';
import { LeaveRequestComponent } from './components/leave-request.component';
import { PayslipComponent } from './components/payslip.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'leave-request', component: LeaveRequestComponent },
  { path: 'payslip', component: PayslipComponent }
];
