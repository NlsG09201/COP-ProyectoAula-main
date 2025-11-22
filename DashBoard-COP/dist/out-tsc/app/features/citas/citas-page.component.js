var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
let CitasPageComponent = class CitasPageComponent {
    constructor(api) {
        this.api = api;
        this.citas = [];
        this.citasFiltradas = [];
        this.loading = false;
        this.error = '';
        this.filtroDesde = '';
        this.filtroHasta = '';
        this.filtroTexto = '';
        this.medicos = [];
        this.selectedMedicoId = null;
        this.turnoMedicoId = null;
        this.horaInicio = '';
        this.horaFin = '';
        this.diasDisponibles = '';
        this.errorTurno = '';
        this.okTurno = '';
        this.load();
    }
    load() {
        this.loading = true;
        this.error = '';
        this.api.get('/citas').subscribe({
            next: (data) => { this.citas = data; this.citasFiltradas = [...data]; this.loading = false; },
            error: () => { this.error = 'Error cargando citas'; this.loading = false; }
        });
        this.api.get('/medicos').subscribe({ next: (m) => this.medicos = m, error: () => { } });
    }
    formatServicios(c) {
        return (c.servicios || [])
            .map((s) => s?.tipoServicio || s?.idServicio)
            .filter((v) => !!v)
            .join(', ');
    }
    aplicarFiltros() {
        const desde = this.filtroDesde ? new Date(this.filtroDesde) : null;
        const hasta = this.filtroHasta ? new Date(this.filtroHasta) : null;
        const txt = (this.filtroTexto || '').toLowerCase();
        this.citasFiltradas = this.citas.filter(c => {
            const fechaValida = (() => {
                if (!desde && !hasta)
                    return true;
                const f = new Date(c.fecha);
                if (desde && f < desde)
                    return false;
                if (hasta && f > hasta)
                    return false;
                return true;
            })();
            const textoValido = txt ? ((c.paciente?.nombreCompleto || '').toLowerCase().includes(txt) ||
                (c.medico?.nombreCompleto || '').toLowerCase().includes(txt) ||
                (c.direccion || '').toLowerCase().includes(txt)) : true;
            return fechaValida && textoValido;
        });
    }
    resetFiltros() { this.filtroDesde = this.filtroHasta = this.filtroTexto = ''; this.citasFiltradas = [...this.citas]; }
    ordenarPor(campo) {
        const parse = (v) => campo === 'fecha' ? new Date(v).getTime() : ('' + v);
        this.citasFiltradas.sort((a, b) => (parse(a[campo]) > parse(b[campo]) ? 1 : -1));
    }
    confirmar(id) {
        if (!id || !this.selectedMedicoId)
            return;
        this.api.post(`/citas/${id}/asignar?medicoId=${this.selectedMedicoId}&confirmar=true`, {}).subscribe({
            next: () => this.load(),
            error: () => this.error = 'Error confirmando la cita'
        });
    }
    guardarTurno() {
        this.errorTurno = '';
        this.okTurno = '';
        if (!this.turnoMedicoId) {
            this.errorTurno = 'Selecciona un médico';
            return;
        }
        const body = {
            horaInicioDisponibilidad: this.horaInicio ? this.horaInicio + ':00' : null,
            horaFinDisponibilidad: this.horaFin ? this.horaFin + ':00' : null,
            diasDisponibles: this.diasDisponibles || null
        };
        this.api.put(`/medicos/${this.turnoMedicoId}`, body).subscribe({
            next: () => { this.okTurno = 'Turno actualizado'; },
            error: () => { this.errorTurno = 'Error actualizando turno'; }
        });
    }
};
CitasPageComponent = __decorate([
    Component({
        standalone: true,
        selector: 'app-citas-page',
        imports: [CommonModule, FormsModule],
        template: `
    <h2 class="text-2xl font-semibold mb-2">Gestión de Citas</h2>
    <p class="text-slate-600 mb-4">Lista, filtra y organiza las citas agendadas.</p>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div class="field"><label>Desde</label><input type="date" [(ngModel)]="filtroDesde"></div>
      <div class="field"><label>Hasta</label><input type="date" [(ngModel)]="filtroHasta"></div>
      <div class="field"><label>Buscar por paciente / médico</label><input placeholder="Texto" [(ngModel)]="filtroTexto"></div>
    </div>
    
    <div class="flex gap-2 mb-4">
      <button class="btn" (click)="aplicarFiltros()">Aplicar filtros</button>
      <button class="btn secondary" (click)="resetFiltros()">Limpiar</button>
    </div>

    <div *ngIf="error" class="text-red-700 mb-2">{{ error }}</div>
    <div class="overflow-x-auto rounded-lg shadow">
      <table *ngIf="citasFiltradas.length" class="min-w-full bg-white">
        <thead class="bg-blue-50">
          <tr>
            <th class="px-4 py-2 text-left">ID</th>
            <th class="px-4 py-2 text-left cursor-pointer" (click)="ordenarPor('fecha')">Fecha</th>
            <th class="px-4 py-2 text-left cursor-pointer" (click)="ordenarPor('hora')">Hora</th>
            <th class="px-4 py-2 text-left">Paciente</th>
            <th class="px-4 py-2 text-left">Médico</th>
            <th class="px-4 py-2 text-left">Servicio(s)</th>
            <th class="px-4 py-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let c of citasFiltradas" class="border-t">
            <td class="px-4 py-2">{{ c.idCita }}</td>
            <td class="px-4 py-2">{{ c.fecha }}</td>
            <td class="px-4 py-2">{{ c.hora }}</td>
            <td class="px-4 py-2">{{ c.paciente?.nombreCompleto || c.paciente?.idP }}</td>
            <td class="px-4 py-2">{{ c.medico?.nombreCompleto || c.medico?.idMedico }}</td>
            <td class="px-4 py-2">{{ formatServicios(c) }}</td>
            <td class="px-4 py-2">
              <select [(ngModel)]="selectedMedicoId" class="border rounded px-2 py-1 mr-2">
                <option [ngValue]="null">Selecciona médico</option>
                <option *ngFor="let m of medicos" [ngValue]="m.idPersona">{{ m.nombreCompleto }}</option>
              </select>
              <button class="btn" (click)="confirmar(c.idCita)">Confirmar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div *ngIf="!citasFiltradas.length && !loading">No hay citas registradas.</div>

    <div class="mt-8">
      <h3 class="text-xl font-semibold mb-2">Gestión de Turnos de Médicos</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label>Médico</label>
          <select [(ngModel)]="turnoMedicoId" class="border rounded px-2 py-1">
            <option [ngValue]="null">Selecciona médico</option>
            <option *ngFor="let m of medicos" [ngValue]="m.idPersona">{{ m.nombreCompleto }}</option>
          </select>
        </div>
        <div>
          <label>Hora inicio</label>
          <input type="time" [(ngModel)]="horaInicio" class="border rounded px-2 py-1">
        </div>
        <div>
          <label>Hora fin</label>
          <input type="time" [(ngModel)]="horaFin" class="border rounded px-2 py-1">
        </div>
        <div>
          <label>Días (ej: MONDAY,TUESDAY)</label>
          <input placeholder="Días disponibles" [(ngModel)]="diasDisponibles" class="border rounded px-2 py-1">
        </div>
      </div>
      <button class="btn" (click)="guardarTurno()">Guardar turno</button>
      <div class="text-sm text-red-700 mt-2" *ngIf="errorTurno">{{ errorTurno }}</div>
      <div class="text-sm text-green-700 mt-2" *ngIf="okTurno">{{ okTurno }}</div>
    </div>
  `,
    })
], CitasPageComponent);
export { CitasPageComponent };
//# sourceMappingURL=citas-page.component.js.map