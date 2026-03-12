import { Component, AfterViewInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './servicios.component.html'
})
export class ServiciosComponent implements AfterViewInit {
  isBookingOpen = signal(false);

  async ngAfterViewInit() {
    const form = document.getElementById('citaForm') as HTMLFormElement | null;
    const toggleBtn = document.getElementById('toggleBooking') as HTMLButtonElement | null;
    const bookingContainer = document.getElementById('bookingContainer') as HTMLElement | null;
    const servicioSelect = document.getElementById('servicioSelect') as HTMLSelectElement | null;
    const categoriaSelect = document.getElementById('categoriaSelect') as HTMLSelectElement | null;
    const medicoSelect = document.getElementById('medicoSelect') as HTMLSelectElement | null;
    const fechaInput = document.getElementById('citaFecha') as HTMLInputElement | null;
    const horaInput = document.getElementById('citaHora') as HTMLInputElement | null;
    const msg = document.getElementById('citaMsg');
    const booking = document.querySelector('.booking-section') as HTMLElement | null;
    const searchInput = document.getElementById('serviceSearch') as HTMLInputElement | null;
    const precioContainer = document.getElementById('precioContainer') as HTMLElement | null;
    const precioDisplay = document.getElementById('servicioPrecio') as HTMLElement | null;
    const nameToId: Record<string, number> = {};
    const typeToFirstId: Record<string, number> = {};
    let serviciosCache: any[] = [];
    const medicoAvail: Record<string, { inicio?: string; fin?: string; dias?: string }> = {};
    const tiposDisponibles = new Set<string>();
    if (medicoSelect) medicoSelect.innerHTML = '<option value="">Cualquier médico disponible</option>';

    // Simulación de tarifas para los servicios
    const getTarifa = (nombre: string) => {
      const n = nombre.toLowerCase();
      if (n.includes('limpieza')) return 85000;
      if (n.includes('ortodoncia')) return 1500000;
      if (n.includes('blanqueamiento')) return 350000;
      if (n.includes('terapia') || n.includes('consulta')) return 120000;
      if (n.includes('cirugía')) return 800000;
      if (n.includes('implante')) return 2500000;
      return 100000; // Tarifa base
    };

    const formatMoney = (amount: number) => {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      }).format(amount);
    };

    const filterServices = () => {
      const term = searchInput?.value.toLowerCase() || '';
      renderServicios(categoriaSelect?.value || '', term);
      renderCards(term);
    };

    const renderCards = (term: string = '') => {
      const odontoList = document.getElementById('odontologia-list');
      const psicoList = document.getElementById('psicologia-list');
      
      if (!odontoList || !psicoList) return;

      // Servicios psicológicos predeterminados si el backend no devuelve suficientes
      const defaultPsico = [
        { idServicio: 101, nombre: 'Terapia Individual', descripcion: 'Espacio de acompañamiento personal para superar desafíos emocionales.', tipoServicio: { nombre: 'Psicologia' } },
        { idServicio: 102, nombre: 'Terapia de Pareja', descripcion: 'Mejora la comunicación y resuelve conflictos en tu relación.', tipoServicio: { nombre: 'Psicologia' } },
        { idServicio: 103, nombre: 'Psicología Infantil', descripcion: 'Atención especializada para el desarrollo emocional de los niños.', tipoServicio: { nombre: 'Psicologia' } },
        { idServicio: 104, nombre: 'Evaluación Cognitiva', descripcion: 'Pruebas especializadas para medir funciones mentales superiores.', tipoServicio: { nombre: 'Psicologia' } },
        { idServicio: 105, nombre: 'Terapia de Ansiedad', descripcion: 'Herramientas para gestionar el estrés y los ataques de pánico.', tipoServicio: { nombre: 'Psicologia' } }
      ];

      const allServices = [...serviciosCache];
      // Si no hay servicios de psicología, agregar los predeterminados
      if (!allServices.some(s => {
        const cat = (s?.tipoServicio?.nombre || '').toLowerCase();
        return cat === 'psicologia' || cat === 'psicología';
      })) {
        allServices.push(...defaultPsico);
      }

      const odontoItems = allServices.filter(s => {
        const cat = s?.tipoServicio?.nombre || '';
        const name = (s.nombre || '').toLowerCase();
        const matchesCat = cat === 'Odontología' || cat.includes('Odonto');
        return matchesCat && name.includes(term);
      });

      const psicoItems = allServices.filter(s => {
        const cat = s?.tipoServicio?.nombre || '';
        const name = (s.nombre || '').toLowerCase();
        const matchesCat = cat.toLowerCase() === 'psicologia' || cat.toLowerCase() === 'psicología' || cat.toLowerCase().includes('psico');
        return matchesCat && name.includes(term);
      });

      const createCard = (s: any) => {
        const tarifa = getTarifa(s.nombre);
        const icon = (s.tipoServicio?.nombre || '').toLowerCase().includes('odonto') ? 'fa-tooth' : 'fa-brain';
        return `
          <div class="col-md-4 col-lg-3">
            <div class="card h-100 border-0 shadow-sm rounded-5 p-4 hover-lift transition-all animate-reveal bg-white border border-light">
              <div class="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-4 w-14 h-14 mb-4 border border-primary border-opacity-10 shadow-sm">
                <i class="fas ${icon} fa-xl"></i>
              </div>
              <h3 class="h5 fw-black text-slate-900 mb-2">${s.nombre}</h3>
              <div class="d-flex align-items-center gap-2 mb-3">
                <span class="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 fw-black small">${formatMoney(tarifa)}</span>
              </div>
              <p class="text-slate-500 small mb-4 lh-base">${s.descripcion || 'Servicio profesional especializado con los más altos estándares de calidad.'}</p>
              <button class="btn btn-outline-primary w-100 rounded-4 py-2-5 fw-black btn-agendar-card border-2" data-id="${s.idServicio}" data-name="${s.nombre}" data-cat="${s.tipoServicio?.nombre}">
                Agendar Cita <i class="fas fa-chevron-right ms-2 small"></i>
              </button>
            </div>
          </div>
        `;
      };

      odontoList.innerHTML = odontoItems.map(createCard).join('') || '<div class="col-12 text-center text-muted">No se encontraron servicios de odontología.</div>';
      psicoList.innerHTML = psicoItems.map(createCard).join('') || '<div class="col-12 text-center text-muted">No se encontraron servicios de psicología.</div>';

      // Re-asignar eventos a los nuevos botones
      document.querySelectorAll('.btn-agendar-card').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const id = btn.getAttribute('data-id');
          const cat = btn.getAttribute('data-cat');
          
          if (bookingContainer) {
            // Verificar login
            if (localStorage.getItem('client_user') === null) {
              alert('Debes iniciar sesión para agendar una cita.');
              window.location.href = '/auth';
              return;
            }

            this.isBookingOpen.set(true);
            if (categoriaSelect) {
              const isOdonto = (cat === 'Odontología' || cat?.toLowerCase().includes('odonto'));
              categoriaSelect.value = isOdonto ? 'Odontología' : 'Psicologia';
              renderServicios(categoriaSelect.value);
            }
            if (servicioSelect && id) {
              setTimeout(() => {
                servicioSelect.value = id;
                updatePrice(id);
                fetchMedicosPorServicio(id);
              }, 100);
            }
            // Asegurar que el contenedor sea visible y hacer scroll
            setTimeout(() => {
              window.scrollTo({
                top: bookingContainer.offsetTop - 100,
                behavior: 'smooth'
              });
            }, 50);
          }
        });
      });
    };

    if (searchInput) {
      searchInput.addEventListener('input', filterServices);
      searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') filterServices();
      });
    }

    const updatePrice = (id: string) => {
      if (!precioContainer || !precioDisplay) return;
      const servicio = serviciosCache.find(s => String(s.idServicio) === id);
      if (servicio) {
        const tarifa = getTarifa(servicio.nombre || '');
        precioDisplay.textContent = formatMoney(tarifa);
        precioContainer.classList.remove('d-none');
      } else {
        precioContainer.classList.add('d-none');
      }
    };

    if (servicioSelect) {
      servicioSelect.addEventListener('change', () => {
        const id = servicioSelect.value;
        if (id) {
          fetchMedicosPorServicio(id);
          updatePrice(id);
        } else {
          if (medicoSelect) medicoSelect.innerHTML = '<option value="">Cualquier médico disponible</option>';
          if (precioContainer) precioContainer.classList.add('d-none');
        }
      });
    }

    if (bookingContainer) bookingContainer.classList.remove('open');
    if (toggleBtn && bookingContainer) {
      toggleBtn.addEventListener('click', () => {
        // Verificar login antes de abrir formulario
        if (localStorage.getItem('client_user') === null) {
          alert('Debes iniciar sesión para agendar una cita.');
          window.location.href = '/auth';
          return;
        }
        this.isBookingOpen.set(true);
        setTimeout(() => bookingContainer.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
      });
    }
    // Botones de las tarjetas para preseleccionar servicio
    document.querySelectorAll('.service-category .btn-outline-primary').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.card') as HTMLElement | null;
        const serviceName = card?.querySelector('h3')?.textContent?.trim() || '';
        const category = btn.closest('.service-category')?.id === 'odontologia' ? 'Odontología' : 'Psicologia';
        
        if (bookingContainer) {
          bookingContainer.classList.add('open');
          
          // 1. Seleccionar categoría
          if (categoriaSelect) {
            categoriaSelect.value = category;
            renderServicios(category);
          }
          
          // 2. Seleccionar servicio específico (si coincide por nombre)
          setTimeout(() => {
            if (servicioSelect) {
              const id = nameToId[serviceName.toLowerCase()];
              if (id) {
                servicioSelect.value = String(id);
                fetchMedicosPorServicio(String(id));
                updatePrice(String(id));
              }
            }
          }, 100);

          bookingContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    const renderServicios = (categoria: string, term: string = '') => {
      if (!servicioSelect) return;
      
      const defaultPsico = [
        { idServicio: 101, nombre: 'Terapia Individual', descripcion: 'Espacio de acompañamiento personal para superar desafíos emocionales.', tipoServicio: { nombre: 'Psicologia' } },
        { idServicio: 102, nombre: 'Terapia de Pareja', descripcion: 'Mejora la comunicación y resuelve conflictos en tu relación.', tipoServicio: { nombre: 'Psicologia' } },
        { idServicio: 103, nombre: 'Psicología Infantil', descripcion: 'Atención especializada para el desarrollo emocional de los niños.', tipoServicio: { nombre: 'Psicologia' } },
        { idServicio: 104, nombre: 'Evaluación Cognitiva', descripcion: 'Pruebas especializadas para medir funciones mentales superiores.', tipoServicio: { nombre: 'Psicologia' } },
        { idServicio: 105, nombre: 'Terapia de Ansiedad', descripcion: 'Herramientas para gestionar el estrés y los ataques de pánico.', tipoServicio: { nombre: 'Psicologia' } }
      ];

      const allServices = [...serviciosCache];
      if (!allServices.some(s => (s?.tipoServicio?.nombre || '').toLowerCase().includes('psico'))) {
        allServices.push(...defaultPsico);
      }

      const list = allServices
        .filter(s => {
          const sCat = s?.tipoServicio?.nombre || '';
          const sName = (s.nombre || '').toLowerCase();
          
          let matchesCat = true;
          if (categoria) {
            if (categoria === 'Odontología') matchesCat = sCat === 'Odontología' || sCat.includes('Odonto');
            else matchesCat = sCat.toLowerCase().includes('psico');
          }
          
          const matchesTerm = sName.includes(term.toLowerCase());
          
          return matchesCat && matchesTerm;
        })
        .slice()
        .sort((a, b) => {
          const an = (a.nombre || '').toString().toLowerCase();
          const bn = (b.nombre || '').toString().toLowerCase();
          return an.localeCompare(bn);
        });
      
      const current = servicioSelect.value || '';
      servicioSelect.innerHTML = '<option value="">Selecciona servicio</option>' + list.map(s => {
        const nombre = (s.nombre || s.idServicio + '').toString();
        const tarifa = formatMoney(getTarifa(nombre));
        return `<option value="${s.idServicio}">${nombre} - ${tarifa}</option>`;
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
            const baseOpts = ['<option value="">Todos</option>', '<option value="Odontología">Odontología</option>', '<option value="Psicologia">Psicología</option>'];
            categoriaSelect.innerHTML = baseOpts.join('');
            categoriaSelect.value = actual;
          }
          renderServicios(categoriaSelect?.value || '');
          renderCards();
        }
          // Quitar este bloque duplicado
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
      // Auto-completar datos si el usuario está logueado
      const fillUserData = () => {
        const raw = localStorage.getItem('client_user');
        if (raw) {
          try {
            const user = JSON.parse(raw);
            const nameInput = document.getElementById('pacienteNombre') as HTMLInputElement;
            const emailInput = document.getElementById('pacienteEmail') as HTMLInputElement;
            const docInput = document.getElementById('pacienteDoc') as HTMLInputElement;
            
            if (nameInput) nameInput.value = user.nombreCompleto || '';
            if (emailInput) emailInput.value = user.email || '';
            if (docInput) docInput.value = user.docIden || '';
          } catch {}
        }
      };
      
      fillUserData();

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
            // Simular proceso de cobro antes de confirmar
            const servicio = serviciosCache.find(s => String(s.idServicio) === servicioId);
            const tarifa = getTarifa(servicio?.nombre || '');
            
            if (msg) {
              msg.classList.remove('d-none', 'alert-danger');
              msg.classList.add('alert-success');
              msg.innerHTML = `
                <div class="d-flex flex-column gap-2">
                  <div class="d-flex align-items-center justify-content-center gap-2">
                    <i class="fas fa-check-circle"></i>
                    <span>Cita pre-registrada con éxito.</span>
                  </div>
                  <div class="small bg-white bg-opacity-25 p-2 rounded">
                    <strong>Total a pagar en clínica:</strong> ${formatMoney(tarifa)}
                  </div>
                  <div class="x-small">Un médico confirmará la disponibilidad pronto.</div>
                </div>
              `;
            }
            form.reset();
            if (precioContainer) precioContainer.classList.add('d-none');
            setTimeout(() => {
              this.isBookingOpen.set(false);
              if (msg) msg.classList.add('d-none');
            }, 5000);
          } else {
            if (msg) {
              msg.classList.remove('d-none', 'alert-success');
              msg.classList.add('alert-danger');
              msg.textContent = (cita?.message || 'Error registrando cita');
            }
          }
        } catch {
          if (msg) msg.textContent = 'Backend no disponible, intenta nuevamente en unos segundos';
        }
      });
    }
  }
}
