import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

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
        <input type="number" [(ngModel)]="pacienteId" min="0" step="1" (ngModelChange)="validarId($event)" style="max-width:200px">
        <button class="btn secondary" (click)="cargarHistorial()" [disabled]="!pacienteId || pacienteId < 0">Ver historial</button>
      </div>
      <div *ngIf="pacienteId < 0" class="text-red-600 text-xs mt-1">El ID debe ser un número positivo.</div>
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
    <button class="btn secondary" style="margin-left:8px" (click)="guardar()" [disabled]="loading">{{ editandoId ? 'Actualizar registro' : 'Guardar registro' }}</button>
    <button *ngIf="editandoId" class="btn text-slate-600" style="margin-left:8px" (click)="cancelarEdicion()">Cancelar edición</button>

    <div *ngIf="msg" style="margin-top:10px">{{ msg }}</div>

    <div class="card" style="margin-top:16px" *ngIf="historial.length">
      <h3 class="text-xl font-semibold mb-2">Historial odontológico</h3>
      <div *ngFor="let h of historial; let i = index" class="mb-4 border-b pb-4">
        <div class="flex items-center justify-between mb-2">
          <div class="font-medium text-lg">Registro {{ historial.length - i }} — {{ h.o.fechaRegistro }} <span class="text-slate-500 text-sm">ID {{ h.o.idOdontograma }}</span></div>
          <div class="flex gap-2">
            <button class="text-blue-600 hover:underline text-sm" (click)="cargarParaEditar(h)">Editar</button>
            <button class="text-red-600 hover:underline text-sm" (click)="eliminar(h.o.idOdontograma)">Eliminar</button>
          </div>
        </div>
        <div class="text-slate-700 bg-slate-50 p-2 rounded my-2 italic">{{ h.o.observacionesGenerales || 'Sin observaciones generales' }}</div>
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
                <td class="px-3 py-2 font-bold">{{ d.diente?.codigoFDI }}</td>
                <td class="px-3 py-2">{{ d.diente?.nombre }}</td>
                <td class="px-3 py-2">
                  <span class="px-2 py-1 rounded text-xs font-semibold" 
                    [class.bg-green-100]="d.estado==='Sano'" [class.text-green-800]="d.estado==='Sano'"
                    [class.bg-red-100]="d.estado==='Cariado'||d.estado==='Fractura'" [class.text-red-800]="d.estado==='Cariado'||d.estado==='Fractura'"
                    [class.bg-blue-100]="d.estado==='Obturado'" [class.text-blue-800]="d.estado==='Obturado'"
                    [class.bg-gray-100]="d.estado==='Extracción'" [class.text-gray-800]="d.estado==='Extracción'">
                    {{ d.estado }}
                  </span>
                </td>
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
