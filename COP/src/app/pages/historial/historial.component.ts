import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ConsultaIA {
  idConsulta: number;
  agente: string;
  pregunta: string;
  respuesta: string;
  fechaHora: string;
}

interface RegistroCobro {
  idRegistro: number;
  tipoServicio: string;
  monto: number;
  fechaHora: string;
  estadoPago: string;
}

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial.component.html'
})
export class HistorialComponent {
  loading = true;
  error = '';
  consultas: ConsultaIA[] = [];
  cobros: RegistroCobro[] = [];

  async ngOnInit() {
    const raw = localStorage.getItem('client_user');
    if (!raw) {
      this.error = 'Debes iniciar sesión para ver tu historial.';
      this.loading = false;
      return;
    }
    let user: any;
    try {
      user = JSON.parse(raw);
    } catch {
      this.error = 'Sesión inválida. Vuelve a iniciar sesión.';
      this.loading = false;
      return;
    }
    const username = user?.username;
    if (!username) {
      this.error = 'No se encontró el usuario en la sesión.';
      this.loading = false;
      return;
    }
    try {
      const resp = await fetch(`/api/billing/historial?clienteUsername=${encodeURIComponent(username)}`);
      if (!resp.ok) {
        this.error = 'No se pudo cargar el historial.';
        this.loading = false;
        return;
      }
      const data = await resp.json();
      this.consultas = (data.consultas || []) as ConsultaIA[];
      this.cobros = (data.cobros || []) as RegistroCobro[];
    } catch {
      this.error = 'Error de red al cargar el historial.';
    } finally {
      this.loading = false;
    }
  }
}

