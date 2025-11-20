import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-contacto',
  standalone: true,
  templateUrl: './contacto.component.html'
})
export class ContactoComponent implements AfterViewInit {
  ngAfterViewInit() {
    const form = document.getElementById('contactForm') as HTMLFormElement | null;
    const formMessage = document.getElementById('formMessage');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        try {
          const response = await fetch('guardar_contacto.php', { method: 'POST', body: formData });
          const result = await response.json();
          if (formMessage) {
            formMessage.textContent = result.message || '';
            formMessage.className = response.ok ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold';
          }
          if (response.ok) form.reset();
        } catch {
          if (formMessage) {
            formMessage.textContent = 'Error al enviar el mensaje.';
            formMessage.className = 'text-red-600 font-semibold';
          }
        }
      });
    }
  }
}

