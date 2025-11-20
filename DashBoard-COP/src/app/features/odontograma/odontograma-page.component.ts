import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

interface Diente { idDiente: number; codigoFDI: string; nombre: string; }
interface PiezaSel { diente: Diente; seleccionada: boolean; estado?: string; observacion?: string; }

@Component({
  standalone: true,
  selector: 'app-odontograma-page',
  imports: [CommonModule, FormsModule],
  styles: [`
    .grid { display:grid; grid-template-columns: repeat(16, 36px); gap:8px; justify-content:center; }
    .pieza { width:36px; height:36px; border-radius:8px; display:flex; align-items:center; justify-content:center; cursor:pointer; border:1px solid #cbd5e1; }
    .pieza.selected { background:#fde68a; border-color:#f59e0b; }
    .row { margin: 14px 0; }
  `],
  template: `
    <h2 class="text-2xl font-semibold mb-2">Odontograma</h2>
    <p class="text-slate-600 mb-4">Selecciona dientes (FDI) y registra condición/notas para el paciente.</p>

    <div class="field"><label>Paciente ID</label><input type="number" [(ngModel)]="pacienteId"></div>
    <div class="field"><label>Fecha</label><input type="date" [(ngModel)]="fecha"></div>
    <div class="field"><label>Observaciones generales</label><textarea [(ngModel)]="observaciones"></textarea></div>

    <div class="row">
      <div class="grid">
        <div *ngFor="let p of superiores" (click)="toggle(p)" class="pieza" [class.selected]="p.seleccionada">{{ p.diente.codigoFDI }}</div>
      </div>
    </div>
    <div class="row">
      <div class="grid">
        <div *ngFor="let p of inferiores" (click)="toggle(p)" class="pieza" [class.selected]="p.seleccionada">{{ p.diente.codigoFDI }}</div>
      </div>
    </div>

    <div class="field"><label>Estado</label>
      <select [(ngModel)]="estado">
        <option value="Sano">Sano</option>
        <option value="Cariado">Cariado</option>
        <option value="Obturado">Obturado</option>
        <option value="Extracción">Extracción</option>
        <option value="Fractura">Fractura</option>
      </select>
    </div>
    <div class="field"><label>Observación</label><textarea [(ngModel)]="observacion"></textarea></div>
    <button class="btn" (click)="aplicarASeleccion()">Aplicar a seleccionados</button>
    <button class="btn secondary" style="margin-left:8px" (click)="guardar()" [disabled]="loading">Guardar registro</button>

    <div *ngIf="msg" style="margin-top:10px">{{ msg }}</div>
  `,
})
export class OdontogramaPageComponent {
  superiores: PiezaSel[] = [];
  inferiores: PiezaSel[] = [];
  estado = 'Sano';
  observacion = '';
  pacienteId = 0;
  fecha = '';
  observaciones = '';
  loading = false; msg = '';

  constructor(private api: ApiService) { this.cargarDientes(); }

  toggle(p: PiezaSel) { p.seleccionada = !p.seleccionada; }
  aplicarASeleccion() {
    [...this.superiores, ...this.inferiores].forEach(p => { if (p.seleccionada) { p.estado = this.estado; p.observacion = this.observacion; } });
  }

  guardar() {
    if (!this.pacienteId || !this.fecha) { this.msg = 'Paciente y fecha son obligatorios.'; return; }
    const seleccionadas: PiezaSel[] = [...this.superiores, ...this.inferiores].filter(p => p.estado);
    if (!seleccionadas.length) { this.msg = 'Selecciona al menos un diente con estado.'; return; }
    this.loading = true; this.msg = '';
    const odontogramaBody = {
      fechaRegistro: this.fecha,
      observacionesGenerales: this.observaciones,
      paciente: { idP: this.pacienteId }
    };
    this.api.post<any>('/odontogramas', odontogramaBody).subscribe({
      next: (od) => {
        const idO = od?.idOdontograma;
        if (!idO) { this.msg = 'Odontograma creado sin ID'; this.loading = false; return; }
        // Crear detalles por cada pieza seleccionada
        const requests = seleccionadas.map(sel => {
          const body = {
            odontograma: { idOdontograma: idO },
            diente: { idDiente: sel.diente.idDiente },
            estado: sel.estado,
            observacion: sel.observacion || ''
          };
          return this.api.post<any>('/detalles-odontograma', body);
        });
        let completadas = 0;
        requests.forEach(r => r.subscribe({
          next: () => { completadas++; if (completadas === requests.length) { this.msg = 'Odontograma guardado con detalles'; this.loading = false; } },
          error: () => { this.msg = 'Error guardando algunos detalles'; this.loading = false; }
        }));
      },
      error: () => { this.msg = 'Error creando odontograma'; this.loading = false; }
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
}