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
    <div class="container-fluid p-0 animate-reveal">
      <!-- Header -->
      <div class="row align-items-center justify-content-between mb-5 g-4">
        <div class="col-md-auto">
          <h2 class="display-6 fw-black text-dark mb-1 tracking-tight">Notificaciones</h2>
          <p class="text-uppercase fw-bold text-muted small tracking-widest mb-0">Correos enviados por confirmaciones de cita.</p>
        </div>
        <div class="col-md-auto">
          <button class="btn btn-white border shadow-sm rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2" (click)="buscar()">
            <i class="fas fa-sync-alt text-primary"></i> Actualizar
          </button>
        </div>
      </div>

      <!-- Search Card -->
      <div class="card border-0 shadow-sm rounded-5 mb-5">
        <div class="card-body p-4 p-md-5">
          <div class="row g-4 align-items-end">
            <div class="col-md-8">
              <label class="form-label small fw-black text-muted text-uppercase tracking-widest">Filtrar por email del paciente</label>
              <div class="position-relative">
                <span class="position-absolute start-0 top-50 translate-middle-y ms-3 text-muted">
                  <i class="fas fa-envelope"></i>
                </span>
                <input placeholder="email@dominio.com" [(ngModel)]="filtroTo" (input)="buscar()" class="form-control form-control-lg border-0 bg-light rounded-4 ps-5">
              </div>
            </div>
            <div class="col-md-4 d-flex gap-2">
              <button class="btn btn-primary btn-lg rounded-pill px-4 flex-grow-1 fw-bold shadow-sm" (click)="buscar()">Buscar</button>
              <button class="btn btn-outline-secondary btn-lg rounded-pill px-4 flex-grow-1 fw-bold" (click)="limpiar()">Limpiar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading/Error -->
      <div *ngIf="loading" class="d-flex justify-content-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>
      <div *ngIf="error" class="alert alert-danger rounded-4 py-3 text-center fw-bold shadow-sm">{{ error }}</div>

      <!-- Table Card -->
      <div class="card border-0 shadow-sm rounded-5 overflow-hidden">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0" *ngIf="!loading">
            <thead class="bg-light">
              <tr>
                <th class="ps-4 border-0 small fw-black text-muted text-uppercase tracking-widest py-3">Fecha de Envío</th>
                <th class="border-0 small fw-black text-muted text-uppercase tracking-widest py-3">Destinatario</th>
                <th class="border-0 small fw-black text-muted text-uppercase tracking-widest py-3">Asunto</th>
                <th class="pe-4 border-0 small fw-black text-muted text-uppercase tracking-widest py-3">Remitente</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let n of lista" class="transition-all hover-lift">
                <td class="ps-4">
                  <span class="small fw-bold text-dark">{{ n.created }}</span>
                </td>
                <td>
                  <span class="badge bg-primary-subtle text-primary border border-primary rounded-pill px-3 py-2 fw-bold">
                    {{ (n.to || []).join(', ') }}
                  </span>
                </td>
                <td>
                  <span class="fw-bold text-dark small">{{ n.subject || '—' }}</span>
                </td>
                <td class="pe-4">
                  <span class="text-muted small fw-medium">{{ n.from || '—' }}</span>
                </td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="!lista.length && !loading" class="p-5 text-center text-muted fw-bold">
            <i class="fas fa-bell-slash fa-3x mb-3 opacity-25"></i>
            <p>No hay registros de notificaciones enviadas.</p>
          </div>
        </div>
      </div>
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
    try {
      const preset = sessionStorage.getItem('notifFilterEmail') || '';
      if (preset && !this.filtroTo) { this.filtroTo = preset; }
    } catch {}
    this.loading = true; this.error = '';
    const q = this.filtroTo ? `?to=${encodeURIComponent(this.filtroTo)}` : '';
    this.api.get<Notificacion[]>(`/notificaciones${q}`).subscribe({
      next: (data) => { this.lista = data || []; this.loading = false; },
      error: () => { this.error = 'Error cargando notificaciones'; this.loading = false; }
    });
  }

  limpiar() { this.filtroTo = ''; this.buscar(); }
}
