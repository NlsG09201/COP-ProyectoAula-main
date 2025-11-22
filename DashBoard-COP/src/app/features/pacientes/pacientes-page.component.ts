import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

interface Paciente { idP?: number; idPersona?: number; docIden: string; nombreCompleto: string; telefono?: string; email?: string; direccion?: string; }

@Component({
  standalone: true,
  selector: 'app-pacientes-page',
  imports: [CommonModule, FormsModule],
  template: `
    <h2 class="text-2xl font-semibold mb-2">Pacientes</h2>
    <p class="text-slate-600 mb-4">Registra y administra pacientes.</p>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div class="field"><label>Documento</label><input [(ngModel)]="form.docIden" /></div>
      <div class="field"><label>Nombre</label><input [(ngModel)]="form.nombreCompleto" /></div>
      <div class="field"><label>Teléfono</label><input [(ngModel)]="form.telefono" /></div>
      <div class="field"><label>Email</label><input [(ngModel)]="form.email" /></div>
      <div class="field"><label>Dirección</label><input [(ngModel)]="form.direccion" /></div>
    </div>
    <button class="btn" (click)="guardar()" [disabled]="loading">Guardar</button>
    <div *ngIf="msg" class="mt-2">{{ msg }}</div>

    <h3 class="text-xl font-semibold mt-8 mb-2">Lista de pacientes</h3>
    <div class="field"><label>Buscar</label><input placeholder="Nombre/Documento" [(ngModel)]="filtro" (ngModelChange)="aplicarFiltro()" /></div>
    <div class="overflow-x-auto rounded-lg shadow">
      <table *ngIf="filtrados.length" class="min-w-full bg-white">
        <thead class="bg-blue-50"><tr>
          <th class="px-4 py-2 text-left">ID</th>
          <th class="px-4 py-2 text-left">Documento</th>
          <th class="px-4 py-2 text-left">Nombre</th>
          <th class="px-4 py-2 text-left">Teléfono</th>
          <th class="px-4 py-2 text-left">Email</th>
          <th class="px-4 py-2 text-left">Dirección</th>
        </tr></thead>
        <tbody>
          <tr *ngFor="let p of filtrados" class="border-t">
            <td class="px-4 py-2">{{ p.idP || p.idPersona }}</td>
            <td class="px-4 py-2">{{ p.docIden }}</td>
            <td class="px-4 py-2">{{ p.nombreCompleto }}</td>
            <td class="px-4 py-2">{{ p.telefono }}</td>
            <td class="px-4 py-2">{{ p.email }}</td>
            <td class="px-4 py-2">{{ p.direccion }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div *ngIf="!filtrados.length && !loading" class="mt-2">No hay pacientes registrados.</div>
  `,
})
export class PacientesPageComponent {
  form: Paciente = { docIden: '', nombreCompleto: '' };
  msg = ''; loading = false;
  pacientes: Paciente[] = [];
  filtrados: Paciente[] = [];
  filtro = '';

  constructor(private api: ApiService) { this.cargar(); }

  guardar() {
    if (!this.form.docIden || !this.form.nombreCompleto) { this.msg = 'Documento y Nombre son obligatorios.'; return; }
    this.loading = true; this.msg = '';
    this.api.get<any>(`/pacientes/by-doc/${encodeURIComponent(this.form.docIden)}`).subscribe({
      next: () => { this.msg = 'Documento de identidad ya registrado'; this.loading = false; },
      error: () => {
        this.api.post<Paciente>('/pacientes', this.form).subscribe({
          next: (p) => { this.msg = 'Paciente registrado (ID ' + (p.idP||p.idPersona||'N/A') + ')'; this.loading = false; this.cargar(); },
          error: (err) => {
            const txt = (typeof err?.error === 'string') ? err.error : JSON.stringify(err?.error||{});
            if (txt && txt.toLowerCase().includes('documento de identidad ya registrado')) {
              this.msg = 'Documento de identidad ya registrado';
            } else {
              this.msg = 'Error registrando paciente';
            }
            this.loading = false;
          }
        });
      }
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
}
