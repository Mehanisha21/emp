import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
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
      this.router.navigate(['/login']);
    }
  }

  isRouteActive(route: string): boolean {
    return this.router.url === route;
  }
}
