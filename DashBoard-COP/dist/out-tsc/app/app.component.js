var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
let AppComponent = class AppComponent {
    constructor() {
        this.user = '';
        this.pass = '';
    }
    login() {
        if (!this.user || !this.pass)
            return;
        const token = btoa(`${this.user}:${this.pass}`);
        sessionStorage.setItem('auth', token);
        this.pass = '';
    }
    logout() {
        sessionStorage.removeItem('auth');
        this.user = '';
        this.pass = '';
    }
};
AppComponent = __decorate([
    Component({
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
], AppComponent);
export { AppComponent };
//# sourceMappingURL=app.component.js.map