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
    <div class="grid gap-2 mb-4">
      <h2 class="text-2xl font-semibold">Evaluaciones Psicológicas</h2>
      <p class="text-slate-600">PHQ-9 y GAD-7 registradas desde el portal.</p>
    </div>

    <section class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
      <div class="field card">
        <label>Tipo</label>
        <select [(ngModel)]="tipo" (change)="load()">
          <option [ngValue]="''">Todos</option>
          <option>PHQ9</option>
          <option>GAD7</option>
        </select>
      </div>
      <div class="field card"><label>Desde</label><input type="date" [(ngModel)]="desde" (change)="load()"></div>
      <div class="field card"><label>Hasta</label><input type="date" [(ngModel)]="hasta" (change)="load()"></div>
      <div class="field card md:col-span-2"><label>Texto</label><input placeholder="Paciente / notas" [(ngModel)]="texto" (input)="applyFilters()"></div>
    </section>

    <div class="card overflow-auto">
      <table class="min-w-full">
        <thead>
          <tr>
            <th class="px-3 py-2 text-left">Fecha</th>
            <th class="px-3 py-2 text-left">Paciente</th>
            <th class="px-3 py-2 text-left">Tipo</th>
            <th class="px-3 py-2 text-left">Puntaje</th>
            <th class="px-3 py-2 text-left">Notas</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let e of filtered">
            <td class="px-3 py-2">{{ e.fecha | date:'yyyy-MM-dd' }}</td>
            <td class="px-3 py-2">{{ e.paciente?.nombreCompleto || e.paciente?.idPersona }}</td>
            <td class="px-3 py-2">{{ e.tipo }}</td>
            <td class="px-3 py-2">{{ e.puntaje }}</td>
            <td class="px-3 py-2">{{ e.notas }}</td>
          </tr>
        </tbody>
      </table>
      <div *ngIf="!filtered.length && !loading" class="px-3 py-2">Sin datos</div>
      <div *ngIf="loading" class="px-3 py-2">Cargando...</div>
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
