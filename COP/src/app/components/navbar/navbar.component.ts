import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, Router, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isMobile = signal(false);
  menuOpen = signal(false);

  constructor(private router: Router) {}

  ngOnInit() {
    this.updateMode();
  }

  isLoggedIn() {
    try {
      return localStorage.getItem('client_user') !== null;
    } catch {
      return false;
    }
  }

  getUserName() {
    try {
      const user = localStorage.getItem('client_user');
      if (!user) return '';
      const parsed = JSON.parse(user);
      return parsed.nombreCompleto || parsed.username || 'Paciente';
    } catch {
      return 'Paciente';
    }
  }

  logout() {
    try {
      localStorage.removeItem('client_user');
    } catch {}
    this.router.navigate(['/auth']);
  }

  toggleMenu() {
    this.menuOpen.update(v => !v);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  @HostListener('window:resize')
  onResize() {
    this.updateMode();
  }

  private updateMode() {
    const mobile = window.innerWidth < 1024;
    this.isMobile.set(mobile);
    if (!mobile) this.menuOpen.set(false);
  }
}

