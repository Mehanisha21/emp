import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-payslip',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="wide-payslip-bg">
      <ng-container *ngIf="payslipRecords && payslipRecords.length; else loadingOrError">
        <div class="wide-payslip-card" *ngFor="let record of payslipRecords">
          <div class="wide-payslip-header">
            <svg class="wide-payslip-icon" viewBox="0 0 46 46">
              <ellipse cx="23" cy="23" rx="22" ry="22" fill="#ecf7f9"/>
              <rect x="10" y="19" width="26" height="10" rx="5" fill="#399ddf"/>
              <rect x="15" y="13" width="16" height="6" rx="3" fill="#f3fafc"/>
            </svg>
            <div>
              <div class="wide-payslip-title">Employee Payslip</div>
              <div class="wide-payslip-date">{{ record.Begda | date:'MMMM y' }}</div>
            </div>
            <button (click)="exportPDF(record)" class="export-btn">Export PDF</button>
            <button (click)="viewPDF(record)" class="print-btn" title="View PDF for Print">
              Print
            </button>
            <button (click)="openEmailModal(record)" class="email-btn" [disabled]="emailSending">Send Email</button>
          </div>
          <div class="wide-payslip-details">
            <div class="wide-field">
              <span class="field-label">Personnel Number:</span>
              <span class="field-value">{{ record.Pernr }}</span>
            </div>
            <div class="wide-field">
              <span class="field-label">Company Code:</span>
              <span class="field-value">{{ record.Bukrs }}</span>
            </div>
            <div class="wide-field">
              <span class="field-label">Cost Center:</span>
              <span class="field-value">{{ record.Kostl }}</span>
            </div>
            <div class="wide-field">
              <span class="field-label">First Name:</span>
              <span class="field-value">{{ record.Vorna }}</span>
            </div>
            <div class="wide-field">
              <span class="field-label">Gender:</span>
              <span class="field-value">{{ record.Gesch }}</span>
            </div>
            <div class="wide-field">
              <span class="field-label">Birth Date:</span>
              <span class="field-value">{{ record.Gbdat | date:'mediumDate' }}</span>
            </div>
            <div class="wide-field">
              <span class="field-label">Nationality:</span>
              <span class="field-value">{{ record.Natio }}</span>
            </div>
            <div class="wide-field">
              <span class="field-label">Transfer Group:</span>
              <span class="field-value">{{ record.Trfgr }}</span>
            </div>
            <div class="wide-field">
              <span class="field-label">Transfer Status:</span>
              <span class="field-value">{{ record.Trfst }}</span>
            </div>
            <div class="wide-field">
              <span class="field-label">Base pay:</span>
              <span class="field-value">{{ record.Bet02 | number:'1.2-2' }}</span>
            </div>
            <div class="wide-field">
              <span class="field-label">Incentives:</span>
              <span class="field-value">{{ record.Betrg | number:'1.2-2' }}</span>
            </div>
            <div class="wide-field">
              <span class="field-label">Allowance:</span>
              <span class="field-value">{{ record.Bet01 | number:'1.2-2' }}</span>
            </div>
            <div class="wide-field total-row">
              <span class="field-label">Total Amount:</span>
              <span class="field-value total-value">
                {{ record.Total | number:'1.2-2' }} {{ record.Waers }}
              </span>
            </div>
            <div class="wide-field">
              <span class="field-label">Division:</span>
              <span class="field-value">{{ record.Divgv }}</span>
            </div>
          </div>
        </div>
      </ng-container>

      <ng-template #loadingOrError>
        <div class="wide-payslip-card" style="text-align:center">
          <div *ngIf="errorMessage; else loading" class="error">{{ errorMessage }}</div>
          <ng-template #loading>
            <div class="loading-payslip">Loading pay slips...</div>
          </ng-template>
        </div>
      </ng-template>
    </div>

    <div *ngIf="emailPromptVisible" class="popup-backdrop">
      <div class="email-popup">
        <p>Enter an email address to send the payslip:</p>
        <input type="email" [(ngModel)]="emailInput" placeholder="Enter email address" />
        <div class="button-row">
          <button (click)="sendPayslipEmail()" class="send-btn" [disabled]="!emailInput || emailSending">
            {{ emailSending ? 'Sending...' : 'Send' }}
          </button>
          <button (click)="closeEmailModal()" class="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
    
    <div *ngIf="emailSuccessPopupVisible" class="popup-backdrop">
      <div class="popup">
        <p>📧 Payslip has been sent to your email.</p>
        <button (click)="closeEmailSuccessPopup()">OK</button>
      </div>
    </div>

    <div *ngIf="emailErrorPopupVisible" class="popup-backdrop">
      <div class="popup">
        <p>⚠️ Failed to send payslip email.</p>
        <button (click)="closeEmailErrorPopup()">OK</button>
      </div>
    </div>
  `,
  styles: [`
    .wide-payslip-bg {
      min-height: 100vh;
      background: linear-gradient(120deg,#e0f7fa 60%,#d3cce3 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2.9rem 0;
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    }
    .wide-payslip-card {
      background: rgba(255,255,255,0.97);
      border-radius: 17px;
      box-shadow: 0 8px 44px #205b9c14, 0 2px 12px #397ac70a;
      backdrop-filter: blur(10px) saturate(117%);
      padding: 2.15rem 3.3rem 1.7rem 3.3rem;
      max-width: 650px;
      width: 100%;
      margin-bottom: 2.5rem;
      border: 1.4px solid #182f4455;
      animation: fadeIn .8s cubic-bezier(.55,1.85,.23,.98);
      position: relative;
    }
    .wide-payslip-header {
      display: flex;
      align-items: flex-start;
      gap: 1.4rem;
      margin-bottom: 2.0rem;
      border-bottom: 1.7px solid #e1eafd;
      padding-bottom: 1.09rem;
    }
    .wide-payslip-icon {
      min-width: 53px;
      width: 53px;
      height: 53px;
    }
    .wide-payslip-title {
      font-size: 1.82rem;
      font-weight: 700;
      color: #215083;
      margin-bottom: 0.21em;
      letter-spacing: .03em;
    }
    .wide-payslip-date {
      font-size: 1.1rem;
      color: #4478bd;
      font-weight: 500;
      margin-top: .03em;
      margin-bottom: .15em;
      text-shadow: 0 1px 6px #e3f5ff41;
    }
    .export-btn, .print-btn, .email-btn {
      margin-left: 1em;
      margin-top: .5em;
      background: linear-gradient(99deg, #257cc8 70%, #5bded9 140%);
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: .7em 1.7em;
      font-size: 1em;
      font-weight: 700;
      box-shadow: 0 2px 8px #60c8ff24;
      cursor: pointer;
      transition: background 0.14s, box-shadow 0.14s;
      height: 2.7em;
      min-width: 7em;
      z-index: 2;
    }
    .print-btn {
      background: linear-gradient(90deg, #1bbb7a 60%, #21d6b6 140%);
    }
    .email-btn {
      background: linear-gradient(90deg, #7c4dff 60%, #c362ff 140%);
    }
    .export-btn:disabled, .print-btn:disabled, .email-btn:disabled {
      background: #c3e0f3;
      color: #ecf8ff;
      cursor: not-allowed;
      opacity: .64;
      box-shadow: none;
    }
    .wide-payslip-details {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.25rem 1.35rem;
      margin-top: 1.2rem;
      font-size: 1.19rem;
    }
    .wide-field {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: .29em .04em .31em 0;
      border-bottom: 1px dashed #b1cce528;
      color: #194050;
      border-radius: 3px;
      background: transparent;
    }
    .wide-field.total-row {
      grid-column: span 2;
      font-size: 1.3rem;
      background: linear-gradient(90deg,#e5f8ee 60%,#e9f5ed 100%);
      font-weight: 800;
      border-radius: 8px;
      margin: 1.11em 0 0.44em 0;
      padding: .76em .35em;
      color: #13595f;
      border-bottom: none;
    }
    .field-label {
      color: #1372ba;
      font-weight: 600;
      letter-spacing: 0.01em;
      text-align: left;
      min-width: 42%;
      opacity: 0.97;
    }
    .field-value {
      color: #223154;
      text-align: right;
      font-weight: 600;
      font-size: 1.14em;
      opacity: 0.97;
      max-width: 53%;
      word-break: break-word;
      padding-left: .6em;
    }
    .total-value {
      color: #16a876;
      font-weight: 800;
      letter-spacing: 0.03em;
      text-shadow: 0 1px 0 #f3ffe8;
      font-size: 1.15em;
    }
    .error {
      color: #e01844;
      text-align: center;
      font-size: 1.16rem;
      font-weight: 700;
      padding: 2em 0;
    }
    .loading-payslip {
      font-size: 1.09rem;
      color: #155fa0;
      text-align: center;
      padding: 2rem 0;
      font-style: italic;
    }
    /* Styles for custom popup */
    .popup-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .popup {
      background: #fff;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
      text-align: center;
      max-width: 400px;
      width: 90%;
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    }
    .popup p {
      font-size: 1.2rem;
      margin-bottom: 1.5rem;
      color: #333;
    }
    .popup button {
      background: #399ddf;
      color: #fff;
      border: none;
      padding: 0.8rem 1.8rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: bold;
      transition: background 0.2s;
    }
    .popup button:hover {
      background: #2b7bb8;
    }
    .email-popup {
      background: #fff;
      padding: 2.5rem;
      border-radius: 12px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
      text-align: center;
      max-width: 450px;
      width: 90%;
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    }
    .email-popup p {
      font-size: 1.2rem;
      margin-bottom: 1.2rem;
      color: #333;
    }
    .email-popup input {
      width: calc(100% - 2rem);
      padding: 0.8rem 1rem;
      font-size: 1rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      box-shadow: inset 0 1px 3px rgba(0,0,0,0.06);
    }
    .email-popup input:focus {
      outline: none;
      border-color: #399ddf;
      box-shadow: 0 0 0 2px rgba(57, 157, 223, 0.2);
    }
    .email-popup .button-row {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }
    .email-popup .send-btn {
      background: linear-gradient(90deg, #7c4dff 60%, #c362ff 140%);
      color: #fff;
      border: none;
      padding: 0.8rem 1.8rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: bold;
      transition: background 0.2s;
    }
    .email-popup .send-btn:hover {
      background: linear-gradient(90deg, #6438e0 60%, #a448d3 140%);
    }
    .email-popup .send-btn:disabled {
      background: #e0e0e0;
      color: #999;
      cursor: not-allowed;
    }
    .email-popup .cancel-btn {
      background: #e0e0e0;
      color: #666;
      border: none;
      padding: 0.8rem 1.8rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: bold;
      transition: background 0.2s;
    }
    .email-popup .cancel-btn:hover {
      background: #ccc;
    }
    @media (max-width: 900px) {
      .wide-payslip-card {
        padding: 1rem .42rem .9rem 0.72rem;
        max-width: 99vw;
      }
      .wide-payslip-header { gap: .57rem; padding-bottom: .89rem;}
      .wide-payslip-title { font-size: 1.31rem; }
      .wide-payslip-details { grid-template-columns: 1fr; font-size: 1.04rem; }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(55px);}
      to { opacity: 1; transform: none;}
    }
  `]
})
export class PayslipComponent implements OnInit {
  payslipRecords: any[] | null = null;
  errorMessage = '';

  private payslipUrl = 'http://localhost:3000/api/payslip';
  private pdfUrl = 'http://localhost:3000/api/payslip-pdf';
  private emailUrl = 'http://localhost:3000/api/payslip-pdf'; // New endpoint for email

  // New properties for email functionality
  emailPromptVisible: boolean = false;
  emailInput: string = '';
  selectedRecordForEmail: any = null;
  emailSending: boolean = false;
  emailSuccessPopupVisible: boolean = false;
  emailErrorPopupVisible: boolean = false;


  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    const persno = this.authService.getPersno();
    if (!persno) {
      this.errorMessage = 'No logged in user found.';
      return;
    }
    this.http
      .get<any>(`${this.payslipUrl}?pernr=${persno}`)
      .subscribe({
        next: (response) => {
          if (response && response.success) {
            this.payslipRecords = response.payslipRecords;
          } else {
            this.errorMessage =
              response.message || 'Failed to load pay slips.';
          }
        },
        error: (err) => {
          this.errorMessage =
            err.error?.message || 'Server error while loading pay slips.';
        }
      });
  }

  exportPDF(record: any) {
    if (!record) {
      // Replaced alert with a message box or custom popup for better UX
      // For this example, we will just return.
      return;
    }
    const pernr = record.Pernr;
    const url = `${this.pdfUrl}?pernr=${pernr}`;
    this.http
      .get(url, { responseType: 'blob' })
      .subscribe({
        next: (blob) => {
          const a = document.createElement('a');
          const objectUrl = URL.createObjectURL(blob);
          a.href = objectUrl;
          a.download = `payslip_${pernr}.pdf`;
          a.click();
          URL.revokeObjectURL(objectUrl);
        },
        error: (err) => {
          // Replaced alert with a message box or custom popup for better UX
          console.error('PDF download error:', err);
        }
      });
  }

  viewPDF(record: any) {
    if (!record) {
      // Replaced alert with a message box or custom popup for better UX
      // For this example, we will just return.
      return;
    }
    const pernr = record.Pernr;
    const url = `${this.pdfUrl}?pernr=${pernr}`;
    this.http
      .get(url, { responseType: 'blob' })
      .subscribe({
        next: (blob) => {
          const objectUrl = URL.createObjectURL(blob);
          window.open(objectUrl, '_blank'); // Open PDF inline in new tab
          setTimeout(() => URL.revokeObjectURL(objectUrl), 30000); // Cleanup
        },
        error: (err) => {
          // Replaced alert with a message box or custom popup for better UX
          console.error('PDF load error:', err);
        }
      });
  }

  // New method to open the email modal
  openEmailModal(record: any) {
    this.selectedRecordForEmail = record;
    this.emailPromptVisible = true;
    this.emailInput = ''; // Clear previous input
  }

  // New method to send the email
  sendPayslipEmail() {
    if (!this.selectedRecordForEmail || !this.emailInput.trim()) {
      // Display a custom error modal
      return;
    }

    this.emailSending = true;
    const pernr = this.selectedRecordForEmail.Pernr;

console.log('Sending payslip email with:', { pernr, email: this.emailInput.trim() });
this.http.post(this.emailUrl, { pernr: pernr, email: this.emailInput.trim() }, { responseType: 'json' }).subscribe({
  next: (response: any) => {
    this.emailSending = false;
    this.closeEmailModal();
    if (response?.message?.includes('emailed')) {
      this.emailSuccessPopupVisible = true;
    } else {
      this.emailErrorPopupVisible = true;
    }
  },
  error: (error) => {
    this.emailSending = false;
    this.closeEmailModal();
    this.emailErrorPopupVisible = true;
    console.error('Payslip email error:', error);
  }
});
  }

  closeEmailModal(): void {
    this.emailPromptVisible = false;
    this.selectedRecordForEmail = null;
    this.emailInput = '';
  }
  
  closeEmailSuccessPopup(): void {
    this.emailSuccessPopupVisible = false;
  }
  
  closeEmailErrorPopup(): void {
    this.emailErrorPopupVisible = false;
  }
}
