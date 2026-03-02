import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
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
    return localStorage.getItem('client_user') !== null;
  }

  getUserName() {
    const user = localStorage.getItem('client_user');
    return user ? JSON.parse(user).nombreCompleto : '';
  }

  logout() {
    localStorage.removeItem('client_user');
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

