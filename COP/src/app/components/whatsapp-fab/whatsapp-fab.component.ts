import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-whatsapp-fab',
  standalone: true,
  template: ''
})
export class WhatsappFabComponent implements AfterViewInit {
  ngAfterViewInit() {
    const btn = document.createElement('a');
    btn.id = 'whatsapp-fab';
    btn.href = 'https://api.whatsapp.com/send/?phone=573014218455&text&type=phone_number&app_absent=0';
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
    btn.title = 'Chatea por WhatsApp';
    btn.innerHTML = '<i class="fab fa-whatsapp"></i>';
    Object.assign(btn.style as any, {
      position: 'fixed', bottom: '6.2rem', right: '2rem', width: '3.5rem', height: '3.5rem',
      borderRadius: '50%', background: '#25D366', color: '#fff', border: 'none', fontSize: '2.2rem',
      zIndex: 10001, boxShadow: '0 4px 16px rgba(37,211,102,0.18)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', cursor: 'pointer', textDecoration: 'none'
    });
    document.body.appendChild(btn);
  }
}

