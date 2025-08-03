import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  standalone: true,
  imports: [RouterModule, RouterOutlet]
})
export class LayoutComponent {
  isCollapsed = false;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event.constructor.name === "NavigationEnd") {
        const currentUrl = (event as any).urlAfterRedirects;
        if (currentUrl === '/dashboard') {
          this.isCollapsed = true;
        } else {
          this.isCollapsed = false;
        }
      }
    });
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  closeSidebar() {
    if (this.isCollapsed) {
      this.isCollapsed = false;
    }
  }

  logout() {
    // Implement logout logic here
    this.router.navigate(['/login']);
  }
}
