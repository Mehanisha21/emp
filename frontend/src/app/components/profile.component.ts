import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-card-main" *ngIf="profile; else loadingOrError">
      <div class="profile-img-bg">
        <svg class="profile-svg" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="32" fill="#314361"/>
          <ellipse cx="32" cy="26" rx="12" ry="13" fill="#b6bac1"/>
          <ellipse cx="32" cy="47" rx="19" ry="11" fill="#b6bac1"/>
        </svg>
      </div>
      <h2 class="profile-name">{{ profile.Vorna }} {{ profile.Nachn }}</h2>
      <div class="profile-title">{{ profile.Locat }}</div>
      <div class="profile-details">
        <div class="profile-detail-row" *ngFor="let field of profileFields">
          <span class="profile-line">
            {{ field.label }} : {{ profile[field.key] }}
          </span>
        </div>
      </div>
    </div>
    <ng-template #loadingOrError>
      <div *ngIf="errorMessage; else loading">
        <p class="error">{{ errorMessage }}</p>
      </div>
      <ng-template #loading>
        <p>Loading profile...</p>
      </ng-template>
    </ng-template>
  `,
  styles: [`
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      height: 100vh;
      width: 100vw;
      background: #1d2333;
      box-sizing: border-box;
    }
    .profile-card-main {
      width: 370px;
      margin: 0;
      background:
        linear-gradient(135deg, #314361 60%, #2b3862 100%) padding-box,
        linear-gradient(120deg, rgba(255,255,255,0.16) 0%, rgba(185, 217, 255, 0.08) 100%) border-box,
        linear-gradient(90deg, rgba(44,62,98,0.07) 60%, rgba(255,255,255,0.02) 100%) border-box;
      border-radius: 18px;
      box-shadow: 0 8px 32px 0 rgba(31,38,135,0.23), 0 1.5px 10px 0 rgba(119,160,255,0.23);
      color: #f6e9ce;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2.2rem 1.5rem 1.5rem 1.5rem;
      position: relative;
      text-align: center;
      animation: fadeIn 0.8s;
      backdrop-filter: blur(5px) saturate(145%);
      -webkit-backdrop-filter: blur(5px) saturate(145%);
      border: 2px solid rgba(206, 225, 255, 0.14);
    }
    .profile-card-main::after {
      content: '';
      position: absolute;
      top: 22px; left: 14px;
      width: 120px;
      height: 120px;
      background: radial-gradient(circle, rgba(185,217,255,0.20) 0%, rgba(44,62,98,0.0) 90%);
      filter: blur(8px);
      border-radius: 60px;
      z-index: 0;
      pointer-events: none;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(50px); }
      to { opacity: 1; transform: none; }
    }
    .profile-img-bg {
      width: 94px;
      height: 94px;
      border-radius: 50%;
      background: #314361;
      overflow: hidden;
      margin-top: -74px;
      margin-bottom: 17px;
      box-shadow: 0 0 24px #495fa093;
      border: 5px solid #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
    }
    .profile-svg {
      width: 100%;
      height: 100%;
      display: block;
    }
    .profile-name {
      font-size: 1.6rem;
      font-weight: bold;
      color: #fbedc7;
      margin-bottom: 0.22rem;
      text-align: center;
    }
    .profile-title {
      color: #9fb8ea;
      font-size: 1.07rem;
      margin-bottom: 1rem;
      text-align: center;
    }
    .profile-details {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 1.2rem;
      z-index: 1;
    }
    .profile-detail-row {
      width: auto;
      display: flex;
      justify-content: center;
      margin-bottom: 0.18rem;
    }
    .profile-line {
      display: block;
      color: #fffbea;
      background: rgba(60,66,120,0.12);
      border-radius: 5px;
      padding: 0.10rem 0.6rem;
      font-weight: 500;
      letter-spacing: 0.01em;
      text-align: left;
      margin: 0;
      min-width: 220px;
      box-sizing: border-box;
    }
    .error {
      color: #ff6b6b;
      text-align: center;
      font-weight: bold;
      margin-top: 2.5rem;
      font-size: 1.12rem;
    }
    @media (max-width: 500px) {
      .profile-card-main {
        width: 100%;
        padding: 1.2rem 0.6rem 1rem 0.6rem;
      }
      .profile-img-bg { width: 68px; height: 68px; margin-top: -46px; }
      .profile-detail-row { font-size: 0.97rem; }
      .profile-line { font-size: 0.97rem; min-width: 140px; }
    }
  `]
})
export class ProfileComponent implements OnInit {
  profile: any = null;
  errorMessage: string = '';
  profileFields = [
    { label: 'Personnel Number', key: 'Pernr' },
    { label: 'Start Date', key: 'Begda' },
    { label: 'End Date', key: 'Endda' },
    { label: 'Gender', key: 'Gesch' },
    { label: 'Birth Date', key: 'Gbtag' },
    { label: 'Nationality', key: 'Natio' },
    { label: 'Language', key: 'Sprsl' },
    { label: 'City', key: 'Ort01' },
    { label: 'Postal Code', key: 'Pstlz' },
    { label: 'Country', key: 'Land1' }
  ];

  private profileUrl = 'http://localhost:3000/api/profile';

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    const persno = this.authService.getPersno();
    if (!persno) {
      this.errorMessage = 'No logged in user found.';
      return;
    }
    this.http.get<any>(`${this.profileUrl}?pernr=${persno}`).subscribe({
      next: (response) => {
        if (response && response.success !== false) {
          this.profile = response.profile;
        } else {
          this.errorMessage = response.message || 'Failed to load profile.';
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Server error while loading profile.';
      }
    });
  }
}
