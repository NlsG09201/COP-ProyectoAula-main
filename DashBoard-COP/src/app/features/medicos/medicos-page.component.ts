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
    <div class="grid" style="grid-template-columns:repeat(6,1fr); gap:12px; margin-bottom:12px">
      <div class="field">
        <label>Fecha</label>
        <input type="date" [(ngModel)]="filtroFecha" (change)="aplicarFiltros()">
      </div>
      <div class="field">
        <label>Hora</label>
        <input type="time" [(ngModel)]="filtroHora" (change)="aplicarFiltros()">
      </div>
      <div class="field">
        <label>Desde</label>
        <input type="date" [(ngModel)]="filtroDesde" (change)="aplicarFiltros()">
      </div>
      <div class="field">
        <label>Hasta</label>
        <input type="date" [(ngModel)]="filtroHasta" (change)="aplicarFiltros()">
      </div>
      <div class="field">
        <label>Servicio</label>
        <select [(ngModel)]="servicioId" (change)="cargarMedicosPorServicio()">
          <option [ngValue]="null">Todos</option>
          <option *ngFor="let s of servicios" [ngValue]="s.idServicio">{{ s.nombre || (s.tipoServicio?.nombre) }}</option>
        </select>
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
  filtroDesde = '';
  filtroHasta = '';
  filtroTexto = '';
  loading = false;
  error = '';
  servicios: any[] = [];
  servicioId: number | null = null;

  constructor(private api: ApiService) { this.load(); this.cargarServicios(); }

  load() {
    this.loading = true; this.error = '';
    this.api.get<Medico[]>('/medicos').subscribe({
      next: (m) => { this.medicos = m; this.aplicarFiltros(); this.loading = false; },
      error: () => { this.error = 'Error cargando médicos'; this.loading = false; }
    });
    this.api.get<Cita[]>('/citas').subscribe({ next: (c) => this.citas = c, error: () => {} });
  }

  cargarServicios() {
    this.api.get<any[]>('/servicios').subscribe({ next: (s) => this.servicios = s, error: () => {} });
  }

  cargarMedicosPorServicio() {
    this.loading = true;
    const url = this.servicioId ? `/medicos/por-servicio/${this.servicioId}` : '/medicos';
    this.api.get<Medico[]>(url).subscribe({
      next: (m) => { this.medicos = m; this.aplicarFiltros(); this.loading = false; },
      error: () => { this.error = 'Error cargando médicos'; this.loading = false; }
    });
  }

  aplicarFiltros() {
    const txt = (this.filtroTexto || '').toLowerCase();
    this.medicosFiltrados = this.medicos.filter(m => {
      const t = !txt || (m.nombreCompleto || '').toLowerCase().includes(txt) || (m.email || '').toLowerCase().includes(txt);
      return t && this.filtroDisponible(m);
    });
  }

  resetFiltros() {
    this.filtroFecha = ''; this.filtroHora = ''; this.filtroTexto = ''; this.filtroDesde=''; this.filtroHasta=''; this.servicioId=null; this.aplicarFiltros();
  }

  filtroDisponible(m: Medico): boolean {
    const hora = this.filtroHora || '';
    const hi = m.horaInicioDisponibilidad || '';
    const hf = m.horaFinDisponibilidad || '';
    const horaOk = !hora || (!hi && !hf) || ((hi ? hora >= hi : true) && (hf ? hora <= hf : true));

    const diasDisp = (m.diasDisponibles || '').toLowerCase();

    if (this.filtroFecha) {
      const fecha = new Date(this.filtroFecha);
      const diaOk = !diasDisp || diasDisp.includes(this.nombreDia(fecha).toLowerCase()) || diasDisp.includes(this.diaEnIngles(fecha));
      const conflicto = this.existeCita(m, this.filtroFecha, hora);
      return diaOk && horaOk && !conflicto;
    }

    if (this.filtroDesde && this.filtroHasta) {
      const diasRango = this.diasDelRango(new Date(this.filtroDesde), new Date(this.filtroHasta));
      const diaOk = !diasDisp || diasRango.some(d => diasDisp.includes(d) || diasDisp.includes(this.traducirDiaIngles(d)));
      const conflicto = this.existeCitaEnRango(m, this.filtroDesde, this.filtroHasta, hora);
      return diaOk && horaOk && !conflicto;
    }

    const conflicto = this.existeCita(m, this.filtroFecha, hora);
    return horaOk && !conflicto;
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

  existeCitaEnRango(m: Medico, desdeStr: string, hastaStr: string, horaStr: string): boolean {
    if (!desdeStr || !hastaStr || !horaStr) return false;
    const desde = new Date(desdeStr).getTime();
    const hasta = new Date(hastaStr).getTime();
    return this.citas.some(c => {
      const mis = c.medico?.idPersona === m.idPersona;
      const f = new Date(c.fecha).getTime();
      const enRango = f >= desde && f <= hasta;
      const h = (c.hora || '').startsWith(horaStr);
      return Boolean(mis && enRango && h);
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

  traducirDiaIngles(dia: string): string {
    const map: Record<string,string> = { lunes:'MONDAY', martes:'TUESDAY', miércoles:'WEDNESDAY', jueves:'THURSDAY', viernes:'FRIDAY', sábado:'SATURDAY', domingo:'SUNDAY' };
    return map[dia.toLowerCase()] || dia;
  }

  diasDelRango(desde: Date, hasta: Date): string[] {
    const res: string[] = [];
    for (let d = new Date(desde); d.getTime() <= hasta.getTime(); d.setDate(d.getDate() + 1)) {
      res.push(this.nombreDia(d).toLowerCase());
    }
    return res;
  }
}

