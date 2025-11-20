import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

interface Paciente { idP?: number; docIden: string; nombreCompleto: string; telefono?: string; email?: string; direccion?: string; }

@Component({
  standalone: true,
  selector: 'app-pacientes-page',
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Pacientes</h2>
    <p>Registra y administra pacientes.</p>

    <div class="field"><label>Documento</label><input [(ngModel)]="form.docIden" /></div>
    <div class="field"><label>Nombre</label><input [(ngModel)]="form.nombreCompleto" /></div>
    <div class="field"><label>Teléfono</label><input [(ngModel)]="form.telefono" /></div>
    <div class="field"><label>Email</label><input [(ngModel)]="form.email" /></div>
    <div class="field"><label>Dirección</label><input [(ngModel)]="form.direccion" /></div>
    <button class="btn" (click)="guardar()" [disabled]="loading">Guardar</button>

    <div *ngIf="msg" style="margin-top:10px">{{ msg }}</div>
  `,
})
export class PacientesPageComponent {
  form: Paciente = { docIden: '', nombreCompleto: '' };
  msg = ''; loading = false;

  constructor(private api: ApiService) {}

  guardar() {
    if (!this.form.docIden || !this.form.nombreCompleto) { this.msg = 'Documento y Nombre son obligatorios.'; return; }
    this.loading = true; this.msg = '';
    this.api.post<Paciente>('/pacientes', this.form).subscribe({
      next: (p) => { this.msg = 'Paciente registrado (ID ' + (p.idP||'N/A') + ')'; this.loading = false; },
      error: () => { this.msg = 'Error registrando paciente'; this.loading = false; }
    });
  }
}