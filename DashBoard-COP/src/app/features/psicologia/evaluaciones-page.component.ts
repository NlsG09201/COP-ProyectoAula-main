import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

interface Eval {
  idEvaluacion: number;
  tipo: string;
  puntaje: number;
  fecha: string;
  notas?: string;
  paciente?: { idPersona: number; nombreCompleto?: string; email?: string };
}

@Component({
  standalone: true,
  selector: 'app-evaluaciones-page',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid p-0 animate-reveal">
      <!-- Header -->
      <div class="row align-items-center justify-content-between mb-5 g-4">
        <div class="col-md-auto">
          <h2 class="display-6 fw-black text-dark mb-1 tracking-tight">Evaluaciones Psicológicas</h2>
          <p class="text-uppercase fw-bold text-muted small tracking-widest mb-0">Análisis PHQ-9 y GAD-7</p>
        </div>
        <div class="col-md-auto">
          <button class="btn btn-white border shadow-sm rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2" (click)="load()">
            <i class="fas fa-sync-alt text-primary"></i> Actualizar
          </button>
        </div>
      </div>

      <!-- Filters Card -->
      <div class="card border-0 shadow-sm rounded-5 mb-5">
        <div class="card-body p-4 p-md-5">
          <div class="row g-4 mb-4">
            <div class="col-md-4 col-lg-3">
              <label class="form-label small fw-black text-muted text-uppercase tracking-widest">Tipo de Test</label>
              <select [(ngModel)]="tipo" (change)="load()" class="form-select rounded-3 border-light bg-light">
                <option [ngValue]="''">Todos los tests</option>
                <option value="PHQ9">PHQ-9 (Depresión)</option>
                <option value="GAD7">GAD-7 (Ansiedad)</option>
              </select>
            </div>
            <div class="col-md-4 col-lg-3">
              <label class="form-label small fw-black text-muted text-uppercase tracking-widest">Desde</label>
              <input type="date" [(ngModel)]="desde" (change)="load()" class="form-control rounded-3 border-light bg-light">
            </div>
            <div class="col-md-4 col-lg-3">
              <label class="form-label small fw-black text-muted text-uppercase tracking-widest">Hasta</label>
              <input type="date" [(ngModel)]="hasta" (change)="load()" class="form-control rounded-3 border-light bg-light">
            </div>
            <div class="col-md-12 col-lg-3 d-flex align-items-end">
              <button class="btn btn-outline-secondary w-100 rounded-3 py-2 fw-bold" (click)="tipo='';desde='';hasta='';texto='';load()">Limpiar</button>
            </div>
          </div>
          
          <div class="position-relative">
            <span class="position-absolute start-0 top-50 translate-middle-y ms-3 text-muted">
              <i class="fas fa-search"></i>
            </span>
            <input placeholder="Buscar por paciente o notas clínicas..." [(ngModel)]="texto" (input)="applyFilters()" class="form-control form-control-lg border-0 bg-light rounded-4 ps-5">
          </div>
        </div>
      </div>

      <!-- Content Table Card -->
      <div class="card border-0 shadow-sm rounded-5 overflow-hidden">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0" *ngIf="filtered.length">
            <thead class="bg-light">
              <tr>
                <th class="ps-4 border-0 small fw-black text-muted text-uppercase tracking-widest py-3">Fecha</th>
                <th class="border-0 small fw-black text-muted text-uppercase tracking-widest py-3">Paciente</th>
                <th class="border-0 small fw-black text-muted text-uppercase tracking-widest py-3">Test</th>
                <th class="border-0 small fw-black text-muted text-uppercase tracking-widest py-3">Puntaje</th>
                <th class="border-0 small fw-black text-muted text-uppercase tracking-widest py-3">Interpretación</th>
                <th class="pe-4 border-0 small fw-black text-muted text-uppercase tracking-widest py-3">Notas</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let e of filtered" class="transition-all hover-lift">
                <td class="ps-4">
                  <span class="small fw-bold text-muted">{{ e.fecha | date:'dd MMM, yyyy' }}</span>
                </td>
                <td>
                  <div class="d-flex align-items-center gap-2">
                    <div class="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle w-8 h-8 small fw-black">
                      {{ e.paciente?.nombreCompleto?.charAt(0) }}
                    </div>
                    <span class="fw-bold text-dark small">{{ e.paciente?.nombreCompleto || 'ID: '+e.paciente?.idPersona }}</span>
                  </div>
                </td>
                <td>
                  <span class="badge rounded-pill px-3 py-2 fw-bold border" 
                        [ngClass]="e.tipo === 'PHQ9' ? 'bg-indigo-subtle text-indigo border-indigo' : 'bg-primary-subtle text-primary border-primary'">
                    {{ e.tipo }}
                  </span>
                </td>
                <td>
                  <div class="d-flex align-items-center gap-2">
                    <span class="h5 fw-black mb-0" [ngClass]="e.puntaje > 10 ? 'text-danger' : 'text-success'">{{ e.puntaje }}</span>
                    <span class="small fw-bold text-muted">pts</span>
                  </div>
                </td>
                <td>
                  <span class="badge rounded-pill px-3 py-2 fw-bold" [ngClass]="{
                    'bg-success text-white': e.puntaje < 5,
                    'bg-info text-white': e.puntaje >= 5 && e.puntaje < 10,
                    'bg-warning text-dark': e.puntaje >= 10 && e.puntaje < 15,
                    'bg-danger text-white': e.puntaje >= 15
                  }">
                    {{ e.puntaje < 5 ? 'Mínimo' : e.puntaje < 10 ? 'Leve' : e.puntaje < 15 ? 'Moderado' : 'Severo' }}
                  </span>
                </td>
                <td class="pe-4">
                  <p class="small text-muted mb-0 text-truncate" style="max-width: 200px;" [title]="e.notas || ''">
                    {{ e.notas || 'Sin observaciones' }}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="!filtered.length" class="p-5 text-center text-muted fw-bold">
            <i class="fas fa-clipboard-list fa-3x mb-3 opacity-25"></i>
            <p>No se encontraron evaluaciones registradas.</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EvaluacionesPageComponent {
  tipo = '';
  desde = '';
  hasta = '';
  texto = '';
  evaluaciones: Eval[] = [];
  filtered: Eval[] = [];
  loading = false;

  constructor(private api: ApiService) { this.load(); }

  async load() {
    this.loading = true;
    try {
      const params: string[] = [];
      if (this.tipo) params.push(`tipo=${encodeURIComponent(this.tipo)}`);
      if (this.desde && this.hasta) params.push(`desde=${this.desde}`, `hasta=${this.hasta}`);
      const qs = params.length ? `?${params.join('&')}` : '';
      const list = await this.api.get<Eval[]>(`/psicologia/evaluaciones${qs}`).toPromise();
      this.evaluaciones = list || [];
      this.applyFilters();
    } catch {
      this.evaluaciones = [];
      this.filtered = [];
    } finally {
      this.loading = false;
    }
  }

  applyFilters() {
    const t = (this.texto || '').toLowerCase();
    this.filtered = this.evaluaciones.filter(e => {
      const p = (e.paciente?.nombreCompleto || '').toLowerCase();
      const n = (e.notas || '').toLowerCase();
      return !t || p.includes(t) || n.includes(t);
    });
  }
}
