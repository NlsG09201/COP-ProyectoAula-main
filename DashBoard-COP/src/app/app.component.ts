import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, FormsModule],
  template: `
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 py-3">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div class="md:col-span-4 flex items-center gap-2">
            <div class="w-9 h-9 rounded-lg bg-blue-600 text-white grid place-items-center font-bold">COP</div>
            <div class="text-slate-700 font-semibold hidden sm:block">Dashboard de Gestión</div>
          </div>
          <nav class="md:col-span-5 flex flex-wrap gap-2 text-sm">
            <a class="btn-link" routerLink="/citas" routerLinkActive="active">Citas</a>
            <a class="btn-link" routerLink="/pacientes" routerLinkActive="active">Pacientes</a>
            <a class="btn-link" routerLink="/odontograma" routerLinkActive="active">Odontograma</a>
            <a class="btn-link" routerLink="/medicos" routerLinkActive="active">Médicos</a>
            <a class="btn-link" routerLink="/notificaciones" routerLinkActive="active">Notificaciones</a>
          </nav>
          <div class="md:col-span-3 grid grid-cols-5 gap-2">
            <input class="col-span-2 nav-input" placeholder="usuario" [(ngModel)]="user" />
            <input class="col-span-2 nav-input" type="password" placeholder="clave" [(ngModel)]="pass" />
            <div class="col-span-1 flex gap-2">
              <button (click)="login()" class="btn">Entrar</button>
              <button (click)="logout()" class="btn secondary">Salir</button>
            </div>
          </div>
        </div>
      </div>
    </header>
    <div class="container mx-auto px-4 py-4">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {
  user = '';
  pass = '';
  login() {
    if (!this.user || !this.pass) return;
    const token = btoa(`${this.user}:${this.pass}`);
    sessionStorage.setItem('auth', token);
    // Verificar si el token es válido intentando cargar pacientes
    location.reload(); // Recargar para que ApiService tome el nuevo token
  }
  logout() {
    sessionStorage.removeItem('auth');
    location.reload();
  }
}
