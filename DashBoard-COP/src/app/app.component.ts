import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav>
      <a routerLink="/citas" routerLinkActive="active">Citas</a>
      <a routerLink="/pacientes" routerLinkActive="active">Pacientes</a>
      <a routerLink="/odontograma" routerLinkActive="active">Odontograma</a>
    </nav>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {}