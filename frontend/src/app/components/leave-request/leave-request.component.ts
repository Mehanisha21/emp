import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
export class LeaveRequestComponent {
  leaves: LeaveRow[] = [
    { personnel: '00000001', type: '0300', start: 'Mar 11, 2025', end: 'Mar 14, 2025', days: 5.0, balance: 1.0, desc: 'Paid Leave of Abs.' },
    { personnel: '00000001', type: '0720', start: 'Apr 14, 2025', end: 'Apr 15, 2025', days: 1.0, balance: -1.0, desc: 'Unpaid leave EE/ER' }
  ];
  searchTerm = '';

  filteredLeaves(): LeaveRow[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.leaves;

    const terms = term.split(' ');

    if (
      terms.some(word => word === 'unpaid') &&
      !terms.some(word => word === 'paid')
    ) {
      // Only unpaid
      return this.leaves.filter(row => row.desc.toLowerCase().includes('unpaid'));
    }
    if (
      terms.some(word => word === 'paid') &&
      !terms.some(word => word === 'unpaid')
    ) {
      // Only paid, and not unpaid!
      return this.leaves.filter(
        row =>
          row.desc.toLowerCase().includes('paid') &&
          !row.desc.toLowerCase().includes('unpaid')
      );
    }
    // General match for any search terms
    return this.leaves.filter(row =>
      terms.some(t => row.desc.toLowerCase().includes(t))
    );
  }
}
