import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private persnoKey = 'loggedInPersno';

  setPersno(persno: string) {
    localStorage.setItem(this.persnoKey, persno);
  }

  getPersno(): string | null {
    return localStorage.getItem(this.persnoKey);
  }

  clearPersno() {
    localStorage.removeItem(this.persnoKey);
  }
}
