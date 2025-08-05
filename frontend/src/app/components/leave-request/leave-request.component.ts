import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

interface LeaveRow {
  personnel: string;
  type: string;
  start: string;
  end: string;
  days: number;
  balance: number;
  desc: string;
}

@Component({
  selector: 'app-leave-request',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.css']
})

export class LeaveRequestComponent implements OnInit {
  leaves: LeaveRow[] = [];
  searchTerm = '';
  errorMessage = '';

  private apiUrl = 'http://localhost:3000/api/leaves';

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {

    const persno = this.authService.getPersno();
    if (!persno) {
      this.errorMessage = 'No logged in user found.';
      return;
    }

    this.http.get<any>(`${this.apiUrl}?pernr=${persno}`).subscribe({
      next: (data) => this.leaves = data,
      error: (err) => {
        console.error(err);
        this.errorMessage = err.error?.message || 'No logged in user found.';
      }
    });
  }

  filteredLeaves(): LeaveRow[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.leaves;

    return this.leaves.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(term)
      )
    );
  }
}
