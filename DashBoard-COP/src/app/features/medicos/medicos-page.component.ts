import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

interface Medico {
  idPersona: number;
  nombreCompleto: string;
  email?: string;
  telefono?: string;
  horaInicioDisponibilidad?: string;
  horaFinDisponibilidad?: string;
  diasDisponibles?: string;
}

interface Cita {
  idCita: number;
  fecha: string;
  hora: string;
  medico?: { idPersona: number };
}

@Component({
  selector: 'app-medicos-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2 style="margin-bottom:16px">Médicos disponibles</h2>
    <div class="grid" style="grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:12px">
      <div class="field">
        <label>Fecha</label>
        <input type="date" [(ngModel)]="filtroFecha" (change)="aplicarFiltros()">
      </div>
      <div class="field">
        <label>Hora</label>
        <input type="time" [(ngModel)]="filtroHora" (change)="aplicarFiltros()">
      </div>
      <div class="field">
        <label>Texto</label>
        <input placeholder="Buscar por nombre o email" [(ngModel)]="filtroTexto" (input)="aplicarFiltros()">
      </div>
      <div class="field" style="align-self:end">
        <button class="btn secondary" (click)="resetFiltros()">Limpiar filtros</button>
      </div>
    </div>

    <div *ngIf="loading">Cargando...</div>
    <div *ngIf="error" class="text-red-700">{{ error }}</div>

    <table class="w-full" *ngIf="!loading">
      <thead>
        <tr>
          <th class="text-left">Nombre</th>
          <th class="text-left">Email</th>
          <th class="text-left">Teléfono</th>
          <th class="text-left">Horario</th>
          <th class="text-left">Días</th>
          <th class="text-left">Disponible</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let m of medicosFiltrados">
          <td>{{ m.nombreCompleto }}</td>
          <td>{{ m.email || '—' }}</td>
          <td>{{ m.telefono || '—' }}</td>
          <td>{{ formatHora(m.horaInicioDisponibilidad) }} - {{ formatHora(m.horaFinDisponibilidad) }}</td>
          <td>{{ formatDias(m.diasDisponibles) }}</td>
          <td>
            <span [style.color]="estaDisponible(m) ? '#16a34a' : '#dc2626'">{{ estaDisponible(m) ? 'Sí' : 'No' }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  `,
})
export class MedicosPageComponent {
  medicos: Medico[] = [];
  medicosFiltrados: Medico[] = [];
  citas: Cita[] = [];
  filtroFecha = '';
  filtroHora = '';
  filtroTexto = '';
  loading = false;
  error = '';

  constructor(private api: ApiService) { this.load(); }

  load() {
    this.loading = true; this.error = '';
    this.api.get<Medico[]>('/medicos').subscribe({
      next: (m) => { this.medicos = m; this.aplicarFiltros(); this.loading = false; },
      error: () => { this.error = 'Error cargando médicos'; this.loading = false; }
    });
    this.api.get<Cita[]>('/citas').subscribe({ next: (c) => this.citas = c, error: () => {} });
  }

  aplicarFiltros() {
    const txt = (this.filtroTexto || '').toLowerCase();
    this.medicosFiltrados = this.medicos.filter(m => {
      const t = !txt || (m.nombreCompleto || '').toLowerCase().includes(txt) || (m.email || '').toLowerCase().includes(txt);
      return t && this.filtroDisponible(m);
    });
  }

  resetFiltros() {
    this.filtroFecha = ''; this.filtroHora = ''; this.filtroTexto = ''; this.aplicarFiltros();
  }

  filtroDisponible(m: Medico): boolean {
    const fecha = this.filtroFecha ? new Date(this.filtroFecha) : null;
    const hora = this.filtroHora || '';
    const diaNombre = fecha ? this.nombreDia(fecha) : '';

    const dias = (m.diasDisponibles || '').toLowerCase();
    const diaOk = !fecha || !dias || dias.includes(diaNombre.toLowerCase()) || dias.includes(this.diaEnIngles(fecha));

    const hi = m.horaInicioDisponibilidad || '';
    const hf = m.horaFinDisponibilidad || '';
    const horaOk = !hora || (!hi && !hf) || ((hi ? hora >= hi : true) && (hf ? hora <= hf : true));

    const conflicto = this.existeCita(m, this.filtroFecha, this.filtroHora);
    return diaOk && horaOk && !conflicto;
  }

  existeCita(m: Medico, fechaStr: string, horaStr: string): boolean {
    if (!fechaStr || !horaStr) return false;
    return this.citas.some(c => {
      const mis = c.medico?.idPersona === m.idPersona;
      const f = c.fecha === fechaStr;
      const h = (c.hora || '').startsWith(horaStr);
      return Boolean(mis && f && h);
    });
  }

  estaDisponible(m: Medico): boolean { return this.filtroDisponible(m); }

  formatHora(h?: string): string { return h ? h.substring(0,5) : '—'; }

  formatDias(d?: string): string {
    if (!d) return '—';
    const map: Record<string,string> = { MONDAY: 'Lunes', TUESDAY: 'Martes', WEDNESDAY: 'Miércoles', THURSDAY: 'Jueves', FRIDAY: 'Viernes', SATURDAY: 'Sábado', SUNDAY: 'Domingo' };
    let s = d;
    Object.entries(map).forEach(([en, es]) => { s = s.replaceAll(en, es); });
    return s;
  }

  nombreDia(f: Date): string {
    const dias = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
    return dias[f.getDay()];
  }

  diaEnIngles(f: Date): string {
    const dias = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
    return dias[f.getDay()];
  }
}

