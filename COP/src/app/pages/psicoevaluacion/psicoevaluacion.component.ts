import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-psicoevaluacion',
  standalone: true,
  templateUrl: './psicoevaluacion.component.html'
})
export class PsicoEvaluacionComponent implements AfterViewInit {
  ngAfterViewInit() {
    const msg = document.getElementById('evalMsg');
    const nombre = document.getElementById('evalNombre') as HTMLInputElement | null;
    const email = document.getElementById('evalEmail') as HTMLInputElement | null;
    const doc = document.getElementById('evalDoc') as HTMLInputElement | null;
    const telefono = document.getElementById('evalTelefono') as HTMLInputElement | null;
    const direccion = document.getElementById('evalDireccion') as HTMLInputElement | null;

    const getPaciente = async () => {
      const n = nombre?.value || '';
      const e = email?.value || '';
      const d = doc?.value || '';
      const t = telefono?.value || '';
      const dir = direccion?.value || '';
      if (!n || !e) { if (msg) msg.textContent = 'Completa nombre y correo'; return null; }
      if (d) {
        try {
          const r = await fetch(`/api/pacientes/by-doc/${encodeURIComponent(d)}`);
          if (r.ok) return await r.json();
        } catch {}
      }
      const res = await fetch('/api/pacientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombreCompleto: n, email: e, telefono: t, direccion: dir, docIden: d })
      });
      if (res.ok) return await res.json();
      return null;
    };

    const readRadio = (name: string) => {
      const el = document.querySelector(`input[name="${name}"]:checked`) as HTMLInputElement | null;
      return el ? Number(el.value) : 0;
    };
    const buildAnswers = (prefix: string, count: number) => {
      const obj: Record<string, number> = {};
      for (let i = 1; i <= count; i++) obj[`${prefix}_q${i}`] = readRadio(`${prefix}_q${i}`);
      return obj;
    };

    const sendEval = async (tipo: string, puntaje: number, respuestas: any, notas: string) => {
      const p = await getPaciente();
      if (!p) { if (msg) msg.textContent = 'No fue posible registrar paciente'; return; }
      const res = await fetch('/api/psicologia/evaluaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pacienteId: p.idPersona,
          tipo,
          puntaje,
          respuestasJson: JSON.stringify(respuestas),
          notas
        })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        if (msg) msg.textContent = 'Evaluación guardada. Te contactaremos para programar una cita.';
      } else {
        if (msg) msg.textContent = (data?.message || 'No fue posible guardar la evaluación');
      }
    };

    const phqForm = document.getElementById('phq9Form') as HTMLFormElement | null;
    const gadForm = document.getElementById('gad7Form') as HTMLFormElement | null;
    if (phqForm) {
      phqForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const notas = (document.getElementById('phq9Notas') as HTMLTextAreaElement | null)?.value || '';
        const answers = buildAnswers('phq9', 9);
        const score = Object.values(answers).reduce((a, b) => a + b, 0);
        await sendEval('PHQ9', score, answers, notas);
      });
    }
    if (gadForm) {
      gadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const notas = (document.getElementById('gad7Notas') as HTMLTextAreaElement | null)?.value || '';
        const answers = buildAnswers('gad7', 7);
        const score = Object.values(answers).reduce((a, b) => a + b, 0);
        await sendEval('GAD7', score, answers, notas);
      });
    }
  }
}
