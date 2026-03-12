import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  template: `
    <div class="d-flex min-vh-100 bg-light font-sans selection:bg-primary selection:text-white">
      <!-- Sidebar Bootstrap Style -->
      <aside class="bg-dark text-light shrink-0 transition-all duration-500 shadow-lg z-3" 
             [style.width]="mobileMenu && isMobile() ? '100%' : (isMobile() ? '0' : '280px')"
             [class.d-none]="!mobileMenu && isMobile()"
             [class.position-fixed]="isMobile()"
             [class.h-100]="isMobile()">
        <div class="p-4 h-100 d-flex flex-column overflow-y-auto">
          <!-- Brand -->
          <div class="d-flex align-items-center gap-3 mb-5 px-3 cursor-pointer group" routerLink="/">
            <div class="bg-primary rounded-3 p-2 shadow-sm">
              <span class="h4 mb-0 fw-black text-white">COP</span>
            </div>
            <div class="d-flex flex-col">
              <span class="h5 mb-0 fw-black text-white">Admin</span>
              <span class="text-muted small text-uppercase fw-bold tracking-widest" style="font-size: 0.6rem;">Dashboard v4</span>
            </div>
          </div>
          
          <!-- Navigation -->
          <nav class="nav flex-column gap-2 grow px-2">
            <div class="text-muted small text-uppercase fw-black tracking-widest mb-3 ms-2" style="font-size: 0.65rem;">Menú Principal</div>
            
            <a routerLink="/citas" routerLinkActive="active bg-primary text-white shadow-sm" class="nav-link d-flex align-items-center gap-3 px-3 py-3 rounded-3 text-light opacity-75 hover-opacity-100 transition-all">
              <i class="fas fa-calendar-alt fs-5"></i>
              <span class="fw-bold">Gestión de Citas</span>
            </a>
            
            <a routerLink="/pacientes" routerLinkActive="active bg-primary text-white shadow-sm" class="nav-link d-flex align-items-center gap-3 px-3 py-3 rounded-3 text-light opacity-75 hover-opacity-100 transition-all">
              <i class="fas fa-users fs-5"></i>
              <span class="fw-bold">Pacientes</span>
            </a>
            
            <a routerLink="/odontograma" routerLinkActive="active bg-primary text-white shadow-sm" class="nav-link d-flex align-items-center gap-3 px-3 py-3 rounded-3 text-light opacity-75 hover-opacity-100 transition-all">
              <i class="fas fa-tooth fs-5"></i>
              <span class="fw-bold">Odontograma</span>
            </a>
            
            <a routerLink="/medicos" routerLinkActive="active bg-primary text-white shadow-sm" class="nav-link d-flex align-items-center gap-3 px-3 py-3 rounded-3 text-light opacity-75 hover-opacity-100 transition-all">
              <i class="fas fa-user-md fs-5"></i>
              <span class="fw-bold">Staff Médico</span>
            </a>
            
            <a routerLink="/psicologia" routerLinkActive="active bg-primary text-white shadow-sm" class="nav-link d-flex align-items-center gap-3 px-3 py-3 rounded-3 text-light opacity-75 hover-opacity-100 transition-all">
              <i class="fas fa-brain fs-5"></i>
              <span class="fw-bold">Psicología</span>
            </a>

            <hr class="my-4 border-secondary opacity-25">
            
            <div class="text-muted small text-uppercase fw-black tracking-widest mb-3 ms-2" style="font-size: 0.65rem;">Sistema</div>
            <a routerLink="/notificaciones" routerLinkActive="active bg-primary text-white shadow-sm" class="nav-link d-flex align-items-center justify-content-between px-3 py-3 rounded-3 text-light opacity-75 hover-opacity-100 transition-all">
              <div class="d-flex align-items-center gap-3">
                <i class="fas fa-bell fs-5"></i>
                <span class="fw-bold">Notificaciones</span>
              </div>
              <span class="badge bg-danger rounded-pill px-2" style="font-size: 0.6rem;">3</span>
            </a>
          </nav>

          <!-- User Profile Sidebar -->
          <div class="mt-auto pt-4 px-2">
            <div class="bg-secondary bg-opacity-10 rounded-4 p-3 d-flex align-items-center gap-3">
              <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style="width: 40px; height: 40px;">
                {{ user ? user.charAt(0).toUpperCase() : 'A' }}
              </div>
              <div class="overflow-hidden">
                <div class="fw-bold text-white text-truncate small">{{ user || 'Admin User' }}</div>
                <div class="text-muted" style="font-size: 0.6rem;">Super Administrador</div>
              </div>
              <button (click)="logout()" class="btn btn-link text-danger p-0 ms-auto shadow-none">
                <i class="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Wrapper -->
      <div class="grow d-flex flex-column min-w-0 vh-100">
        <!-- Modern Header -->
        <header class="navbar navbar-light bg-white bg-opacity-75 border-bottom px-4 py-3 sticky-top z-2 shadow-sm" style="backdrop-filter: blur(10px);">
          <div class="container-fluid">
            <div class="d-flex align-items-center gap-3">
              <button class="btn btn-light d-md-none border shadow-none" (click)="mobileMenu = !mobileMenu">
                <i class="fas fa-bars"></i>
              </button>
              <div>
                <h4 class="mb-0 fw-black text-dark">Panel de Control</h4>
                <div class="small text-muted fw-bold text-uppercase tracking-widest d-none d-sm-block" style="font-size: 0.6rem;">Centro de Salud COP</div>
              </div>
            </div>

            <div class="d-flex align-items-center gap-3">
              <div class="d-none d-lg-flex bg-light border rounded-3 px-3 py-2 align-items-center gap-2">
                <i class="fas fa-search text-muted small"></i>
                <input class="bg-transparent border-0 outline-none small fw-bold" style="width: 200px;" placeholder="Buscar...">
              </div>

              <button (click)="cycleTheme()" class="btn btn-light border shadow-sm rounded-3">
                <span class="fs-5">{{ theme === 'light' ? '☀️' : (theme === 'dark' ? '🌙' : '🌿') }}</span>
              </button>

              <div class="vr mx-2"></div>

              <ng-container *ngIf="!user">
                <div class="d-flex gap-2">
                  <input class="form-control form-control-sm rounded-3 bg-light border-0 px-3" style="width: 120px;" placeholder="User" [(ngModel)]="user">
                  <input class="form-control form-control-sm rounded-3 bg-light border-0 px-3" type="password" style="width: 120px;" placeholder="Pass" [(ngModel)]="pass">
                  <button (click)="login()" class="btn btn-primary btn-sm rounded-3 px-3 fw-bold">Login</button>
                </div>
              </ng-container>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="grow overflow-y-auto p-4 p-md-5 bg-light bg-opacity-50">
          <div class="container-fluid max-w-7xl mx-auto animate-reveal">
            <!-- Summary Stats Cards -->
            <div class="row g-4 mb-5">
              <div class="col-sm-6 col-xl-3">
                <div class="card border-0 shadow-sm rounded-4 p-4 h-100 hover-lift bg-white">
                  <div class="d-flex align-items-center gap-3">
                    <div class="bg-primary bg-opacity-10 rounded-3 p-3 text-primary fs-4">
                      <i class="fas fa-calendar-check"></i>
                    </div>
                    <div>
                      <div class="small text-muted fw-bold text-uppercase tracking-widest" style="font-size: 0.65rem;">Citas Hoy</div>
                      <div class="h3 mb-0 fw-black text-dark">24</div>
                    </div>
                  </div>
                  <div class="mt-3 small text-success fw-bold"><i class="fas fa-arrow-up me-1"></i> 12% más que ayer</div>
                </div>
              </div>
              <div class="col-sm-6 col-xl-3">
                <div class="card border-0 shadow-sm rounded-4 p-4 h-100 hover-lift bg-white">
                  <div class="d-flex align-items-center gap-3">
                    <div class="bg-info bg-opacity-10 rounded-3 p-3 text-info fs-4">
                      <i class="fas fa-user-friends"></i>
                    </div>
                    <div>
                      <div class="small text-muted fw-bold text-uppercase tracking-widest" style="font-size: 0.65rem;">Pacientes</div>
                      <div class="h3 mb-0 fw-black text-dark">1,248</div>
                    </div>
                  </div>
                  <div class="mt-3 small text-muted fw-bold">Base de datos activa</div>
                </div>
              </div>
              <div class="col-sm-6 col-xl-3">
                <div class="card border-0 shadow-sm rounded-4 p-4 h-100 hover-lift bg-white">
                  <div class="d-flex align-items-center gap-3">
                    <div class="bg-success bg-opacity-10 rounded-3 p-3 text-success fs-4">
                      <i class="fas fa-dollar-sign"></i>
                    </div>
                    <div>
                      <div class="small text-muted fw-bold text-uppercase tracking-widest" style="font-size: 0.65rem;">Ingresos</div>
                      <div class="h3 mb-0 fw-black text-dark">$4.2k</div>
                    </div>
                  </div>
                  <div class="mt-3 small text-muted fw-bold">Meta: $5.0k mensual</div>
                </div>
              </div>
              <div class="col-sm-6 col-xl-3">
                <div class="card border-0 shadow-sm rounded-4 p-4 h-100 hover-lift bg-white">
                  <div class="d-flex align-items-center gap-3">
                    <div class="bg-warning bg-opacity-10 rounded-3 p-3 text-warning fs-4">
                      <i class="fas fa-star"></i>
                    </div>
                    <div>
                      <div class="small text-muted fw-bold text-uppercase tracking-widest" style="font-size: 0.65rem;">Satisfacción</div>
                      <div class="h3 mb-0 fw-black text-dark">4.9</div>
                    </div>
                  </div>
                  <div class="mt-3 small text-warning fw-bold"><i class="fas fa-star me-1"></i> Promedio excelente</div>
                </div>
              </div>
            </div>

            <!-- Content Card -->
            <div class="card border-0 shadow-lg rounded-5 overflow-hidden bg-white">
              <div class="card-body p-4 p-md-5">
                <router-outlet></router-outlet>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .fw-black { font-weight: 900; }
    .rounded-4 { border-radius: 1.25rem !important; }
    .rounded-5 { border-radius: 2.5rem !important; }
    .hover-lift { transition: transform 0.3s ease, box-shadow 0.3s ease; }
    .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 15px 30px -5px rgba(0,0,0,0.1) !important; }
    .nav-link:hover { background-color: rgba(255,255,255,0.05); opacity: 1 !important; }
    .nav-link.active { opacity: 1 !important; }
    .selection\\:bg-primary::selection { background-color: #0d6efd; color: white; }
    .animate-reveal { animation: reveal 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    @keyframes reveal { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class AppComponent {
  user = '';
  pass = '';
  mobileMenu = false;
  theme: 'light'|'dark'|'dark-green' = 'light';
  get themeText() { return this.theme === 'light' ? 'Claro' : (this.theme === 'dark' ? 'Oscuro' : 'Verde'); }

  isMobile() {
    return window.innerWidth < 768;
  }

  constructor() {
    try {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark' || stored === 'dark-green') this.theme = stored as any;
      else this.theme = 'light';
      this.applyTheme();
    } catch {}
  }
  cycleTheme() { this.theme = this.theme === 'light' ? 'dark' : (this.theme === 'dark' ? 'dark-green' : 'light'); try { localStorage.setItem('theme', this.theme); } catch {}; this.applyTheme(); }
  private applyTheme() {
    if (typeof document !== 'undefined') {
      const el = document.documentElement || document.body;
      if (this.theme === 'light') el.removeAttribute('data-theme'); else el.setAttribute('data-theme', this.theme);
    }
  }
  login() {
    if (!this.user || !this.pass) return;
    const token = btoa(`${this.user}:${this.pass}`);
    sessionStorage.setItem('auth', token);
    location.reload();
  }
  logout() {
    sessionStorage.removeItem('auth');
    location.reload();
  }
}
