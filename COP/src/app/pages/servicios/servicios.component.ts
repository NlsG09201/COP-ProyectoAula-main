import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-servicios',
  standalone: true,
  templateUrl: './servicios.component.html'
})
export class ServiciosComponent implements AfterViewInit {
  ngAfterViewInit() {
    const form = document.getElementById('citaForm') as HTMLFormElement | null;
    const servicioSelect = document.getElementById('servicioSelect') as HTMLSelectElement | null;
    const medicoSelect = document.getElementById('medicoSelect') as HTMLSelectElement | null;
    const msg = document.getElementById('citaMsg');
    const booking = document.querySelector('.booking-section') as HTMLElement | null;
    const nameToId: Record<string, number> = {};
    fetch('/api/servicios')
      .then(r => r.json())
      .then((servicios: any[]) => {
        if (servicioSelect) {
          servicioSelect.innerHTML = '<option value="">Selecciona servicio</option>' + servicios.map(s => {
            const nombre = (s.tipoServicio?.nombre || s.idServicio + '').toString();
            nameToId[nombre.toLowerCase()] = s.idServicio;
            return `<option value="${s.idServicio}">${nombre}</option>`;
          }).join('');
        }
        document.querySelectorAll('.service-detail-card .btn-primary').forEach(btn => {
          btn.addEventListener('click', () => {
            const card = btn.closest('.service-detail-card');
            const name = card?.querySelector('h3')?.textContent?.trim().toLowerCase() || '';
            const id = nameToId[name];
            if (servicioSelect && id) servicioSelect.value = String(id);
            if (booking) { booking.classList.remove('hidden'); booking.scrollIntoView({ behavior: 'smooth' }); }
          });
        });
      }).catch(() => {});
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = (document.getElementById('pacienteNombre') as HTMLInputElement)?.value || '';
        const email = (document.getElementById('pacienteEmail') as HTMLInputElement)?.value || '';
        const telefono = (document.getElementById('pacienteTelefono') as HTMLInputElement)?.value || '';
        const direccionPaciente = (document.getElementById('pacienteDireccion') as HTMLInputElement)?.value || '';
        const docIden = (document.getElementById('pacienteDoc') as HTMLInputElement)?.value || '';
        const fecha = (document.getElementById('citaFecha') as HTMLInputElement)?.value || '';
        const hora = (document.getElementById('citaHora') as HTMLInputElement)?.value || '';
        const direccionCita = (document.getElementById('citaDireccion') as HTMLInputElement)?.value || 'Clínica COP';
        const servicioId = servicioSelect?.value || '';
        if (!nombre || !email || !fecha || !hora || !servicioId) { if (msg) msg.textContent = 'Completa los campos obligatorios'; return; }
        try {
          const pacienteRes = await fetch('/api/pacientes', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombreCompleto: nombre, email, telefono, direccion: direccionPaciente, docIden })
          });
          const paciente = await pacienteRes.json();
          if (!pacienteRes.ok) { if (msg) msg.textContent = 'Error creando paciente'; return; }
          const medicoId = medicoSelect?.value || '';
          const body: any = {
            fecha, hora, direccion: direccionCita,
            paciente: { idPersona: paciente.idPersona },
            servicio: { idServicio: Number(servicioId) }
          };
          if (medicoId) body.medico = { idPersona: Number(medicoId) };
          const citaRes = await fetch('/api/citas', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
          });
          const cita = await citaRes.json();
          if (citaRes.ok) {
            if (msg) msg.textContent = 'Cita registrada. Un médico confirmará por correo.';
            form.reset();
          } else {
            if (msg) msg.textContent = cita?.message || 'Error registrando cita';
          }
        } catch {
          if (msg) msg.textContent = 'Error de conexión al backend';
        }
      });
    }
  }
}

