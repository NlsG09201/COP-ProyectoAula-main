import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

interface Notificacion { subject: string; from: string; to: string[]; created: string; }

@Component({
  selector: 'app-notificaciones-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2 class="text-2xl font-semibold mb-2">Notificaciones</h2>
    <p class="text-slate-600 mb-4">Correos enviados por confirmaciones de cita.</p>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div class="field">
        <label>Filtrar por email del paciente</label>
        <input placeholder="email@dominio" [(ngModel)]="filtroTo" (input)="buscar()">
      </div>
      <div class="field" style="align-self:end">
        <button class="btn" (click)="buscar()">Buscar</button>
        <button class="btn secondary" style="margin-left:8px" (click)="limpiar()">Limpiar</button>
      </div>
    </div>

    <div class="card mb-4" *ngIf="loading">Cargando...</div>
    <div class="card mb-4 text-red-700" *ngIf="error">{{ error }}</div>

    <div class="overflow-x-auto rounded-lg shadow">
      <table class="min-w-full bg-white" *ngIf="!loading">
        <thead class="bg-blue-50">
          <tr>
            <th class="px-4 py-2 text-left">Fecha</th>
            <th class="px-4 py-2 text-left">Para</th>
            <th class="px-4 py-2 text-left">Asunto</th>
            <th class="px-4 py-2 text-left">Desde</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let n of lista" class="border-t">
            <td class="px-4 py-2">{{ n.created }}</td>
            <td class="px-4 py-2">{{ (n.to || []).join(', ') }}</td>
            <td class="px-4 py-2">{{ n.subject || '—' }}</td>
            <td class="px-4 py-2">{{ n.from || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class NotificacionesPageComponent {
  lista: Notificacion[] = [];
  filtroTo = '';
  loading = false;
  error = '';

  constructor(private api: ApiService) { this.buscar(); }

  buscar() {
    this.loading = true; this.error = '';
    const q = this.filtroTo ? `?to=${encodeURIComponent(this.filtroTo)}` : '';
    this.api.get<Notificacion[]>(`/notificaciones${q}`).subscribe({
      next: (data) => { this.lista = data || []; this.loading = false; },
      error: () => { this.error = 'Error cargando notificaciones'; this.loading = false; }
    });
  }

  limpiar() { this.filtroTo = ''; this.buscar(); }
}
