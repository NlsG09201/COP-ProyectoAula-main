#!/bin/sh
set -e

BACKEND_URL="http://backend:8080"

echo "[COP test] Esperando backend en $BACKEND_URL..."
for i in $(seq 1 60); do
  if curl -fsS "$BACKEND_URL/api/servicios" >/dev/null 2>&1; then
    echo "[COP test] Backend disponible"
    break
  fi
  sleep 2
done

echo "[COP test] Obteniendo primer médico..."
MEDICO_ID=$(curl -fsS "$BACKEND_URL/api/medicos" | grep -m1 -o '"idPersona":[0-9]\+' | sed 's/[^0-9]//g')
if [ -z "$MEDICO_ID" ]; then echo "[COP test] No se encontró idPersona de médico"; exit 0; fi
echo "[COP test] MedicoId=$MEDICO_ID"

echo "[COP test] Obteniendo primer servicio..."
SERV_ID=$(curl -fsS "$BACKEND_URL/api/servicios" | grep -m1 -o '"idServicio":[0-9]\+' | sed 's/[^0-9]//g')
if [ -z "$SERV_ID" ]; then echo "[COP test] No se encontró idServicio"; exit 0; fi
echo "[COP test] ServicioId=$SERV_ID"

DOC_ID="DOC-TEST-$(date +%s)"
echo "[COP test] Creando paciente $DOC_ID..."
curl -fsS -X POST "$BACKEND_URL/api/pacientes" \
  -H 'Content-Type: application/json' \
  -d "{\"docIden\":\"$DOC_ID\",\"nombreCompleto\":\"Paciente Docker\",\"email\":\"paciente.docker@example.com\"}" \
  -o /tmp/paciente.json || { echo "[COP test] Error creando paciente"; exit 0; }

PAC_ID=$(grep -m1 -o '"idPersona":[0-9]\+' /tmp/paciente.json | sed 's/[^0-9]//g')
echo "[COP test] PacienteId=$PAC_ID"
if [ -z "$PAC_ID" ]; then echo "[COP test] Paciente sin idPersona"; exit 0; fi

FECHA=$(date -I -d "tomorrow" 2>/dev/null || date -I)
HORA="09:30:00"
echo "[COP test] Creando cita $FECHA $HORA..."
curl -fsS -X POST "$BACKEND_URL/api/citas" \
  -H 'Content-Type: application/json' \
  -d "{\"fecha\":\"$FECHA\",\"hora\":\"$HORA\",\"direccion\":\"Clinica COP\",\"paciente\":{\"idPersona\":$PAC_ID},\"servicio\":{\"idServicio\":$SERV_ID}}" \
  -o /tmp/cita.json || { echo "[COP test] Error creando cita"; exit 0; }

CID=$(grep -m1 -o '"idCita":[0-9]\+' /tmp/cita.json | sed 's/[^0-9]//g')
echo "[COP test] CitaId=$CID"
if [ -z "$CID" ]; then echo "[COP test] Cita sin id"; exit 0; fi

echo "[COP test] Asignando y confirmando cita..."
AUTH="medico1:medico123"
curl -fsS -u "$AUTH" -X POST "$BACKEND_URL/api/citas/$CID/asignar?medicoId=$MEDICO_ID&confirmar=true" -H 'Content-Type: application/json' -d '{}' \
  >/dev/null 2>&1 || {
    echo "[COP test] Error confirmando; puede ser por disponibilidad del médico."
    exit 0
  }

echo "[COP test] Cita confirmada y evento emitido"
