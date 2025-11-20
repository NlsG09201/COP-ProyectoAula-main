import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  template: ''
})
export class ChatbotComponent implements AfterViewInit {
  ngAfterViewInit() {
    const btn = document.createElement('button');
    btn.id = 'chatbot-fab';
    btn.innerHTML = '<img src="/assets/Gemini.png" alt="Chatbot" style="width:100%;height:100%;object-fit:contain;border-radius:50%;">';
    Object.assign(btn.style as any, {
      position: 'fixed', bottom: '2rem', right: '2rem', width: '4rem', height: '4rem', borderRadius: '50%',
      background: 'linear-gradient(135deg, #0891b2, #06b6d4)', color: '#fff', border: 'none', fontSize: '1.5rem',
      zIndex: 9999, boxShadow: '0 8px 25px rgba(8,145,178,0.3)', cursor: 'pointer', padding: '0.5rem'
    });

    const widget = document.createElement('div');
    widget.style.cssText = 'background:#fff;border-radius:1rem;box-shadow:0 12px 40px rgba(8,145,178,0.25);width:360px;max-width:95vw;position:fixed;bottom:7rem;right:2rem;z-index:10000;display:none;flex-direction:column;border:1px solid #e2e8f0';
    const header = document.createElement('div');
    header.style.cssText = 'background:linear-gradient(135deg, #0891b2, #06b6d4);color:#fff;padding:1rem 1.2rem;border-radius:1rem 1rem 0 0;display:flex;justify-content:space-between;align-items:center';
    header.innerHTML = `<span><img src="assets/img/Gemini.png" alt="Chatbot" style="width:1.5rem;height:1.5rem;margin-right:0.5rem;border-radius:50%">Asistente Virtual</span>`;
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = 'background:none;border:none;color:#fff;font-size:1.3rem;cursor:pointer';
    header.appendChild(closeBtn);
    const messages = document.createElement('div');
    messages.id = 'chatbot-messages';
    messages.style.cssText = 'padding:1rem;height:300px;overflow-y:auto;font-size:0.9rem;background:#f8fafc;scroll-behavior:smooth';
    const inputRow = document.createElement('div');
    inputRow.style.cssText = 'display:flex;padding:0.8rem;border-top:1px solid #e2e8f0;background:#fff;border-radius:0 0 1rem 1rem';
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Escribe tu mensaje...';
    input.style.cssText = 'flex:1;padding:0.6rem 1rem;border-radius:0.5rem;border:1px solid #d1d5db';
    const send = document.createElement('button');
    send.textContent = 'Enviar';
    send.style.cssText = 'margin-left:0.5rem;background:linear-gradient(135deg, #0891b2, #06b6d4);color:#fff;border:none;border-radius:0.5rem;padding:0.6rem 1rem;cursor:pointer';
    inputRow.append(input, send);
    widget.append(header, messages, inputRow);

    btn.onclick = () => { widget.style.display = 'flex'; };
    closeBtn.onclick = () => { widget.style.display = 'none'; };
    send.onclick = () => {
      const text = input.value.trim();
      if (!text) return;
      const user = document.createElement('div');
      user.style.cssText = 'margin:0.5rem 0; text-align:right';
      user.innerHTML = `<span style="display:inline-block;background:linear-gradient(135deg,#0891b2,#06b6d4);color:#fff;padding:0.6rem 1rem;border-radius:1rem 1rem 0.2rem 1rem;max-width:80%">${text}</span>`;
      messages.appendChild(user);
      messages.scrollTop = messages.scrollHeight;
      input.value = '';
      setTimeout(() => {
        const bot = document.createElement('div');
        bot.style.cssText = 'margin:0.5rem 0; text-align:left';
        bot.innerHTML = `<span style="display:inline-block;background:linear-gradient(135deg,#e0f7fa,#b2ebf2);color:#0f172a;padding:0.6rem 1rem;border-radius:1rem 1rem 1rem 0.2rem;max-width:80%">Gracias por tu mensaje. Pronto te contactaremos.</span>`;
        messages.appendChild(bot);
        messages.scrollTop = messages.scrollHeight;
      }, 1000);
    };

    document.body.appendChild(btn);
    document.body.appendChild(widget);
  }
}

