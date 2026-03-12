import { Component, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './contacto.component.html'
})
export class ContactoComponent implements AfterViewInit {
  ngAfterViewInit() {
    const form = document.getElementById('contactForm') as HTMLFormElement | null;
    const formMessage = document.getElementById('formMessage');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = (document.getElementById('name') as HTMLInputElement)?.value || '';
        const email = (document.getElementById('email') as HTMLInputElement)?.value || '';
        const asunto = (document.getElementById('subject') as HTMLSelectElement)?.value || '';
        const mensaje = (document.getElementById('message') as HTMLTextAreaElement)?.value || '';
        
        const body = { nombre, email, asunto, mensaje };
        
        try {
          const response = await fetch('/api/contacto', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });
          const result = await response.json();
          if (formMessage) {
            formMessage.textContent = result.message || '';
            formMessage.className = response.ok ? 'text-green-600 font-semibold p-3 bg-green-50 rounded-lg border border-green-200 mt-4' : 'text-red-600 font-semibold p-3 bg-red-50 rounded-lg border border-red-200 mt-4';
          }
          if (response.ok) form.reset();
        } catch {
          if (formMessage) {
            formMessage.textContent = 'Error al enviar el mensaje.';
            formMessage.className = 'text-red-600 font-semibold p-3 bg-red-50 rounded-lg border border-red-200 mt-4';
          }
        }
      });
    }
  }
}

