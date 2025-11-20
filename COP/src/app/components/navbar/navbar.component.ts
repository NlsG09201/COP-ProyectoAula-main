import { Component, HostListener, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isMobile = signal(false);
  menuOpen = signal(false);

  ngOnInit() {
    this.updateMode();
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

