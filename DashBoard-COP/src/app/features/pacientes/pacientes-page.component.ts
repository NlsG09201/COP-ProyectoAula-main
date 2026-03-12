import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Router, RouterModule } from '@angular/router';

interface Paciente { idP?: number; idPersona?: number; docIden: string; nombreCompleto: string; telefono?: string; email?: string; direccion?: string; }

@Component({
  standalone: true,
  selector: 'app-pacientes-page',
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container-fluid p-0 animate-reveal">
      <!-- Header -->
      <div class="row align-items-center justify-content-between mb-5 g-4">
        <div class="col-md-auto">
          <h2 class="display-6 fw-black text-dark mb-1 tracking-tight">Expedientes de Pacientes</h2>
          <p class="text-uppercase fw-bold text-muted small tracking-widest mb-0">Base de datos centralizada de atención</p>
        </div>
        <div class="col-md-auto">
          <button class="btn btn-white border shadow-sm rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2" (click)="cargar()">
            <i class="fas fa-sync-alt text-primary"></i> Actualizar
          </button>
        </div>
      </div>

      <!-- Registration Form Card -->
      <div class="card border-0 shadow-sm rounded-5 mb-5 overflow-hidden">
        <div class="card-header bg-white border-0 p-4 pb-0">
          <div class="d-flex align-items-center gap-3">
            <div class="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-4 w-12 h-12 shadow-sm">
              <i class="fas" [ngClass]="editingId ? 'fa-edit' : 'fa-plus'"></i>
            </div>
            <h3 class="h5 fw-black text-dark mb-0">{{ editingId ? 'Editar Paciente' : 'Registrar Nuevo Paciente' }}</h3>
          </div>
        </div>
        <div class="card-body p-4 p-md-5">
          <div class="row g-4">
            <div class="col-md-6 col-lg-4">
              <label class="form-label small fw-black text-muted text-uppercase tracking-widest">Documento de Identidad</label>
              <div class="input-group input-group-lg">
                <input class="form-control rounded-3 border-light bg-light focus:bg-white" [(ngModel)]="form.docIden" (blur)="verificarDoc()" (ngModelChange)="docInputChanged($event)" placeholder="Número de identificación" />
                <span class="input-group-text bg-light border-light rounded-3" *ngIf="docValid !== null">
                  <i class="fas" [ngClass]="docValid ? 'fa-check-circle text-success' : 'fa-times-circle text-danger'"></i>
                </span>
              </div>
              <p *ngIf="docMsg" class="small fw-bold mt-2 mb-0" [ngClass]="docValid===false ? 'text-danger' : 'text-success'">{{ docMsg }}</p>
            </div>

            <div class="col-md-6 col-lg-4">
              <label class="form-label small fw-black text-muted text-uppercase tracking-widest">Nombre Completo</label>
              <input class="form-control form-control-lg rounded-3 border-light bg-light focus:bg-white" [(ngModel)]="form.nombreCompleto" placeholder="Nombres y Apellidos" />
            </div>

            <div class="col-md-6 col-lg-4">
              <label class="form-label small fw-black text-muted text-uppercase tracking-widest">WhatsApp / Teléfono</label>
              <input class="form-control form-control-lg rounded-3 border-light bg-light focus:bg-white" [(ngModel)]="form.telefono" placeholder="+57 300 000 0000" />
            </div>

            <div class="col-md-6 col-lg-4">
              <label class="form-label small fw-black text-muted text-uppercase tracking-widest">Correo Electrónico</label>
              <div class="input-group input-group-lg">
                <input class="form-control rounded-3 border-light bg-light focus:bg-white" [(ngModel)]="form.email" (ngModelChange)="emailChanged($event)" placeholder="paciente@ejemplo.com" />
                <span class="input-group-text bg-light border-light rounded-3" *ngIf="emailValid !== null">
                  <i class="fas" [ngClass]="emailValid ? 'fa-check-circle text-success' : 'fa-times-circle text-danger'"></i>
                </span>
              </div>
              <p *ngIf="emailMsg" class="small fw-bold mt-2 mb-0" [ngClass]="emailValid===false ? 'text-danger' : 'text-success'">{{ emailMsg }}</p>
            </div>

            <div class="col-md-12 col-lg-8">
              <label class="form-label small fw-black text-muted text-uppercase tracking-widest">Dirección de Residencia</label>
              <input class="form-control form-control-lg rounded-3 border-light bg-light focus:bg-white" [(ngModel)]="form.direccion" placeholder="Calle, Carrera, Barrio..." />
            </div>
          </div>

          <div class="d-flex align-items-center gap-3 mt-5 pt-4 border-top">
            <button class="btn btn-primary btn-lg rounded-pill px-5 fw-bold shadow-sm" (click)="guardar()" [disabled]="loading || (editingId===null && (docValid===false || emailValid===false))">
              <i class="fas fa-save me-2"></i> {{ editingId ? 'Actualizar Registro' : 'Confirmar Registro' }}
            </button>
            <button *ngIf="editingId" class="btn btn-outline-secondary btn-lg rounded-pill px-5 fw-bold" (click)="cancelarEdicion()">Cancelar</button>
            <div *ngIf="msg" class="ms-3 badge rounded-pill px-4 py-2 fw-bold" [ngClass]="msg.includes('Error') ? 'bg-danger text-white' : 'bg-success text-white'">{{ msg }}</div>
          </div>
        </div>
      </div>

      <!-- List Section -->
      <div class="card border-0 shadow-sm rounded-5 overflow-hidden">
        <div class="card-header bg-white border-0 p-4">
          <div class="row align-items-center g-3">
            <div class="col-md">
              <h3 class="h5 fw-black text-dark mb-0">Listado Maestro</h3>
            </div>
            <div class="col-md-auto">
              <div class="input-group">
                <span class="input-group-text bg-light border-0 rounded-start-pill ps-4">
                  <i class="fas fa-search text-muted small"></i>
                </span>
                <input placeholder="Filtrar por nombre o doc..." [(ngModel)]="filtro" (ngModelChange)="aplicarFiltro()" class="form-control border-0 bg-light rounded-end-pill pe-4 py-2 small" />
              </div>
            </div>
          </div>
        </div>
        
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0" *ngIf="filtrados.length">
            <thead class="bg-light">
              <tr>
                <th class="ps-4 border-0 small fw-black text-muted text-uppercase tracking-widest py-3">Paciente</th>
                <th class="border-0 small fw-black text-muted text-uppercase tracking-widest py-3">Identificación</th>
                <th class="border-0 small fw-black text-muted text-uppercase tracking-widest py-3">Contacto</th>
                <th class="border-0 small fw-black text-muted text-uppercase tracking-widest py-3">Ubicación</th>
                <th class="pe-4 border-0 small fw-black text-muted text-uppercase tracking-widest py-3 text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of filtrados" class="transition-all hover-lift">
                <td class="ps-4">
                  <div class="d-flex align-items-center gap-3">
                    <div class="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-3 w-10 h-10 fw-black shadow-sm">
                      {{ p.nombreCompleto.charAt(0) }}
                    </div>
                    <div>
                      <div class="fw-bold text-dark">{{ p.nombreCompleto }}</div>
                      <div class="text-muted small">ID: {{ p.idP }}</div>
                    </div>
                  </div>
                </td>
                <td><span class="badge bg-light text-dark fw-bold border">{{ p.docIden }}</span></td>
                <td>
                  <div class="small fw-bold text-dark">{{ p.telefono || 'Sin teléfono' }}</div>
                  <div class="text-muted small">{{ p.email || 'Sin correo' }}</div>
                </td>
                <td class="small text-muted">{{ p.direccion || 'Sin dirección' }}</td>
                <td class="pe-4 text-end">
                  <div class="d-flex justify-content-end gap-2">
                    <button class="btn btn-light btn-sm rounded-3 p-2 text-primary border" (click)="editar(p)" title="Editar">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-light btn-sm rounded-3 p-2 text-danger border" (click)="eliminar(p)" title="Eliminar">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                    <a [routerLink]="['/odontograma']" [queryParams]="{pacienteId: p.idPersona || p.idP}" class="btn btn-light btn-sm rounded-3 p-2 text-info border" title="Odontograma">
                      <i class="fas fa-tooth"></i>
                    </a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="!filtrados.length" class="p-5 text-center text-muted fw-bold">
            <i class="fas fa-user-slash fa-3x mb-3 opacity-25"></i>
            <p>No se encontraron pacientes registrados.</p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class PacientesPageComponent implements OnDestroy {
  form: Paciente = { docIden: '', nombreCompleto: '' };
  msg = ''; loading = false;
  pacientes: Paciente[] = [];
  filtrados: Paciente[] = [];
  filtro = '';
  editingId: number | null = null;
  docMsg = '';
  docChecking = false;
  docValid: boolean | null = null;
  private docInput$ = new Subject<string>();
  private docSub?: Subscription;
  emailMsg = '';
  emailValid: boolean | null = null;
  private emailInput$ = new Subject<string>();
  private emailSub?: Subscription;

  constructor(private api: ApiService, private router: Router) {
    this.cargar();
    this.docSub = this.docInput$.pipe(debounceTime(300), distinctUntilChanged()).subscribe(v => this.verificarDocDebounced(v));
    this.emailSub = this.emailInput$.pipe(debounceTime(300), distinctUntilChanged()).subscribe(v => this.verificarEmailDebounced(v));
  }

  guardar() {
    if (!this.form.docIden || !this.form.nombreCompleto) { this.msg = 'Documento y Nombre son obligatorios.'; return; }
    this.loading = true; this.msg = '';

    if (this.editingId) {
        this.api.put<Paciente>(`/pacientes/${this.editingId}`, this.form).subscribe({
            next: (p) => { this.msg = 'Paciente actualizado'; this.loading = false; this.cancelarEdicion(); this.cargar(); },
            error: (err) => { this.handleError(err); this.loading = false; }
        });
    } else {
        this.api.get<{exists: boolean}>(`/pacientes/exists/${encodeURIComponent(this.form.docIden)}`).subscribe({
            next: (res) => {
                if (res.exists) {
                    this.msg = 'Documento de identidad ya registrado';
                    this.loading = false;
                } else {
                    this.api.post<Paciente>('/pacientes', this.form).subscribe({
                        next: (p) => { this.msg = 'Paciente registrado (ID ' + (p.idP||p.idPersona||'N/A') + ')'; this.loading = false; this.cargar(); this.form = { docIden: '', nombreCompleto: '' }; },
                        error: (err) => { this.handleError(err); this.loading = false; }
                    });
                }
            },
            error: (err) => { this.handleError(err); this.loading = false; }
        });
    }
  }

  handleError(err: any) {
    const status = err?.status;
    const txt = (typeof err?.error === 'string') ? err.error : (err?.error?.message || JSON.stringify(err?.error||{}));
    if (status === 409 || (txt && txt.toLowerCase().includes('documento de identidad ya registrado'))) {
        this.msg = 'Documento de identidad ya registrado';
    } else if (status === 400) {
        this.msg = 'Solicitud inválida: ' + txt;
    } else if (status === 404) {
        this.msg = 'Recurso no encontrado';
    } else {
        this.msg = 'Error procesando solicitud';
    }
  }

  editar(p: Paciente) {
    this.editingId = p.idPersona || p.idP || null;
    this.form = { ...p };
    this.docValid = true; 
    this.emailValid = true;
    this.msg = '';
  }

  cancelarEdicion() {
    this.editingId = null;
    this.form = { docIden: '', nombreCompleto: '' };
    this.docValid = null;
    this.emailValid = null;
    this.msg = '';
  }

  eliminar(p: Paciente) {
    if (!confirm('¿Estás seguro de eliminar a ' + p.nombreCompleto + '?')) return;
    const id = p.idPersona || p.idP;
    if (!id) return;
    this.loading = true;
    this.api.delete(`/pacientes/${id}`).subscribe({
        next: () => { this.msg = 'Paciente eliminado'; this.loading = false; this.cargar(); },
        error: () => { this.msg = 'Error eliminando paciente'; this.loading = false; }
    });
  }

  cargar() {
    this.loading = true;
    this.api.get<Paciente[]>('/pacientes').subscribe({
      next: (lista) => { this.pacientes = lista; this.aplicarFiltro(); this.loading = false; },
      error: () => { this.msg = 'Error cargando pacientes'; this.loading = false; }
    });
  }

  aplicarFiltro() {
    const t = (this.filtro||'').toLowerCase();
    this.filtrados = this.pacientes.filter(p => (
      (p.docIden||'').toLowerCase().includes(t) || (p.nombreCompleto||'').toLowerCase().includes(t)
    ));
  }

  verificarDoc() {
    const d = (this.form.docIden||'').trim();
    if (!d) { this.docMsg = ''; this.docValid = null; return; }
    this.docChecking = true; this.docMsg = '';
    this.api.get<{exists: boolean}>(`/pacientes/exists/${encodeURIComponent(d)}`).subscribe({
      next: (res) => { 
          if (res.exists) {
              this.docMsg = 'Documento de identidad ya registrado'; 
              this.docValid = false; 
          } else {
              this.docMsg = 'Documento disponible'; 
              this.docValid = true; 
          }
          this.docChecking = false; 
      },
      error: () => { this.docMsg = 'Error verificando documento'; this.docValid = null; this.docChecking = false; }
    });
  }

  docInputChanged(v: string) { this.docInput$.next((v||'').trim()); }

  verificarDocDebounced(d: string) {
    if (!d) { this.docMsg = ''; this.docValid = null; return; }
    this.docChecking = true; this.docMsg = '';
    this.api.get<{exists: boolean}>(`/pacientes/exists/${encodeURIComponent(d)}`).subscribe({
      next: (res) => { 
          if (res.exists) {
              this.docMsg = 'Documento de identidad ya registrado'; 
              this.docValid = false; 
          } else {
              this.docMsg = 'Documento disponible'; 
              this.docValid = true; 
          }
          this.docChecking = false; 
      },
      error: () => { this.docMsg = 'Error verificando documento'; this.docValid = null; this.docChecking = false; }
    });
  }

  ngOnDestroy() { try { this.docSub?.unsubscribe(); } catch {} }
  emailChanged(v: string) { this.emailInput$.next((v||'').trim()); }
  verificarEmailDebounced(v: string) {
    const e = (v||'').trim();
    if (!e) { this.emailMsg = ''; this.emailValid = null; return; }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (regex.test(e)) { this.emailMsg = 'Email válido'; this.emailValid = true; }
    else { this.emailMsg = 'Email inválido'; this.emailValid = false; }
  }
}
