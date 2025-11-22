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
      <span style="margin-left:auto"></span>
      <input placeholder="usuario" [(ngModel)]="user" style="padding:6px;border-radius:6px;border:1px solid #1e293b;color:#111827" />
      <input type="password" placeholder="clave" [(ngModel)]="pass" style="padding:6px;border-radius:6px;border:1px solid #1e293b;color:#111827" />
      <button (click)="login()" class="btn" style="padding:6px 10px">Entrar</button>
      <button (click)="logout()" class="btn secondary" style="padding:6px 10px">Salir</button>
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
