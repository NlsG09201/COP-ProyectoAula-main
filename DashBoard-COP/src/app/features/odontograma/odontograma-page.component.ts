import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

interface Diente { idDiente: number; codigoFDI: string; nombre: string; }
interface PiezaSel { diente: Diente; seleccionada: boolean; estado?: string; observacion?: string; }

@Component({
  selector: 'app-odontograma-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    .odontograma-grid { 
      display: grid; 
      grid-template-columns: repeat(8, 1fr); 
      gap: 12px; 
      max-width: 800px; 
      margin: 0 auto;
    }
    .pieza-dental { 
      aspect-ratio: 1/1;
      border-radius: 1rem;
      border-width: 2px;
      border-color: rgb(241 245 249);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition-property: all;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-duration: 300ms;
      position: relative;
      overflow: hidden;
      background-color: white;
    }
    .pieza-dental:hover {
      border-color: rgb(191 219 254);
      background-color: rgb(239 246 255 / 0.3);
      transform: translateY(-0.25rem);
      box-shadow: 0 10px 15px -3px rgb(59 130 246 / 0.05);
    }
    .pieza-dental.selected { 
      border-color: rgb(59 130 246);
      background-color: rgb(239 246 255);
      --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
      --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color);
      box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
      --tw-ring-color: rgb(59 130 246 / 0.1);
      transform: scale(1.05);
      z-index: 10;
    }
    .fdi-code { font-size: 10px; font-weight: 900; color: rgb(148 163 184); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.25rem; }
    .tooth-icon { font-size: 1.25rem; filter: grayscale(1); opacity: 0.4; transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 500ms; }
    .selected .tooth-icon { filter: grayscale(0); opacity: 1; transform: scale(1.1); }
    
    .status-dot {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 9999px;
      opacity: 0;
      transition-property: opacity;
    }
    .has-status .status-dot { opacity: 1; }
  `],
  template: `
    <div class="container-fluid p-0 animate-reveal">
      <!-- Header -->
      <div class="row align-items-center justify-content-between mb-5 g-4">
        <div class="col-md-auto">
          <h2 class="display-6 fw-black text-dark mb-1 tracking-tight">Odontograma Digital</h2>
          <p class="text-uppercase fw-bold text-muted small tracking-widest mb-0">Mapeo clínico y evolución dental</p>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="row g-4">
        <!-- Left Column: Patient & Global Info -->
        <div class="col-lg-4">
          <div class="card border-0 shadow-sm rounded-5 mb-4 overflow-hidden">
            <div class="card-body p-4 p-md-5">
              <div class="mb-4">
                <label class="form-label small fw-black text-muted text-uppercase tracking-widest">ID Paciente</label>
                <div class="input-group">
                  <input type="number" [(ngModel)]="pacienteId" min="0" (ngModelChange)="validarId($event)" class="form-control rounded-start-3 border-light bg-light" placeholder="000">
                  <button class="btn btn-primary rounded-end-3 px-3" (click)="cargarHistorial()" [disabled]="!pacienteId">
                    <i class="fas fa-search"></i>
                  </button>
                </div>
              </div>

              <div class="mb-4">
                <label class="form-label small fw-black text-muted text-uppercase tracking-widest">Fecha Registro</label>
                <input type="date" [(ngModel)]="fecha" class="form-control rounded-3 border-light bg-light">
              </div>

              <div class="mb-0">
                <label class="form-label small fw-black text-muted text-uppercase tracking-widest">Observaciones Generales</label>
                <textarea [(ngModel)]="observaciones" rows="4" class="form-control rounded-3 border-light bg-light resize-none" placeholder="Notas clínicas relevantes..."></textarea>
              </div>
            </div>
          </div>

          <!-- Tool: Status Applicator Card -->
          <div class="card border-0 bg-primary text-white rounded-5 mb-4 shadow-lg">
            <div class="card-body p-4 p-md-5">
              <h4 class="h6 fw-black text-uppercase tracking-widest text-white text-opacity-75 mb-4">Aplicador de Estado</h4>
              
              <div class="mb-4">
                <label class="form-label small fw-black text-white text-opacity-50 text-uppercase tracking-widest">Condición</label>
                <select [(ngModel)]="estado" class="form-select bg-white bg-opacity-10 border-white border-opacity-20 text-white rounded-3 py-2 fw-bold focus:bg-white focus:text-primary transition-all">
                  <option value="Sano" class="text-dark">Sano</option>
                  <option value="Cariado" class="text-dark">Cariado</option>
                  <option value="Obturado" class="text-dark">Obturado</option>
                  <option value="Extracción" class="text-dark">Extracción</option>
                  <option value="Fractura" class="text-dark">Fractura</option>
                </select>
              </div>

              <div class="mb-4">
                <label class="form-label small fw-black text-white text-opacity-50 text-uppercase tracking-widest">Nota por pieza</label>
                <input [(ngModel)]="observacion" class="form-control bg-white bg-opacity-10 border-white border-opacity-20 text-white rounded-3 py-2 fw-bold focus:bg-white focus:text-primary transition-all" placeholder="Detalle...">
              </div>

              <button class="btn btn-light w-100 rounded-pill py-3 fw-black text-uppercase tracking-widest shadow-sm" (click)="aplicarASeleccion()">
                Aplicar a selección
              </button>
            </div>
          </div>

          <div class="d-grid gap-3">
            <button class="btn btn-primary btn-lg rounded-pill py-3 fw-bold shadow-sm" (click)="guardar()" [disabled]="loading">
              <i class="fas fa-save me-2"></i> {{ editandoId ? 'Actualizar Odontograma' : 'Guardar Odontograma' }}
            </button>
            <button *ngIf="editandoId" class="btn btn-outline-secondary btn-lg rounded-pill py-3 fw-bold" (click)="cancelarEdicion()">Cancelar Edición</button>
            <div *ngIf="msg" class="alert rounded-4 py-2 text-center small fw-bold" [ngClass]="msg.includes('Error') ? 'alert-danger' : 'alert-success'">{{ msg }}</div>
          </div>
        </div>

        <!-- Right Column: Visual Map -->
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm rounded-5 p-4 p-md-5">
            <div class="mb-5">
              <div class="d-flex align-items-center justify-content-between mb-4">
                <span class="small fw-black text-muted text-uppercase tracking-widest">Arcada Superior</span>
                <div class="grow border-bottom border-light mx-4"></div>
              </div>
              <div class="odontograma-grid">
                <div *ngFor="let p of superiores" (click)="toggle(p)" 
                     class="pieza-dental border border-light" 
                     [class.selected]="p.seleccionada"
                     [class.has-status]="p.estado">
                  <span class="fdi-code">{{ p.diente.codigoFDI }}</span>
                  <span class="tooth-icon">🦷</span>
                  <div class="status-dot" [ngClass]="{
                    'bg-success': p.estado === 'Sano',
                    'bg-danger': p.estado === 'Cariado' || p.estado === 'Fractura',
                    'bg-primary': p.estado === 'Obturado',
                    'bg-secondary': p.estado === 'Extracción'
                  }"></div>
                </div>
              </div>
            </div>

            <div>
              <div class="d-flex align-items-center justify-content-between mb-4">
                <span class="small fw-black text-muted text-uppercase tracking-widest">Arcada Inferior</span>
                <div class="grow border-bottom border-light mx-4"></div>
              </div>
              <div class="odontograma-grid">
                <div *ngFor="let p of inferiores" (click)="toggle(p)" 
                     class="pieza-dental border border-light" 
                     [class.selected]="p.seleccionada"
                     [class.has-status]="p.estado">
                  <span class="fdi-code">{{ p.diente.codigoFDI }}</span>
                  <span class="tooth-icon">🦷</span>
                  <div class="status-dot" [ngClass]="{
                    'bg-success': p.estado === 'Sano',
                    'bg-danger': p.estado === 'Cariado' || p.estado === 'Fractura',
                    'bg-primary': p.estado === 'Obturado',
                    'bg-secondary': p.estado === 'Extracción'
                  }"></div>
                </div>
              </div>
            </div>

            <!-- Legend -->
            <div class="d-flex flex-wrap justify-content-center gap-4 mt-5 pt-5 border-top border-light">
              <div class="d-flex align-items-center gap-2">
                <div class="rounded-circle bg-success w-3 h-3"></div>
                <span class="small fw-bold text-muted text-uppercase tracking-widest">Sano</span>
              </div>
              <div class="d-flex align-items-center gap-2">
                <div class="rounded-circle bg-danger w-3 h-3"></div>
                <span class="small fw-bold text-muted text-uppercase tracking-widest">Cariado/Fractura</span>
              </div>
              <div class="d-flex align-items-center gap-2">
                <div class="rounded-circle bg-primary w-3 h-3"></div>
                <span class="small fw-bold text-muted text-uppercase tracking-widest">Obturado</span>
              </div>
              <div class="d-flex align-items-center gap-2">
                <div class="rounded-circle bg-secondary w-3 h-3"></div>
                <span class="small fw-bold text-muted text-uppercase tracking-widest">Extracción</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- History Section -->
      <div class="mt-5 pt-5 border-top" *ngIf="historial.length">
        <div class="d-flex align-items-center justify-content-between mb-4">
          <h3 class="h4 fw-black text-dark mb-0">Evolución Clínica</h3>
          <span class="badge bg-success rounded-pill px-3 py-2 fw-bold">{{ historial.length }} Registros</span>
        </div>

        <div class="row g-4">
          <div *ngFor="let h of historial; let i = index" class="col-12">
            <div class="card border-0 shadow-sm rounded-5 p-4 p-md-5 transition-all hover-lift">
              <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4 mb-4">
                <div class="d-flex align-items-center gap-4">
                  <div class="d-flex align-items-center justify-content-center bg-light text-primary rounded-4 w-14 h-14 h3 fw-black mb-0 shadow-sm">
                    {{ historial.length - i }}
                  </div>
                  <div>
                    <h4 class="h5 fw-black text-dark mb-1">Registro Clínico #{{ h.o.idOdontograma }}</h4>
                    <p class="small fw-bold text-muted text-uppercase tracking-widest mb-0">{{ h.o.fechaRegistro }}</p>
                  </div>
                </div>
                <div class="d-flex gap-2">
                  <button (click)="cargarParaEditar(h)" class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">
                    <i class="fas fa-edit me-2"></i> Editar
                  </button>
                  <button (click)="eliminar(h.o.idOdontograma)" class="btn btn-outline-danger rounded-pill px-4 fw-bold">
                    <i class="fas fa-trash-alt me-2"></i> Eliminar
                  </button>
                </div>
              </div>

              <div class="bg-light p-4 rounded-4 border border-light mb-4 italic text-muted small">
                <i class="fas fa-quote-left me-2 opacity-50"></i>
                {{ h.o.observacionesGenerales || 'Sin observaciones adicionales para este registro.' }}
              </div>

              <div class="table-responsive">
                <table class="table table-hover align-middle mb-0 small">
                  <thead class="bg-light">
                    <tr>
                      <th class="border-0 fw-black text-muted text-uppercase tracking-widest py-2">FDI</th>
                      <th class="border-0 fw-black text-muted text-uppercase tracking-widest py-2">Pieza Dental</th>
                      <th class="border-0 fw-black text-muted text-uppercase tracking-widest py-2">Estado</th>
                      <th class="border-0 fw-black text-muted text-uppercase tracking-widest py-2">Observación</th>
                      <th class="border-0 fw-black text-muted text-uppercase tracking-widest py-2">Evolución</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let d of h.detalles">
                      <td class="fw-black text-primary">{{ d.diente?.codigoFDI }}</td>
                      <td class="fw-bold text-dark">{{ d.diente?.nombre }}</td>
                      <td>
                        <span class="badge rounded-pill px-3 py-2 fw-bold" [ngClass]="{
                          'bg-success-subtle text-success border border-success': d.estado === 'Sano',
                          'bg-danger-subtle text-danger border border-danger': d.estado === 'Cariado' || d.estado === 'Fractura',
                          'bg-primary-subtle text-primary border border-primary': d.estado === 'Obturado',
                          'bg-secondary-subtle text-secondary border border-secondary': d.estado === 'Extracción'
                        }">{{ d.estado }}</span>
                      </td>
                      <td class="text-muted">{{ d.observacion || '—' }}</td>
                      <td>
                        <span class="small fw-black text-uppercase tracking-widest" 
                              [ngClass]="d._cambio === 'Nuevo' ? 'text-primary' : (d._cambio === 'Sin cambio' ? 'text-muted' : 'text-success')">
                          {{ d._cambio }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class OdontogramaPageComponent implements OnInit {
  superiores: PiezaSel[] = [];
  inferiores: PiezaSel[] = [];
  estado = 'Sano';
  observacion = '';
  pacienteId = 0;
  fecha = new Date().toISOString().split('T')[0];
  observaciones = '';
  loading = false; msg = '';
  historial: { o: any, detalles: any[] }[] = [];
  editandoId: number | null = null;

  constructor(private api: ApiService, private route: ActivatedRoute) { this.cargarDientes(); }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['pacienteId']) {
        this.pacienteId = Number(params['pacienteId']);
        this.cargarHistorial();
      }
    });
  }

  validarId(v: any) {
    if (v < 0) {
      this.pacienteId = 0;
    } else {
      this.pacienteId = Math.floor(v);
    }
  }

  toggle(p: PiezaSel) { p.seleccionada = !p.seleccionada; }
  aplicarASeleccion() {
    [...this.superiores, ...this.inferiores].forEach(p => { if (p.seleccionada) { p.estado = this.estado; p.observacion = this.observacion; } });
  }

  guardar() {
    if (!this.pacienteId || !this.fecha) { this.msg = 'Paciente y fecha son obligatorios.'; return; }
    const seleccionadas: PiezaSel[] = [...this.superiores, ...this.inferiores].filter(p => p.estado);
    if (!seleccionadas.length) { this.msg = 'Selecciona al menos un diente con estado.'; return; }
    this.loading = true; this.msg = '';

    const detalles = seleccionadas.map(sel => ({
      diente: { idDiente: sel.diente.idDiente },
      estado: sel.estado,
      observacion: sel.observacion || ''
    }));

    const odontogramaBody = {
      fechaRegistro: this.fecha,
      observacionesGenerales: this.observaciones,
      paciente: { idPersona: this.pacienteId },
      detalles: detalles
    };

    if (this.editandoId) {
      this.api.put<any>(`/odontogramas/${this.editandoId}`, odontogramaBody).subscribe({
        next: () => {
          this.msg = 'Odontograma actualizado correctamente';
          this.loading = false;
          this.cancelarEdicion();
          this.cargarHistorial();
        },
        error: (err) => {
          this.msg = 'Error al actualizar: ' + (err?.error?.message || 'Error');
          this.loading = false;
        }
      });
    } else {
      this.api.post<any>('/odontogramas', odontogramaBody).subscribe({
        next: (od) => {
          this.msg = 'Odontograma guardado correctamente';
          this.loading = false;
          this.limpiarForm();
          this.cargarHistorial();
        },
        error: (err) => {
          this.msg = 'Error al guardar: ' + (err?.error?.message || 'Error');
          this.loading = false;
        }
      });
    }
  }

  cargarParaEditar(h: { o: any, detalles: any[] }) {
    this.editandoId = h.o.idOdontograma;
    this.fecha = h.o.fechaRegistro;
    this.observaciones = h.o.observacionesGenerales;
    
    // Resetear selección actual
    [...this.superiores, ...this.inferiores].forEach(p => {
      p.seleccionada = false;
      const det = h.detalles.find(d => d.diente?.idDiente === p.diente.idDiente);
      if (det) {
        p.estado = det.estado;
        p.observacion = det.observacion;
      } else {
        p.estado = undefined;
        p.observacion = undefined;
      }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminar(id: number) {
    if (!confirm('¿Seguro que deseas eliminar este registro del historial?')) return;
    this.api.delete(`/odontogramas/${id}`).subscribe({
      next: () => {
        this.msg = 'Registro eliminado';
        this.cargarHistorial();
      },
      error: () => { this.msg = 'Error al eliminar'; }
    });
  }

  cancelarEdicion() {
    this.editandoId = null;
    this.limpiarForm();
  }

  limpiarForm() {
    this.fecha = new Date().toISOString().split('T')[0];
    this.observaciones = '';
    [...this.superiores, ...this.inferiores].forEach(p => {
      p.seleccionada = false;
      p.estado = undefined;
      p.observacion = undefined;
    });
  }

  cargarDientes() {
    this.api.get<Diente[]>('/dientes').subscribe({
      next: (dientes) => {
        // Distribuir en dos filas: primeros 16 superiores, siguientes 16 inferiores
        const superiores = dientes.slice(0, 16);
        const inferiores = dientes.slice(16, 32);
        this.superiores = superiores.map(d => ({ diente: d, seleccionada: false }));
        this.inferiores = inferiores.map(d => ({ diente: d, seleccionada: false }));
      },
      error: () => { this.msg = 'Error cargando dientes'; }
    });
  }

  cargarHistorial() {
    if (!this.pacienteId) { this.msg = 'Paciente requerido para historial'; return; }
    this.api.get<any[]>(`/odontogramas/paciente/${this.pacienteId}`).subscribe({
      next: async (ods) => {
        const lista: { o: any, detalles: any[] }[] = [];
        for (const o of (ods || [])) {
          let detalles: any[] = [];
          try { detalles = await firstValueFrom(this.api.get<any[]>(`/detalles-odontograma/odontograma/${o.idOdontograma}`)); } catch { detalles = []; }
          const prev = lista.length ? lista[lista.length - 1].detalles : [];
          lista.push({ o, detalles: this.marcarCambios(detalles, prev || []) });
        }
        this.historial = lista;
      },
      error: () => { this.msg = 'Error cargando historial'; }
    });
  }

  marcarCambios(actual: any[], anterior: any[]): any[] {
    const prevMap: Record<string, any> = {};
    anterior.forEach(d => { const key = (d.diente?.codigoFDI) || (''+d.diente?.idDiente); prevMap[key] = d; });
    return (actual || []).map(d => {
      const key = (d.diente?.codigoFDI) || (''+d.diente?.idDiente);
      const prev = prevMap[key];
      const cambio = prev && prev.estado !== d.estado ? `${prev.estado} → ${d.estado}` : (prev ? 'Sin cambio' : 'Nuevo');
      return { ...d, _cambio: cambio };
    });
  }
}
