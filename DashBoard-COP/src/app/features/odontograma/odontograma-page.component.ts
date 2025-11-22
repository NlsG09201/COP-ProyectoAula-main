import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { firstValueFrom } from 'rxjs';

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

    <div class="field"><label>Paciente ID</label>
      <div style="display:flex; gap:8px; align-items:center">
        <input type="number" [(ngModel)]="pacienteId" style="max-width:200px">
        <button class="btn secondary" (click)="cargarHistorial()" [disabled]="!pacienteId">Ver historial</button>
      </div>
    </div>
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

    <div class="card" style="margin-top:16px" *ngIf="historial.length">
      <h3 class="text-xl font-semibold mb-2">Historial odontológico</h3>
      <div *ngFor="let h of historial; let i = index" class="mb-4">
        <div class="font-medium">Registro {{ i+1 }} — {{ h.o.fechaRegistro }} <span class="text-slate-500">ID {{ h.o.idOdontograma }}</span></div>
        <div class="text-slate-600 mb-2">{{ h.o.observacionesGenerales || 'Sin observaciones' }}</div>
        <div class="overflow-x-auto rounded">
          <table class="min-w-full bg-white">
            <thead class="bg-blue-50">
              <tr>
                <th class="px-3 py-2 text-left">FDI</th>
                <th class="px-3 py-2 text-left">Nombre</th>
                <th class="px-3 py-2 text-left">Estado</th>
                <th class="px-3 py-2 text-left">Observación</th>
                <th class="px-3 py-2 text-left">Cambio</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let d of h.detalles" class="border-t">
                <td class="px-3 py-2">{{ d.diente?.codigoFDI }}</td>
                <td class="px-3 py-2">{{ d.diente?.nombre }}</td>
                <td class="px-3 py-2">{{ d.estado }}</td>
                <td class="px-3 py-2">{{ d.observacion || '—' }}</td>
                <td class="px-3 py-2">
                  <span [style.color]="d._cambio ? (d._cambio.includes('→') ? '#16a34a' : '#64748b') : '#64748b'">{{ d._cambio || '—' }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
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
  historial: { o: any, detalles: any[] }[] = [];

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
      paciente: { idPersona: this.pacienteId }
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
