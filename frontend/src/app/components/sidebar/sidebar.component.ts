import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [RouterModule]
})
export class SidebarComponent {
  isCollapsed = false;

  @Output() sidebarToggled = new EventEmitter<boolean>();

  constructor(private router: Router) {}

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.sidebarToggled.emit(this.isCollapsed);
  }

  logout() {
    // Implement logout logic here
    this.router.navigate(['/login']);
  }
}
