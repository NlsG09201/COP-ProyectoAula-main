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
    <div class="container-fluid p-0 animate-reveal">
      <!-- Header -->
      <div class="row align-items-center justify-content-between mb-5 g-4">
        <div class="col-md-auto">
          <h2 class="display-6 fw-black text-dark mb-1 tracking-tight">Staff Médico</h2>
          <p class="text-uppercase fw-bold text-muted small tracking-widest mb-0">Disponibilidad y gestión de especialistas</p>
        </div>
        <div class="col-md-auto">
          <button class="btn btn-white border shadow-sm rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2" (click)="load()">
            <i class="fas fa-sync-alt text-primary"></i> Actualizar
          </button>
        </div>
      </div>

      <!-- Filters Section Card -->
      <div class="card border-0 shadow-sm rounded-5 mb-5">
        <div class="card-body p-4 p-md-5">
          <div class="row g-4 mb-4">
            <div class="col-6 col-md-4 col-lg-2">
              <label class="form-label small fw-black text-muted text-uppercase tracking-widest">Fecha</label>
              <input type="date" [(ngModel)]="filtroFecha" (change)="aplicarFiltros()" class="form-control rounded-3 border-light bg-light">
            </div>
            <div class="col-6 col-md-4 col-lg-2">
              <label class="form-label small fw-black text-muted text-uppercase tracking-widest">Hora</label>
              <input type="time" [(ngModel)]="filtroHora" (change)="aplicarFiltros()" class="form-control rounded-3 border-light bg-light">
            </div>
            <div class="col-6 col-md-4 col-lg-2">
              <label class="form-label small fw-black text-muted text-uppercase tracking-widest">Desde</label>
              <input type="date" [(ngModel)]="filtroDesde" (change)="aplicarFiltros()" class="form-control rounded-3 border-light bg-light">
            </div>
            <div class="col-6 col-md-4 col-lg-2">
              <label class="form-label small fw-black text-muted text-uppercase tracking-widest">Hasta</label>
              <input type="date" [(ngModel)]="filtroHasta" (change)="aplicarFiltros()" class="form-control rounded-3 border-light bg-light">
            </div>
            <div class="col-12 col-md-4 col-lg-2">
              <label class="form-label small fw-black text-muted text-uppercase tracking-widest">Especialidad</label>
              <select [(ngModel)]="servicioId" (change)="cargarMedicosPorServicio()" class="form-select rounded-3 border-light bg-light">
                <option [ngValue]="null">Todas</option>
                <option *ngFor="let s of servicios" [ngValue]="s.idServicio">{{ s.nombre || (s.tipoServicio?.nombre) }}</option>
              </select>
            </div>
            <div class="col-12 col-md-4 col-lg-2 d-flex align-items-end">
              <button class="btn btn-outline-secondary w-100 rounded-3 py-2 fw-bold" (click)="resetFiltros()">Limpiar</button>
            </div>
          </div>
          
          <div class="position-relative">
            <span class="position-absolute start-0 top-50 translate-middle-y ms-3 text-muted">
              <i class="fas fa-search"></i>
            </span>
            <input placeholder="Buscar por nombre o email del especialista..." [(ngModel)]="filtroTexto" (input)="aplicarFiltros()" class="form-control form-control-lg border-0 bg-light rounded-4 ps-5">
          </div>
        </div>
      </div>

      <!-- Loading/Error States -->
      <div *ngIf="loading" class="d-flex justify-content-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>
      <div *ngIf="error" class="alert alert-danger rounded-4 py-3 text-center fw-bold shadow-sm">{{ error }}</div>

      <!-- Doctors Grid -->
      <div class="row g-4" *ngIf="!loading">
        <div class="col-md-6 col-lg-4" *ngFor="let m of medicosFiltrados">
          <div class="card border-0 shadow-sm rounded-5 h-100 transition-all hover-lift group">
            <div class="card-body p-4 p-md-5 d-flex flex-column">
              <div class="d-flex justify-content-between align-items-start mb-4">
                <div class="d-flex align-items-center justify-content-center bg-light text-secondary rounded-4 w-16 h-16 display-6 fw-black group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                  {{ m.nombreCompleto?.charAt(0) }}
                </div>
                <span class="badge rounded-pill px-3 py-2 fw-bold" [ngClass]="estaDisponible(m) ? 'bg-success-subtle text-success border border-success' : 'bg-danger-subtle text-danger border border-danger'">
                  <i class="fas fa-circle small me-1"></i> {{ estaDisponible(m) ? 'Disponible' : 'No disponible' }}
                </span>
              </div>

              <div class="mb-4">
                <h4 class="h4 fw-black text-dark mb-1">{{ m.nombreCompleto }}</h4>
                <p class="text-uppercase fw-bold text-muted small tracking-widest mb-0">{{ m.email || 'Sin correo' }}</p>
              </div>

              <div class="bg-light rounded-4 p-4 mt-auto mb-4">
                <div class="row g-3">
                  <div class="col-6">
                    <span class="text-[10px]! font-black text-slate-400 uppercase tracking-widest">Horario</span>
                    <p class="text-sm font-bold text-slate-700 mb-0">{{ formatHora(m.horaInicioDisponibilidad) }} - {{ formatHora(m.horaFinDisponibilidad) }}</p>
                  </div>
                  <div class="col-6 text-end">
                    <span class="text-[10px]! font-black text-slate-400 uppercase tracking-widest">Teléfono</span>
                    <p class="text-sm font-bold text-blue-600 mb-0">{{ m.telefono || '—' }}</p>
                  </div>
                  <div class="col-12">
                    <span class="text-[10px]! font-black text-slate-400 uppercase tracking-widest">Días Laborales</span>
                    <p class="text-xs font-medium text-slate-500 mb-0">{{ formatDias(m.diasDisponibles) }}</p>
                  </div>
                </div>
              </div>

              <button class="btn btn-primary w-100 py-3! text-[10px]! rounded-2xl! opacity-0 group-hover:opacity-100 transition-all">
                Ver Perfil Completo
              </button>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && !medicosFiltrados.length" class="text-center py-5 opacity-50">
        <i class="fas fa-user-md fa-4x mb-3"></i>
        <h3 class="h4 fw-black">No se encontraron especialistas</h3>
        <p>Intenta ajustar los filtros de búsqueda.</p>
      </div>
    </div>
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
