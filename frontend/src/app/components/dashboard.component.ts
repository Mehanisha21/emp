import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="dashboard-container">
      <nav class="sidebar" [class.collapsed]="isCollapsed">
        <div class="sidebar-header">
          <button class="toggle-btn" (click)="toggleSidebar()" aria-label="Toggle sidebar" title="Toggle sidebar">
            <span *ngIf="isCollapsed" class="close-cursor">&#9776;</span>
            <span *ngIf="!isCollapsed">&#10005;</span> <!-- Close icon when expanded -->
          </button>
          <h2 *ngIf="!isCollapsed" class="portal-title">EMPLOYEE PORTAL</h2>
        </div>
        <ul>
          <li (click)="goToProfile()" [class.active]="isRouteActive('/profile')">
            <span class="icon"><i class="fas fa-user"></i></span>
            <span class="text" *ngIf="!isCollapsed">Employee Profile</span>
          </li>
          <li (click)="goToLeaveRequest()" [class.active]="isRouteActive('/leave-request')">
            <span class="icon"><i class="fas fa-calendar-check"></i></span>
            <span class="text" *ngIf="!isCollapsed">Leave Management</span>
          </li>
          <li (click)="goToPaySlip()" [class.active]="isRouteActive('/payslip')">
            <span class="icon"><i class="fas fa-file-invoice-dollar"></i></span>
            <span class="text" *ngIf="!isCollapsed">Payslip</span>
          </li>
          <!-- Logout menu item -->
          <li (click)="logout()" class="logout-item">
            <span class="icon"><i class="fas fa-sign-out-alt"></i></span>
            <span class="text" *ngIf="!isCollapsed">Logout</span>
          </li>
        </ul>
      </nav>
      <main class="main-content" [class.expanded]="isCollapsed" (click)="closeSidebar()">
        <header class="topbar">
          <h1>Dashboard</h1>
        </header>
        <div *ngIf="showCards" class="cards-container">
          <div class="card profile-card" (click)="goToProfile()">
            <div class="profile-background"></div>
            <h3>Profile View</h3>
          </div>
          <div class="card leave-card" (click)="goToLeaveRequest()">
            <div class="leave-background"></div>
            <h3>Leave Data</h3>
          </div>
          <div class="card payslip-card" (click)="goToPaySlip()">
            <div class="payslip-background"></div>
            <h3>Payslip</h3>
          </div>
        </div>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      height: 100vh;
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f3f2f1;
      margin-top: 0;
      padding-top: 0;
    }
    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      width: 220px;
      background-color: #4b5563;
      color: white;
      display: flex;
      flex-direction: column;
      padding: 1rem 0;
      box-shadow: 2px 0 5px rgba(0,0,0,0.1);
      transition: width 0.3s ease;
      overflow: hidden;
      z-index: 1000;
    }
    .sidebar.collapsed {
      width: 60px;
    }
    .sidebar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      font-size: 1.5rem;
      font-weight: 600;
      border-bottom: 1px solid rgba(255,255,255,0.3);
      margin-bottom: 1rem;
    }
    .toggle-btn {
      background: none;
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0;
      line-height: 1;
    }
    .sidebar ul {
      list-style: none;
      padding: 0;
      margin: 0;
      flex-grow: 1;
    }
    .sidebar li {
      display: flex;
      align-items: center;
      padding: 1rem 1.5rem;
      cursor: pointer;
      transition: background-color 0.3s ease;
      font-weight: 500;
      font-size: 1rem;
      white-space: nowrap;
    }
    .sidebar li.active, .sidebar li:hover {
      background-color: #374151;
    }
    .sidebar li:hover .icon {
      color: #fbbf24; /* yellow color on hover for all icons */
    }
    .sidebar li .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 0.75rem;
      font-size: 1.25rem;
      min-width: 24px;
      text-align: center;
      color: white; /* default icon color white */
    }
    .sidebar.collapsed li .text {
      display: none;
    }

    /* Style specifically for the logout item */
    .logout-item {
      margin-top: auto;
      border-top: 1px solid rgba(255,255,255,0.25);
      color: white; /* changed from yellow to white */
    }
    .logout-item:hover {
      background-color: #a16207; /* darker golden on hover */
      color: #fbbf24; /* changed from white to yellow */
    }

    .main-content {
      margin-left: 220px;
      flex-grow: 1;
      padding: 1.5rem 2rem;
      background-color: #e0e7ff;
      color: #1f2937;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      transition: margin-left 0.3s ease;
      margin-top: 0;
      padding-top: 0;
    }
    .main-content.expanded {
      margin-left: 60px;
    }
    .topbar {
      border-bottom: 1px solid #e1dfdd;
      padding-bottom: 1rem;
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
      font-weight: 600;
      color: #323130;
      margin-top: 0;
      padding-top: 0;
    }
    .cards-container {
      display: flex;
      gap: 2rem;
      justify-content: flex-start;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }
    .card {
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.07);
      cursor: pointer;
      flex: 1 1 250px;
      max-width: 280px;
      min-width: 240px;
      text-align: center;
      transition: box-shadow 0.3s ease, transform 0.3s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      background: white;
      color: #1f2937;
    }
    .card:hover {
      box-shadow: 0 10px 24px rgba(30, 115, 250, 0.3);
      transform: translateY(-8px);
    }
    /* PROFILE CARD */
    .profile-card {
      position: relative;
      overflow: hidden;
      background: none;
      border: 1px solid #fbbf24;
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      height: 250px;
      max-width: 250px;
      padding-bottom: 1.5rem;
      cursor: pointer;
    }
    .profile-card .profile-background {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: url('assets/images/profile.jpg') center center/cover no-repeat;
      width: 100%;
      height: 100%;
      z-index: 1;
      opacity: 0.95;
      filter: brightness(0.85) saturate(110%) blur(0.5px);
      transition: filter 0.3s ease;
    }
    .profile-card:hover .profile-background {
      filter: brightness(1) saturate(130%) blur(0.3px);
    }
    .profile-card h3 {
      position: relative;
      z-index: 2;
      margin: 0;
      padding: 0.7rem 1.1rem;
      background: rgba(30, 40, 60, 0.5);
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(32, 34, 40, 0.35);
      font-weight: 700;
      text-shadow: 0 1px 10px rgba(0, 0, 0, 0.6);
      user-select: none;
      pointer-events: none;
    }
    /* LEAVE CARD */
    .leave-card {
      position: relative;
      overflow: hidden;
      color: #fff;
      border: 2px solid #3b82f6;
      background: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      height: 250px;
      max-width: 280px;
      padding-bottom: 1.4rem;
      cursor: pointer;
    }
    .leave-card .leave-background {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      width: 100%;
      height: 100%;
      background: url('assets/images/leave.jpg') center center/cover no-repeat;
      opacity: 0.92;
      filter: brightness(0.90) saturate(118%) blur(0.7px);
      z-index: 1;
      transition: filter 0.3s;
    }
    .leave-card:hover .leave-background {
      filter: brightness(1.04) saturate(130%) blur(0.4px);
    }
    .leave-card h3 {
      position: relative;
      z-index: 2;
      background: rgba(30, 40, 60, 0.52);
      border-radius: 8px;
      padding: 1rem 1.1rem;
      font-weight: 700;
      text-shadow: 0 1px 8px rgba(0,0,0,0.5);
      color: #fff;
      margin: 0 0 1.4rem 0;
      box-shadow: 0 2px 8px rgba(60,100,255,0.15);
      user-select: none;
      pointer-events: none;
    }
    /* PAYSLIP CARD */
    .payslip-card {
      position: relative;
      overflow: hidden;
      border: 2px solid #10b981;
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      height: 250px;
      max-width: 280px;
      padding-bottom: 1.4rem;
      cursor: pointer;
      background: none;
    }
    .payslip-card .payslip-background {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      width: 100%;
      height: 100%;
      background: url('assets/images/pay.jpg') center center/cover no-repeat;
      opacity: 0.93;
      filter: brightness(0.87) saturate(124%) blur(0.65px);
      z-index: 1;
      transition: filter 0.3s;
    }
    .payslip-card:hover .payslip-background {
      filter: brightness(1.06) saturate(137%) blur(0.3px);
    }
    .payslip-card h3 {
      position: relative;
      z-index: 2;
      background: rgba(30, 40, 60, 0.52);
      border-radius: 8px;
      padding: 1rem 1.1rem;
      font-weight: 700;
      text-shadow: 0 1px 8px rgba(0,0,0,0.5);
      color: #fff;
      margin: 0 0 1.4rem 0;
      box-shadow: 0 2px 8px rgba(60,100,255,0.15);
      user-select: none;
      pointer-events: none;
    }
    @media (max-width: 768px) {
      .cards-container {
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
      }
      .card {
        max-width: 90vw;
        min-width: auto;
      }
      .main-content {
        margin-left: 0 !important;
        padding: 1rem;
      }
      .sidebar {
        position: relative;
        width: 100%;
        height: auto;
      }
    }
  `]
})
export class DashboardComponent {
  showCards = true;
  isCollapsed = true;

  constructor(private router: Router) {}

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
  closeSidebar() {
    this.isCollapsed = true;
  }
  goToProfile() {
    this.showCards = false;
    this.router.navigate(['/profile']);
  }
  goToLeaveRequest() {
    this.showCards = false;
    this.router.navigate(['/leave-request']);
  }
  goToPaySlip() {
    this.showCards = false;
    this.router.navigate(['/payslip']);
  }

  // Logout handler with confirmation
  logout() {
    const confirmed = window.confirm('Are you sure you want to log out?');
    if (confirmed) {
      // Navigate to login page, adjust path as needed for your app
      this.router.navigate(['/login']);
    }
  }

  isRouteActive(route: string): boolean {
    return this.router.url === route;
  }
}
