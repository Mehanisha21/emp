import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
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
