import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, FormsModule],
  template: `
    <nav>
      <a routerLink="/citas" routerLinkActive="active">Citas</a>
      <a routerLink="/pacientes" routerLinkActive="active">Pacientes</a>
      <a routerLink="/odontograma" routerLinkActive="active">Odontograma</a>
      <a routerLink="/medicos" routerLinkActive="active">Médicos</a>
      <a routerLink="/notificaciones" routerLinkActive="active">Notificaciones</a>
      <span style="margin-left:auto"></span>
      <input class="nav-input" placeholder="usuario" [(ngModel)]="user" />
      <input class="nav-input" type="password" placeholder="clave" [(ngModel)]="pass" />
      <button (click)="login()" class="btn">Entrar</button>
      <button (click)="logout()" class="btn secondary">Salir</button>
    </nav>
    <div class="container">
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
    this.pass = '';
  }
  logout() {
    sessionStorage.removeItem('auth');
    this.user = '';
    this.pass = '';
  }
}
