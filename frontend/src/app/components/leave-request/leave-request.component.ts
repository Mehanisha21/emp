import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

interface LeaveRow {
  Pernr: string;
  Awart: string;
  Begda: string;
  Endda: string;
  Abwtg: string;
  Aedtm: string;
  Uname: string;
  Beguz: string;
  Enduz: string;
  Atext: string;
  Ktart: string;
  Anzhl: string;
  Balance: string;
}

interface LeaveResponse {
  success: boolean;
  leaveRecords: LeaveRow[];
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

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const persno: string | null = this.authService.getPersno();

    if (!persno || !persno.trim()) {
      this.errorMessage = 'No logged in user found.';
      return;
    }

    this.http.get<LeaveResponse>(`${this.apiUrl}?pernr=${persno}`).subscribe({
      next: (response) => {
        if (response.success && response.leaveRecords) {
          this.leaves = response.leaveRecords;
        } else {
          this.errorMessage = 'No leave records found.';
        }
      },
      error: (err) => {
        console.error('Error fetching leaves:', err);
        this.errorMessage = err.error?.message || 'Failed to load leave data.';
      }
    });
  }

  filteredLeaves(): LeaveRow[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.leaves;

    return this.leaves.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(term)
      )
    );
  }
}
