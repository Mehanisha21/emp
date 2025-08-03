import { Component, EventEmitter, Output, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule]
})
export class SidebarComponent {
  isCollapsed = true;
  @Output() sidebarToggled = new EventEmitter<boolean>();

  private collapseTimeout: any;
  isMobile = false;

  constructor(private router: Router) {
    this.checkMobileView();
  }

  // Check screen size on load
  private checkMobileView() {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) {
      this.isCollapsed = true;
    }
  }

  // Update on screen resize
  @HostListener('window:resize', [])
  onResize() {
    this.checkMobileView();
  }

  // Auto-expand on hover
  onMouseEnter() {
    if (!this.isMobile) {
      clearTimeout(this.collapseTimeout);
      this.isCollapsed = false;
      this.sidebarToggled.emit(this.isCollapsed);
    }
  }

  // Delayed collapse on mouse leave
  onMouseLeave() {
    if (!this.isMobile) {
      this.collapseTimeout = setTimeout(() => {
        this.isCollapsed = true;
        this.sidebarToggled.emit(this.isCollapsed);
      }, 300); // 300ms delay
    }
  }

  // Logout handler
  logout() {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (confirmed) {
      // Add logout logic (e.g., clear sessionStorage/localStorage)
      this.router.navigate(['/login']);
    }
  }
}
