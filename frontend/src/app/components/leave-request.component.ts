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
  selector: 'app-leave-request',  // changed selector name to match file/component
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="leave-data-wrapper">
      <div class="leave-details-card">
        <div class="leave-header-row">
          <svg class="leave-icon" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="20" fill="#c7f0fe"/>
            <path d="M15 18h10M15 22h8" stroke="#2563eb" stroke-width="2" stroke-linecap="round"/>
            <rect x="10" y="13" width="20" height="14" rx="3" stroke="#2563eb" stroke-width="2" fill="#e0f2fe"/>
          </svg>
          <span class="leave-title">Employee Leave Details</span>
        </div>
        <div class="leave-searchbar">
          <input
            type="text"
            [(ngModel)]="searchTerm"
            class="leave-search-input"
            placeholder="Search leave type" />
          <svg class="search-icon" viewBox="0 0 20 20">
            <circle cx="9" cy="9" r="7" stroke="#2563eb" stroke-width="2" fill="none"/>
            <path d="M13.5 13.5L18 18" stroke="#2563eb" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="table-container">
          <table class="leave-table">
            <thead>
              <tr>
                <th>Personnel #</th>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Days</th>
                <th>Balance</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of filteredLeaves()">
                <td>{{row.personnel}}</td>
                <td>{{row.type}}</td>
                <td>{{row.start}}</td>
                <td>{{row.end}}</td>
                <td>{{row.days}}</td>
                <td>
                  <span [ngClass]="{'balance-neg': row.balance < 0, 'balance-pos': row.balance >= 0}">
                    {{row.balance}}
                  </span>
                </td>
                <td>{{row.desc}}</td>
              </tr>
              <tr *ngIf="filteredLeaves().length === 0">
                <td colspan="7" class="no-record-text">No records found for "{{searchTerm}}"</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .leave-data-wrapper {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      background-color: #555555; /* updated background color */
      padding: 3rem 0 4rem 0;
    }
    .leave-details-card {
      width: 100%;
      max-width: 900px;
      background: #002B59; /* updated card color */
      border-radius: 20px;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
      backdrop-filter: none;
      -webkit-backdrop-filter: none;
      padding: 2.5rem 2.5rem 2.5rem 2.5rem;
      margin: 2rem auto;
      border: 1.5px solid brown;
      position: relative;
    }
    .leave-header-row {
      display: flex;
      align-items: center;
      gap: 1.2rem;
      margin-bottom: 1.3rem;
    }
    .leave-icon {
      width: 48px; height: 48px; flex-shrink: 0;
      filter: drop-shadow(0 2px 8px #1672b599);
      background: #fff;
      border-radius: 50%;
      padding: 3px;
    }
    .leave-title {
      font-size: 2.2rem;
      font-weight: 900;
      color: black; /* updated text color */
      letter-spacing: 0.7px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      text-shadow: none;
    }
    .leave-searchbar {
      display: flex; align-items: center; gap: 0.5rem;
      margin-bottom: 1.6rem;
      background: #87CEEB; /* updated search bar background */
      padding: 0.5rem 1.2rem;
      border-radius: 12px;
      box-shadow: none;
    }
    .leave-search-input {
      flex: 1 1 0; padding: 0.6rem; border-radius: 8px; border: none;
      font-size: 1.1em;
      background: #87CEEB; /* updated search input background */
      color: white; /* updated search input text color */
      transition: box-shadow 0.2s ease;
      outline: none;
    }
    .leave-search-input:focus {
      background: #87CEEB;
      box-shadow: none;
    }
    .search-icon {
      width: 1.2em; height: 1.2em; flex-shrink: 0;
      opacity: 0.85;
      stroke: white; /* updated search icon stroke */
    }
    .table-container {
      border-radius: 14px;
      background: #87CEEB; /* updated table container background */
      padding: 1rem;
      box-shadow: none;
      overflow-x: auto;
      margin-top: 0.5em;
    }
    .leave-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      font-size: 1.11rem;
      background: transparent;
    }
    .leave-table th,
    .leave-table td {
      padding: 0.85rem 1.09rem;
      text-align: center;
      border-bottom: 1.2px solid #87CEEB;
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    }
    .leave-table thead th {
      background: #87CEEB;
      font-size: 1.01rem;
      color: black;
      font-weight: 700;
      border-radius: 0;
      letter-spacing: 0.03em;
      border-bottom: 2px solid #666666;
    }
    .leave-table tbody tr:last-child td {
      border-bottom: none;
    }
    .leave-table tbody tr {
      transition: background 0.17s;
    }
    .leave-table tbody tr:hover {
      background: #666666;
    }
    .leave-table td {
      color: white;
      font-weight: 500;
    }
    .leave-table td:last-child {
      text-align: left;
      color: #cccccc;
      font-weight: 500;
      max-width: 220px;
    }
    .balance-neg {
      color: #ff3166 !important;
      background: #fdebebd0;
      border-radius: 5px;
      padding: 0.18rem 0.9em;
      font-weight: 700;
    }
    .balance-pos {
      color: #16a876 !important;
      background: #dbfaf0d0;
      border-radius: 5px;
      padding: 0.18rem 0.9em;
      font-weight: 700;
    }
    .no-record-text {
      text-align: center;
      color: #d10d42;
      font-style: italic;
      font-size: 1em;
    }
    @media (max-width: 700px) {
      .leave-details-card {
        padding: 1.2rem 0.4rem;
        min-width: 0;
      }
      .leave-title {
        font-size: 1.16rem;
        text-align: left;
      }
      .leave-header-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.7rem;
      }
      .leave-table th,
      .leave-table td {
        padding: 0.48rem 0.34rem;
      }
      .table-container {
        padding: 0.2rem;
      }
    }
  `]
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
