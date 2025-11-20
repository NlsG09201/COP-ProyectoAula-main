import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-testimonios',
  standalone: true,
  templateUrl: './testimonios.component.html'
})
export class TestimoniosComponent implements AfterViewInit {
  ngAfterViewInit() {
    this.cargarTestimonios();
    const form = document.getElementById('formTestimonio') as HTMLFormElement | null;
    const respuesta = document.getElementById('respuesta');
    const stars = Array.from(document.querySelectorAll('#rating-stars i')) as HTMLElement[];
    const ratingText = document.getElementById('rating-text');
    const calificacionInput = document.getElementById('calificacion') as HTMLInputElement | null;
    let currentRating = calificacionInput ? parseInt(calificacionInput.value) || 5 : 5;
    const updateStars = (rating: number) => {
      stars.forEach((star, index) => {
        star.classList.toggle('text-yellow-500', index < rating);
        star.classList.toggle('text-gray-300', index >= rating);
      });
      if (ratingText) {
        const texts: Record<number, string> = {1:'Muy malo',2:'Malo',3:'Regular',4:'Bueno',5:'Excelente'};
        ratingText.textContent = texts[rating] || 'Selecciona tu calificación';
      }
    };
    stars.forEach((star, index) => {
      star.addEventListener('click', (e) => {
        e.preventDefault();
        currentRating = index + 1;
        updateStars(currentRating);
        if (calificacionInput) calificacionInput.value = String(currentRating);
      });
    });
    updateStars(currentRating);
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = (document.getElementById('testimonial-nombre') as HTMLInputElement)?.value || '';
        const comentario = (document.getElementById('testimonial-texto') as HTMLTextAreaElement)?.value || '';
        const calificacionVal = (document.getElementById('calificacion') as HTMLInputElement)?.value || '5';
        const body = { nombre, comentario, calificacion: Number(calificacionVal) };
        try {
          const res = await fetch('/api/testimonios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });
          const data = await res.json();
          if (res.ok) {
            if (respuesta) respuesta.innerHTML = `<div class="text-green-600 font-semibold mt-2 p-3 bg-green-50 rounded-lg border border-green-200">¡Testimonio enviado correctamente!</div>`;
            form.reset();
            currentRating = 5;
            updateStars(currentRating);
            if (calificacionInput) calificacionInput.value = String(currentRating);
            setTimeout(() => this.cargarTestimonios(), 800);
          } else {
            if (respuesta) respuesta.innerHTML = `<div class="text-red-600 font-semibold mt-2 p-3 bg-red-50 rounded-lg border border-red-200">Error: ${data?.message || 'No se pudo enviar el testimonio.'}</div>`;
          }
        } catch {
          if (respuesta) respuesta.innerHTML = `<div class="text-red-600 font-semibold mt-2 p-3 bg-red-50 rounded-lg border border-red-200">Ocurrió un error al enviar el testimonio.</div>`;
        }
      });
    }
  }

  cargarTestimonios() {
    const container = document.querySelector('.testimonials-grid .container');
    if (container) {
      let grid = container.querySelector('.grid');
      if (!grid) {
        grid = document.createElement('div');
        grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8';
        container.appendChild(grid);
      }
      grid.innerHTML = '<div class="col-span-full text-center text-gray-500 py-8"><p>Cargando testimonios...</p></div>';
    }
    fetch('/api/testimonios/ultimos')
      .then(res => res.json())
      .then(data => {
        if (!container) return;
        const grid = container.querySelector('.grid')!;
        grid.innerHTML = '';
        const testimonios = Array.isArray(data) ? data : [];
        if (testimonios.length === 0) {
          grid.innerHTML = '<div class="col-span-full text-center text-gray-500 py-8"><p>Aún no hay testimonios.</p></div>';
          return;
        }
        const header = document.createElement('div');
        header.className = 'col-span-full text-center mb-4';
        header.innerHTML = `<p class="text-gray-600">Total: ${testimonios.length} testimonio${testimonios.length !== 1 ? 's' : ''}</p>`;
        grid.appendChild(header);
        testimonios.forEach((t: any) => {
          const div = document.createElement('div');
          div.className = 'testimonial-card bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100';
          const imageSrc = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(t.nombre) + '&background=0891b2&color=fff&size=80';
          const fechaMostrar = t.fechaCreacion;
          div.innerHTML = `
            <div class="flex items-center mb-4">
              <img src="${imageSrc}" alt="${t.nombre}" class="rounded-full w-16 h-16 object-cover mr-4 shadow-sm border-2 border-blue-100" loading="lazy">
              <div>
                <p class="font-semibold text-lg text-gray-800">${t.nombre}</p>
                <div class="flex items-center space-x-1" title="${t.calificacion} de 5 estrellas">
                  ${this.generateStarsHtml(t.calificacion)}
                  <span class="text-sm text-gray-500 ml-2">(${t.calificacion}/5)</span>
                </div>
                <div class="text-xs text-gray-400 mt-1"><span class="fecha-absoluta">${fechaMostrar}</span></div>
              </div>
            </div>
            <p class="text-gray-700 italic leading-relaxed">"${t.comentario}"</p>
          `;
          grid.appendChild(div);
        });
      })
      .catch(() => {
        if (!container) return;
        const grid = container.querySelector('.grid')!;
        grid.innerHTML = '<div class="col-span-full text-center text-red-500 py-8"><p>Error al cargar testimonios.</p></div>';
      });
  }

  private generateStarsHtml(calificacion: number) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
      html += `<i class="fas fa-star ${i <= calificacion ? 'text-yellow-500' : 'text-gray-300'}"></i>`;
    }
    return html;
  }
}
