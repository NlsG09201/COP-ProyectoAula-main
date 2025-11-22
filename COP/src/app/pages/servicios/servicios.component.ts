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
    const fechaInput = document.getElementById('citaFecha') as HTMLInputElement | null;
    const horaInput = document.getElementById('citaHora') as HTMLInputElement | null;
    const msg = document.getElementById('citaMsg');
    const booking = document.querySelector('.booking-section') as HTMLElement | null;
    const nameToId: Record<string, number> = {};
    const typeToFirstId: Record<string, number> = {};
    let serviciosCache: any[] = [];
    if (medicoSelect) medicoSelect.innerHTML = '<option value="">Cualquier médico disponible</option>';
    const medicoAvail: Record<string, { inicio?: string; fin?: string; dias?: string }> = {};
    const tiposDisponibles = new Set<string>();
    const renderServicios = (categoria: string) => {
      if (!servicioSelect) return;
      const odontoGroup = [
        'Odontología General',
        'Ortodoncia',
        'Estética Dental',
        'Implantes Dentales'
      ];
      const permitidos = (cat: string) => {
        if (!cat) return null; // null => todos
        if (cat === 'Odontología') return new Set(odontoGroup);
        return new Set([cat]);
      };
      const allowed = permitidos(categoria);
      const list = serviciosCache
        .filter(s => !allowed || allowed.has(String(s?.tipoServicio?.nombre || '')))
        .slice()
        .sort((a, b) => {
          const an = (a.nombre || '').toString().toLowerCase();
          const bn = (b.nombre || '').toString().toLowerCase();
          return an.localeCompare(bn);
        });
      const current = servicioSelect.value || '';
      servicioSelect.innerHTML = '<option value="">Selecciona servicio</option>' + list.map(s => {
        const nombre = (s.nombre || s.idServicio + '').toString();
        return `<option value="${s.idServicio}">${nombre}</option>`;
      }).join('');
      if (current && Array.from(servicioSelect.options).some(o => o.value === current)) {
        servicioSelect.value = current;
      }
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
              const nombre = (s.nombre || s.idServicio + '').toString();
              nameToId[nombre.toLowerCase()] = s.idServicio;
              if (s?.tipoServicio?.nombre) tiposDisponibles.add(String(s.tipoServicio.nombre));
              const t = String(s?.tipoServicio?.nombre || '');
              if (t && typeToFirstId[t] == null) typeToFirstId[t] = s.idServicio;
            });
          if (categoriaSelect) {
            const actual = categoriaSelect.value || '';
            const baseOpts = ['<option value="">Todos</option>', '<option value="Odontología">Odontología</option>'];
            const typeOpts = Array.from(tiposDisponibles).sort().map(t => `<option value="${t}">${t}</option>`);
            const opts = [...baseOpts, ...typeOpts];
            categoriaSelect.innerHTML = opts.join('');
            const hasActual = opts.some(o => o.includes(`value="${actual}"`));
            categoriaSelect.value = hasActual ? actual : '';
          }
          renderServicios(categoriaSelect?.value || '');
        }
          document.querySelectorAll('.service-detail-card .btn-primary').forEach(btn => {
            btn.addEventListener('click', () => {
              const card = btn.closest('.service-detail-card');
              const name = card?.querySelector('h3')?.textContent?.trim() || '';
              const id = typeToFirstId[name] || nameToId[name.toLowerCase()];
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
          medicoSelect.innerHTML = '<option value="">Cualquier médico disponible</option>' + medicos.map(m => {
            medicoAvail[String(m.idPersona)] = {
              inicio: m.horaInicioDisponibilidad || undefined,
              fin: m.horaFinDisponibilidad || undefined,
              dias: m.diasDisponibles || ''
            };
            return `<option value="${m.idPersona}">${m.nombreCompleto}</option>`;
          }).join('');
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

    const dayName = (d: Date) => ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'][d.getDay()===0?6:d.getDay()-1];
    const applyMedicoRules = () => {
      if (!horaInput || !fechaInput) return;
      const id = medicoSelect?.value || '';
      const av = id ? medicoAvail[id] : undefined;
      if (av?.inicio) horaInput.min = av.inicio;
      else horaInput.removeAttribute('min');
      if (av?.fin) horaInput.max = av.fin;
      else horaInput.removeAttribute('max');
      const f = fechaInput.value ? new Date(fechaInput.value) : null;
      const dname = f ? dayName(f) : '';
      if (av?.dias && dname && !av.dias.includes(dname)) {
        if (msg) (msg as HTMLElement).textContent = 'El médico no atiende el día seleccionado';
      } else {
        if (msg) (msg as HTMLElement).textContent = '';
      }
    };
    if (medicoSelect) medicoSelect.addEventListener('change', applyMedicoRules);
    if (fechaInput) fechaInput.addEventListener('change', applyMedicoRules);
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
        const servicioId = servicioSelect?.value || '';
        if (!nombre || !email || !fecha || !hora || !servicioId) { if (msg) msg.textContent = 'Completa los campos obligatorios'; return; }
        try {
          let paciente: any = null;
          if (docIden) {
            try {
              const r = await fetch(`/api/pacientes/by-doc/${encodeURIComponent(docIden)}`);
              if (r.ok) paciente = await r.json();
            } catch {}
          }
          if (!paciente) {
            const pacienteRes = await fetch('/api/pacientes', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ nombreCompleto: nombre, email, telefono, direccion: direccionPaciente, docIden })
            });
            if (pacienteRes.ok) {
              paciente = await pacienteRes.json();
            } else {
              let serverMsg = '';
              try { const data = await pacienteRes.json(); serverMsg = (data?.message || '').toString(); } catch {}
              if (pacienteRes.status === 409 && docIden) {
                try {
                  const r2 = await fetch(`/api/pacientes/by-doc/${encodeURIComponent(docIden)}`);
                  if (r2.ok) paciente = await r2.json();
                } catch {}
                if (!paciente) { if (msg) msg.textContent = serverMsg || 'Documento de identidad ya registrado'; return; }
              } else {
                if (msg) msg.textContent = serverMsg || 'Error creando paciente';
                return;
              }
            }
          }
          const medicoId = medicoSelect?.value || '';
          const body: any = {
            fecha,
            hora: hora && hora.length === 5 ? `${hora}:00` : hora,
            direccion: direccionPaciente || 'Clínica COP',
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
            if (msg) msg.textContent = (cita?.message || 'Error registrando cita');
          }
        } catch {
          if (msg) msg.textContent = 'Backend no disponible, intenta nuevamente en unos segundos';
        }
      });
    }
  }
}
