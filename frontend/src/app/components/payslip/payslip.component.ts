import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-payslip',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payslip.component.html',
  styleUrls: ['./payslip.component.css']
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
