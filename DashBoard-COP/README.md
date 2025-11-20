# DashBoard-COP

Panel de administración para organizar citas, gestionar pacientes y registrar odontogramas.

## Requisitos
- Node.js 20+
- Backend corriendo en `http://localhost:8080`.

## Desarrollo
1. `npm install`
2. `npm run start -- --proxy-config proxy.conf.json --port 4322`
3. Abre `http://localhost:4322/`

## Rutas
- `/citas`: listado y gestión de citas.
- `/pacientes`: registro y edición de pacientes.
- `/odontograma`: registro con malla dental interactiva por paciente.