import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-servicios',
  standalone: true,
  templateUrl: './servicios.component.html'
})
export class ServiciosComponent implements AfterViewInit {
  async ngAfterViewInit() {
    const form = document.getElementById('citaForm') as HTMLFormElement | null;
    const servicioSelect = document.getElementById('servicioSelect') as HTMLSelectElement | null;
    const categoriaSelect = document.getElementById('categoriaSelect') as HTMLSelectElement | null;
    const medicoSelect = document.getElementById('medicoSelect') as HTMLSelectElement | null;
    const msg = document.getElementById('citaMsg');
    const booking = document.querySelector('.booking-section') as HTMLElement | null;
    const nameToId: Record<string, number> = {};
    let serviciosCache: any[] = [];
    if (medicoSelect) medicoSelect.innerHTML = '<option value="">Cualquier médico disponible</option>';
    const categoriaDe = (nombre: string) => {
      const n = (nombre || '').toLowerCase();
      if (n.includes('psico') || n.includes('pareja') || n.includes('familiar') || n.includes('terapia')) return 'Psicologia';
      return 'Odontologia';
    };
    const renderServicios = (categoria: string) => {
      if (!servicioSelect) return;
      const list = serviciosCache
        .filter(s => !categoria || categoriaDe(s.tipoServicio?.nombre) === categoria)
        .slice()
        .sort((a, b) => {
          const an = (a.tipoServicio?.nombre || '').toString().toLowerCase();
          const bn = (b.tipoServicio?.nombre || '').toString().toLowerCase();
          return an.localeCompare(bn);
        });
      const current = servicioSelect.value || '';
      servicioSelect.innerHTML = '<option value="">Selecciona servicio</option>' + list.map(s => {
        const nombre = (s.tipoServicio?.nombre || s.idServicio + '').toString();
        return `<option value="${s.idServicio}">${nombre}</option>`;
      }).join('');
      if (current) servicioSelect.value = current;
    };
    const fetchServicios = async () => {
      let attempt = 0;
      while (attempt < 3) {
        try {
          const r = await fetch('/api/servicios');
          if (!r.ok) throw new Error(String(r.status));
          const servicios: any[] = await r.json();
          serviciosCache = servicios;
          if (servicioSelect) {
            servicios.forEach(s => {
              const nombre = (s.tipoServicio?.nombre || s.idServicio + '').toString();
              nameToId[nombre.toLowerCase()] = s.idServicio;
            });
            renderServicios(categoriaSelect?.value || '');
          }
          document.querySelectorAll('.service-detail-card .btn-primary').forEach(btn => {
            btn.addEventListener('click', () => {
              const card = btn.closest('.service-detail-card');
              const name = card?.querySelector('h3')?.textContent?.trim().toLowerCase() || '';
              const id = nameToId[name];
              if (servicioSelect && id) servicioSelect.value = String(id);
              if (servicioSelect && id) fetchMedicosPorServicio(String(id));
              if (booking) { booking.classList.remove('hidden'); booking.scrollIntoView({ behavior: 'smooth' }); }
            });
          });
          return;
        } catch {
          attempt++;
          if (msg) (msg as HTMLElement).textContent = 'Backend no disponible, reintentando...';
          await new Promise(r => setTimeout(r, 700 * attempt));
        }
      }
      if (msg) (msg as HTMLElement).textContent = 'No fue posible cargar servicios. Intenta nuevamente.';
    };
    await fetchServicios();
    if (categoriaSelect) categoriaSelect.addEventListener('change', () => renderServicios(categoriaSelect.value || ''));
    const fetchMedicosPorServicio = async (idServicio: string) => {
      if (!medicoSelect) return;
      medicoSelect.innerHTML = '<option value="">Cargando médicos...</option>';
      let attempt = 0;
      while (attempt < 3) {
        try {
          const r = await fetch(`/api/medicos/por-servicio/${idServicio}`);
          if (!r.ok) throw new Error(String(r.status));
          const medicos: any[] = await r.json();
          medicos.sort((a, b) => (a.nombreCompleto || '').localeCompare(b.nombreCompleto || ''));
          medicoSelect.innerHTML = '<option value="">Cualquier médico disponible</option>' + medicos.map(m => `<option value="${m.idPersona}">${m.nombreCompleto}</option>`).join('');
          return;
        } catch {
          attempt++;
          await new Promise(r => setTimeout(r, 700 * attempt));
        }
      }
      medicoSelect.innerHTML = '<option value="">Sin médicos disponibles</option>';
    };
    if (servicioSelect) servicioSelect.addEventListener('change', () => {
      const id = servicioSelect.value;
      if (id) fetchMedicosPorServicio(id);
      else if (medicoSelect) medicoSelect.innerHTML = '<option value="">Cualquier médico disponible</option>';
    });
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
          if (msg) msg.textContent = 'Backend no disponible, intenta nuevamente en unos segundos';
        }
      });
    }
  }
}
