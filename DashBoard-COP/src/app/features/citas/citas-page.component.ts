import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Router } from '@angular/router';

interface Cita { idCita?: number; fecha: string; hora: string; direccion: string; paciente?: any; medico?: any; servicio?: any; estado?: string; confirmado?: boolean; selectedMedicoId?: number; }

@Component({
  standalone: true,
  selector: 'app-citas-page',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid py-2">
      <!-- Page Header -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
        <div>
          <h2 class="h3 fw-black text-dark mb-1">Gestión de Citas</h2>
          <p class="text-muted small fw-bold text-uppercase tracking-widest mb-0">Control total de la agenda clínica</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-white border shadow-sm px-4 py-2 rounded-3 fw-bold small hover-lift" (click)="load()">
            <i class="fas fa-sync-alt me-2 text-primary"></i> Actualizar
          </button>
          <button class="btn btn-primary px-4 py-2 rounded-3 fw-bold shadow-sm hover-lift">
            <i class="fas fa-plus me-2"></i> Nueva Cita
          </button>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="row g-4 mb-5">
        <div class="col-md-3">
          <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <div class="small text-muted fw-bold text-uppercase tracking-wider mb-1">Total Citas</div>
            <div class="h4 fw-black mb-0">{{ totalCitas }}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <div class="small text-muted fw-bold text-uppercase tracking-wider mb-1 text-success">Confirmadas</div>
            <div class="h4 fw-black mb-0">{{ totalConfirmadas }}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <div class="small text-muted fw-bold text-uppercase tracking-wider mb-1 text-warning">Pendientes</div>
            <div class="h4 fw-black mb-0">{{ totalPendientes }}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <div class="small text-muted fw-bold text-uppercase tracking-wider mb-1 text-info">Médicos</div>
            <div class="h4 fw-black mb-0">{{ medicosActivos }}</div>
          </div>
        </div>
      </div>

      <!-- Filters Card -->
      <div class="card border-0 shadow-sm rounded-4 mb-5 bg-white">
        <div class="card-body p-4">
          <div class="row g-3 align-items-end">
            <div class="col-md-3">
              <label class="form-label small fw-black text-muted text-uppercase tracking-widest">Desde</label>
              <input type="date" [(ngModel)]="filtroDesde" class="form-control border-0 bg-light rounded-3 px-3">
            </div>
            <div class="col-md-3">
              <label class="form-label small fw-black text-muted text-uppercase tracking-widest">Hasta</label>
              <input type="date" [(ngModel)]="filtroHasta" class="form-control border-0 bg-light rounded-3 px-3">
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-black text-muted text-uppercase tracking-widest">Búsqueda rápida</label>
              <div class="input-group">
                <span class="input-group-text border-0 bg-light rounded-start-3"><i class="fas fa-search text-muted"></i></span>
                <input placeholder="Paciente o médico..." [(ngModel)]="filtroTexto" class="form-control border-0 bg-light rounded-end-3 px-3">
              </div>
            </div>
            <div class="col-md-2">
              <button class="btn btn-primary w-100 py-2 rounded-3 fw-bold shadow-sm" (click)="aplicarFiltros()">Filtrar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light">
              <tr>
                <th class="border-0 px-4 py-3 small fw-black text-muted text-uppercase tracking-widest">ID</th>
                <th class="border-0 px-4 py-3 small fw-black text-muted text-uppercase tracking-widest cursor-pointer" (click)="ordenarPor('fecha')">Fecha ↕</th>
                <th class="border-0 px-4 py-3 small fw-black text-muted text-uppercase tracking-widest">Hora</th>
                <th class="border-0 px-4 py-3 small fw-black text-muted text-uppercase tracking-widest">Paciente</th>
                <th class="border-0 px-4 py-3 small fw-black text-muted text-uppercase tracking-widest">Médico</th>
                <th class="border-0 px-4 py-3 small fw-black text-muted text-uppercase tracking-widest">Servicio</th>
                <th class="border-0 px-4 py-3 small fw-black text-muted text-uppercase tracking-widest text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of citasFiltradas">
                <td class="px-4 py-3 fw-bold text-muted">#{{ c.idCita }}</td>
                <td class="px-4 py-3 fw-bold">{{ c.fecha | date:'dd MMM yyyy' }}</td>
                <td class="px-4 py-3 text-primary fw-black">{{ c.hora }}</td>
                <td class="px-4 py-3">
                  <div class="d-flex align-items-center gap-3">
                    <div class="bg-light rounded-circle d-flex align-items-center justify-content-center fw-bold text-dark border" style="width: 35px; height: 32px;">
                      {{ c.paciente?.nombreCompleto?.charAt(0) }}
                    </div>
                    <div>
                      <div class="fw-bold text-dark small">{{ c.paciente?.nombreCompleto || 'N/A' }}</div>
                      <div class="text-muted" style="font-size: 0.7rem;">{{ c.paciente?.email || 'Sin correo' }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <div class="d-flex align-items-center gap-2" *ngIf="c.medico">
                    <i class="fas fa-user-md text-primary"></i>
                    <span class="small fw-bold">{{ c.medico?.nombreCompleto }}</span>
                  </div>
                  <span *ngIf="!c.medico" class="badge bg-warning-subtle text-warning border border-warning-subtle rounded-pill small px-3">Sin asignar</span>
                </td>
                <td class="px-4 py-3">
                  <span class="badge bg-success-subtle text-success border border-success-subtle rounded-pill small px-3">{{ c.servicio?.nombre || 'General' }}</span>
                </td>
                <td class="px-4 py-3 text-end">
                  <div class="d-flex justify-content-end gap-2">
                    <select [(ngModel)]="c.selectedMedicoId" class="form-select form-select-sm border-0 bg-light rounded-3 px-2 py-1" style="width: 150px; font-size: 0.75rem;">
                      <option [ngValue]="undefined">Asignar...</option>
                      <option *ngFor="let m of medicos" [ngValue]="m.idPersona">{{ m.nombreCompleto }}</option>
                    </select>
                    <button class="btn btn-primary btn-sm rounded-3 px-3 fw-bold" style="font-size: 0.7rem;" (click)="confirmar(c)" [disabled]="!c.selectedMedicoId && !c.medico">
                      Confirmar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div *ngIf="!citasFiltradas.length && !loading" class="p-5 text-center">
          <div class="display-1 text-light opacity-50 mb-3"><i class="fas fa-folder-open"></i></div>
          <h5 class="fw-black text-dark">No se encontraron citas</h5>
          <p class="text-muted small">Intenta ajustar los filtros de búsqueda</p>
        </div>
      </div>

      <!-- Turnos Section -->
      <div class="mt-5 pt-5 border-top">
        <h3 class="h4 fw-black text-dark mb-4">Disponibilidad Médica</h3>
        <div class="card border-0 shadow-sm rounded-4 bg-white p-4">
          <div class="row g-4 align-items-end">
            <div class="col-md-3">
              <label class="form-label small fw-black text-muted text-uppercase tracking-widest">Especialista</label>
              <select [(ngModel)]="turnoMedicoId" class="form-select border-0 bg-light rounded-3 px-3">
                <option [ngValue]="null">Seleccionar médico...</option>
                <option *ngFor="let m of medicos" [ngValue]="m.idPersona">{{ m.nombreCompleto }}</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label small fw-black text-muted text-uppercase tracking-widest">Entrada</label>
              <input type="time" [(ngModel)]="horaInicio" class="form-control border-0 bg-light rounded-3 px-3">
            </div>
            <div class="col-md-2">
              <label class="form-label small fw-black text-muted text-uppercase tracking-widest">Salida</label>
              <input type="time" [(ngModel)]="horaFin" class="form-control border-0 bg-light rounded-3 px-3">
            </div>
            <div class="col-md-3">
              <label class="form-label small fw-black text-muted text-uppercase tracking-widest">Días</label>
              <input placeholder="LUNES,MARTES..." [(ngModel)]="diasDisponibles" class="form-control border-0 bg-light rounded-3 px-3">
            </div>
            <div class="col-md-2">
              <button class="btn btn-dark w-100 py-2 rounded-3 fw-bold" (click)="guardarTurno()">Actualizar</button>
            </div>
          </div>
          
          <div class="mt-3 text-center" *ngIf="errorTurno || okTurno">
            <span class="badge py-2 px-4 rounded-pill" [ngClass]="errorTurno ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'">
              {{ errorTurno || okTurno }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CitasPageComponent {
  citas: Cita[] = [];
  citasFiltradas: Cita[] = [];
  loading = false;
  error = '';
  totalCitas = 0;
  totalConfirmadas = 0;
  totalPendientes = 0;
  medicosActivos = 0;
  filtroDesde = '';
  filtroHasta = '';
  filtroTexto = '';
  medicos: any[] = [];
  turnoMedicoId: number | null = null;
  horaInicio = '';
  horaFin = '';
  diasDisponibles = '';
  errorTurno = '';
  okTurno = '';

  constructor(private api: ApiService, private router: Router) { this.load(); }

  load() {
    this.loading = true; this.error = '';
    this.api.get<Cita[]>('/citas').subscribe({
      next: (data) => { this.citas = data; this.citasFiltradas = [...data]; this.updateStats(); this.loading = false; },
      error: () => { this.error = 'Error cargando citas'; this.loading = false; }
    });
    this.api.get<any[]>('/medicos').subscribe({ next: (m) => { this.medicos = m; this.updateStats(); }, error: () => {} });
  }

  aplicarFiltros() {
    const desde = this.filtroDesde ? new Date(this.filtroDesde) : null;
    const hasta = this.filtroHasta ? new Date(this.filtroHasta) : null;
    const txt = (this.filtroTexto || '').toLowerCase();
    this.citasFiltradas = this.citas.filter(c => {
      const fechaValida = (() => {
        if (!desde && !hasta) return true;
        const f = new Date(c.fecha);
        if (desde && f < desde) return false;
        if (hasta && f > hasta) return false;
        return true;
      })();
      const textoValido = txt ? (
        (c.paciente?.nombreCompleto || '').toLowerCase().includes(txt) ||
        (c.medico?.nombreCompleto || '').toLowerCase().includes(txt) ||
        (c.direccion || '').toLowerCase().includes(txt)
      ) : true;
      return fechaValida && textoValido;
    });
    this.updateStats();
  }

  resetFiltros() { this.filtroDesde = this.filtroHasta = this.filtroTexto = ''; this.citasFiltradas = [...this.citas]; }

  ordenarPor(campo: 'fecha'|'hora') {
    const parse = (v: any) => campo === 'fecha' ? new Date(v).getTime() : (''+v);
    this.citasFiltradas.sort((a,b) => (parse(a[campo]) > parse(b[campo]) ? 1 : -1));
  }

  private updateStats() {
    this.totalCitas = this.citas.length;
    this.totalConfirmadas = this.citas.filter(c => !!c.confirmado).length;
    this.totalPendientes = this.citas.filter(c => !c.confirmado).length;
    this.medicosActivos = this.medicos.length;
  }
 
  

  confirmar(cita: Cita) {
    const medicoId = cita.selectedMedicoId || cita.medico?.idPersona;
    if (!cita.idCita || !medicoId) {
        this.error = 'Debes seleccionar un médico para confirmar la cita';
        return;
    }
    const email = cita.paciente?.email;
    if (email) { try { sessionStorage.setItem('notifFilterEmail', email); } catch {} }
    
    this.api.post(`/citas/${cita.idCita}/asignar?medicoId=${medicoId}&confirmar=true`, {}).subscribe({
      next: () => { 
          alert('Cita confirmada correctamente');
          this.load(); 
          // try { this.router.navigate(['/notificaciones']); } catch {} 
      },
      error: (err) => {
          const txt = (err?.error?.message || err?.error || 'Error desconocido');
          this.error = 'Error confirmando: ' + txt;
      }
    });
  }

  guardarTurno() {
    this.errorTurno = ''; this.okTurno = '';
    if (!this.turnoMedicoId) { this.errorTurno = 'Selecciona un médico'; return; }
    const body: any = {
      horaInicioDisponibilidad: this.horaInicio ? this.horaInicio + ':00' : null,
      horaFinDisponibilidad: this.horaFin ? this.horaFin + ':00' : null,
      diasDisponibles: this.diasDisponibles || null
    };
    this.api.put(`/medicos/${this.turnoMedicoId}`, body).subscribe({
      next: () => { 
        this.okTurno = 'Turno actualizado'; 
        this.load(); // Recargar para actualizar la lista de médicos en el selector
      },
      error: () => { this.errorTurno = 'Error actualizando turno'; }
    });
  }
}
