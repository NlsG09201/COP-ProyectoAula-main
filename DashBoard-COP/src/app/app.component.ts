import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, FormsModule],
  template: `
    <div class="min-h-screen grid md:grid-cols-[220px_1fr] grid-cols-1">
      <aside class="bg-slate-900 text-white p-4 hidden md:flex md:flex-col gap-2">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-9 h-9 rounded-lg bg-blue-600 text-white grid place-items-center font-bold">COP</div>
          <div class="font-semibold">Dashboard</div>
        </div>
        <a class="px-3 py-2 rounded hover:bg-slate-800" routerLink="/citas" routerLinkActive="bg-slate-800">Citas</a>
        <a class="px-3 py-2 rounded hover:bg-slate-800" routerLink="/pacientes" routerLinkActive="bg-slate-800">Pacientes</a>
        <a class="px-3 py-2 rounded hover:bg-slate-800" routerLink="/odontograma" routerLinkActive="bg-slate-800">Odontograma</a>
        <a class="px-3 py-2 rounded hover:bg-slate-800" routerLink="/medicos" routerLinkActive="bg-slate-800">Médicos</a>
        <a class="px-3 py-2 rounded hover:bg-slate-800" routerLink="/notificaciones" routerLinkActive="bg-slate-800">Notificaciones</a>
      </aside>
      <div class="flex flex-col">
        <header class="bg-white shadow px-4 py-3">
          <div class="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <div class="sm:col-span-6 flex items-center gap-2">
              <button class="md:hidden btn-outline btn-sm" (click)="mobileMenu = !mobileMenu">Menú</button>
              <div class="text-slate-700 font-semibold">Gestión Clínica</div>
            </div>
            <div class="sm:col-span-6 grid grid-cols-6 gap-2">
              <button class="col-span-1 btn-outline btn-sm" (click)="cycleTheme()">{{ themeText }}</button>
              <input class="col-span-2 nav-input" placeholder="usuario" [(ngModel)]="user" />
              <input class="col-span-2 nav-input" type="password" placeholder="clave" [(ngModel)]="pass" />
              <div class="col-span-1 flex gap-2">
                <button (click)="login()" class="btn btn-sm">Entrar</button>
                <button (click)="logout()" class="btn btn-sm secondary">Salir</button>
              </div>
            </div>
          </div>
          <nav class="mt-3 grid grid-cols-2 gap-2 md:hidden" *ngIf="mobileMenu">
            <a class="btn-outline text-center" routerLink="/citas" routerLinkActive="active">Citas</a>
            <a class="btn-outline text-center" routerLink="/pacientes" routerLinkActive="active">Pacientes</a>
            <a class="btn-outline text-center" routerLink="/odontograma" routerLinkActive="active">Odontograma</a>
            <a class="btn-outline text-center" routerLink="/medicos" routerLinkActive="active">Médicos</a>
            <a class="btn-outline text-center" routerLink="/notificaciones" routerLinkActive="active">Notificaciones</a>
          </nav>
        </header>
        <main class="px-4 py-4">
          <div class="grid gap-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="card stat"><div class="stat-title">Panel</div><div class="stat-value">Gestión</div></div>
              <div class="card stat"><div class="stat-title">Citas</div><div class="stat-value">Sección</div></div>
              <div class="card stat"><div class="stat-title">Pacientes</div><div class="stat-value">Sección</div></div>
              <div class="card stat"><div class="stat-title">Médicos</div><div class="stat-value">Sección</div></div>
            </div>
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
})
export class AppComponent {
  user = '';
  pass = '';
  mobileMenu = false;
  theme: 'light'|'dark'|'dark-green' = 'light';
  get themeText() { return this.theme === 'light' ? 'Claro' : (this.theme === 'dark' ? 'Oscuro' : 'Verde'); }
  constructor() {
    try {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark' || stored === 'dark-green') this.theme = stored;
      else this.theme = 'light';
      this.applyTheme();
    } catch {}
  }
  cycleTheme() { this.theme = this.theme === 'light' ? 'dark' : (this.theme === 'dark' ? 'dark-green' : 'light'); try { localStorage.setItem('theme', this.theme); } catch {}; this.applyTheme(); }
  private applyTheme() {
    const el = document && (document.documentElement || document.body);
    if (!el) return;
    if (this.theme === 'light') el.removeAttribute('data-theme'); else el.setAttribute('data-theme', this.theme);
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
