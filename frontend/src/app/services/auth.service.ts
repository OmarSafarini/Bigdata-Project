import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly KEY = 'userId';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  setUserId(userId: string) {
    if (!this.isBrowser()) return;
    localStorage.setItem(this.KEY, userId);
  }

  getUserId(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getUserId();
  }

  logout() {
    if (!this.isBrowser()) return;
    localStorage.removeItem(this.KEY);
  }
}
