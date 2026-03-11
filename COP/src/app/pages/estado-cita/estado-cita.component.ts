import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estado-cita',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estado-cita.component.html'
})
export class EstadoCitaComponent {
  loading = true;
  error = '';
  cita: any = null;

  async ngOnInit() {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    const token = params.get('token');
    try {
      if (token) {
        const r = await fetch(`/api/citas/confirm?token=${encodeURIComponent(token)}`);
        if (r.ok) {
          this.cita = await r.json();
          this.loading = false;
          return;
        }
      }
      if (id) {
        const r = await fetch(`/api/citas/${encodeURIComponent(id)}`);
        if (r.ok) {
          this.cita = await r.json();
        } else {
          this.error = 'No se encontró la cita';
        }
      } else {
        this.error = 'Faltan parámetros (id o token)';
      }
    } catch {
      this.error = 'Error consultando el estado de la cita';
    } finally {
      this.loading = false;
    }
  }
}
