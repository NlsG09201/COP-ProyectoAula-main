# ProyectoAula

Proyecto full-stack para gestión odontológica con:
- Frontend Angular (`Cop-Frontend-Angular` y `DashBoard-COP`)
- Backend Spring Boot (`Backend`)
- Worker Spring Boot para tareas programadas (`Worker`)
- Base de datos MySQL y MongoDB
- Sistema de testimonios y calificaciones
- Gestión de odontogramas
- Chatbot IA para atención al cliente
- Sistema de notificaciones por correo
- Interfaz moderna y responsive

## Estructura
- `Backend/`: API REST (Java 17, Spring Boot)
- `Cop-Frontend-Angular/`: UI web pública (Angular 16+, Node 20)
- `DashBoard-COP/`: Panel de administración (Angular 16+)
- `Worker/`: Recordatorios de citas (scheduler + correo)
- `Backend.sql`: Script inicial de MySQL
- `db-init/`: Scripts de inicialización de MySQL
- `mongo-init/`: Scripts de inicialización de MongoDB
- `docker-compose.yml`: Configuración de contenedores

## Prerrequisitos
- `Java 17` y `Maven` (o Maven Wrapper `mvnw`)
- `Node 20.19.0` y `@angular/cli`
- `Docker` y `docker-compose` para despliegue
- Docker Desktop (Windows/Mac) o Docker Engine (Linux)
- API Key de OpenAI para el chatbot
- Cuenta de servicio de correo (SendGrid/SMTP)

## Configuración de Base de Datos (Backend)
Usa variables de entorno para credenciales y evita poner contraseñas en texto plano.

Ejemplo (`Backend/src/main/resources/application.properties`):
```
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASS}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
```
Variables sugeridas:
- `DB_URL=jdbc:mysql://<host>:3306/<db>?useUnicode=true&characterEncoding=utf8&serverTimezone=UTC&useSSL=false&allowPublicKeyRetrieval=true`
- `DB_USER=<usuario>`
- `DB_PASS=<password>`

Notas:
- Autoriza tu IP pública en cPanel/Remote MySQL/Access Hosts (o equivalente).
- Verifica conectividad: `Test-NetConnection <host> -Port 3306`.
- Si requieres SSL, usa `useSSL=true` y certificados válidos.

## Backend (API)
Arranque local:
```
cd Backend
./mvnw clean package -DskipTests
java -jar target/Backend-0.0.1-SNAPSHOT.jar
```

Endpoints principales (`/api`):
- `GET /api/pacientes` | `GET /api/pacientes/{id}` | `POST/PUT/DELETE`
- `GET /api/medicos` | `GET /api/medicos/{id}` | `POST/PUT/DELETE`
- `GET /api/servicios` | `GET /api/servicios/{id}` | `POST/PUT/DELETE`
- `GET /api/dientes` | `GET /api/dientes/{id}` | `POST/PUT/DELETE`
- `GET /api/odontogramas` | `GET /api/odontogramas/{id}` | `POST/PUT/DELETE`
- `GET /api/detalles-odontograma` | `GET /api/detalles-odontograma/{id}`
- `GET /api/citas` | `GET /api/citas/{id}` | `POST/PUT/DELETE`
- `GET /api/testimonios` | `GET /api/testimonios/{id}` | `POST/PUT/DELETE`
- `GET /api/testimonios/servicio/{servicioId}` | Testimonios por servicio
- `GET /api/testimonios/calificacion/{rating}` | Filtrar por calificación

CORS: controladores con `@CrossOrigin(origins = "*")` para facilitar desarrollo.

## Frontend (Angular)
Desarrollo local con proxy a backend:
```
cd Cop-Frontend-Angular
npm install
ng serve --proxy-config proxy.conf.json
```
- Proxy `proxy.conf.json` redirige `/api` → `http://localhost:8080`
- Ajusta `src/environments/*.ts` para configurar:
  - `apiUrl`: URL del backend
  - `openaiApiKey`: Tu API key de OpenAI
  - `emailService`: Configuración del servicio de correo
  - `socialMedia`: Enlaces a redes sociales

### Configuración del Chatbot
El sistema incluye un chatbot impulsado por IA que requiere configuración en `environment.ts`:
```typescript
export const environment = {
  // ... otras configuraciones ...
  openaiApiKey: 'tu-api-key-aqui',
  emailService: {
    apiKey: 'tu-email-service-api-key',
    fromEmail: 'no-reply@tudominio.com'
  }
};
```

### Redes Sociales
Configura los enlaces a redes sociales en `environment.ts`:
```typescript
socialMedia: {
  facebook: 'https://facebook.com/tuclínica',
  instagram: 'https://instagram.com/tuclínica',
  twitter: 'https://twitter.com/tuclínica',
  whatsapp: 'https://wa.me/tucélular'
}

Docker (producción estática con Nginx):
```
cd Cop-Frontend-Angular
docker build -t cop-frontend:latest .
docker run -d -p 80:80 --name cop-frontend cop-frontend:latest
```

## Worker (Recordatorios)
Función: consulta `GET /api/citas` y envía/simula correos para las citas del día siguiente.

Configuración en `Worker/src/main/resources/application.properties`:
```
worker.backend.base-url=http://localhost:8080/api
worker.reminders.enabled=true
worker.reminders.cron=0 0 7 * * *
# SMTP opcional
spring.mail.host=
spring.mail.port=
spring.mail.username=
spring.mail.password=
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.from=
```

Arranque:
```
cd Worker
./mvnw clean package -DskipTests
java -jar target/Worker-0.0.1-SNAPSHOT.jar
```
- El scheduler corre diario 07:00; puedes probar con un cron más frecuente.

## Despliegue con Docker Compose
El proyecto incluye un archivo `docker-compose.yml` que configura todos los servicios necesarios:

```bash
# Construir todas las imágenes
docker-compose build

# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

Servicios incluidos:
- MySQL (puerto 3306)
- MongoDB (puerto 27017)
- Backend Spring Boot (puerto 8080)
- Frontend público (puerto 80)
- Panel de administración (puerto 4200)
- Worker para recordatorios

Las credenciales y configuraciones están definidas en el `docker-compose.yml`.

### Volúmenes Persistentes
- `mysql_data`: Datos de MySQL
- `mongodb_data`: Datos de MongoDB

### Redes
- `cop_net`: Red interna para comunicación entre servicios

## Solución de Problemas
- Error de conexión a bases de datos:
  - Verifica que los contenedores estén corriendo: `docker-compose ps`
  - Revisa logs: `docker-compose logs mysql` o `docker-compose logs mongodb`
  - Asegúrate que los scripts de inicialización tengan permisos: `chmod +x db-init/*.sql`
- CORS en desarrollo:
  - Usa `proxy.conf.json` en ambos frontends
  - Verifica la configuración de CORS en el Backend
- Problemas con Docker:
  - Limpia contenedores: `docker-compose down -v`
  - Reconstruye imágenes: `docker-compose build --no-cache`
  - Verifica espacio en disco: `docker system df`
- Problemas con el Chatbot:
  - Verifica la API key de OpenAI en environment.ts
  - Revisa los logs del servicio: `docker-compose logs frontend`
  - Asegura conexión a internet estable
- Problemas con Notificaciones:
  - Verifica configuración SMTP
  - Revisa logs del Worker: `docker-compose logs worker`
  - Comprueba permisos de envío de correo

## Seguridad
- Evita almacenar contraseñas en texto plano en el repo.
- Usa perfiles (`spring.profiles.active`) y variables de entorno para producción.

## Características Implementadas
- Sistema de testimonios con calificación por estrellas
- Panel de administración separado del frontend público
- Persistencia multi-base de datos (MySQL + MongoDB)
- Contenedores Docker para todos los servicios
- Odontograma interactivo
- Sistema de recordatorios de citas
- Chatbot IA para atención al cliente
  - Consultas de servicios y precios
  - Asistencia en programación de citas
  - Respuestas personalizadas
- Sistema de notificaciones por correo
  - Confirmación automática de citas
  - Recordatorios de citas
  - Notificaciones personalizadas
- Interfaz moderna y responsive
  - Diseño limpio y profesional
  - Visualización optimizada de servicios y precios
  - Integración de redes sociales
  - Adaptable a todos los dispositivos

## Próximos Pasos
- Implementar autenticación y autorización
- Añadir pruebas automatizadas
- Configurar CI/CD con GitHub Actions
- Mejorar la documentación de API con Swagger
- Implementar monitoreo y logs centralizados
- Expandir capacidades del chatbot IA
  - Integración con más servicios de IA
  - Análisis de sentimientos en testimonios
  - Recomendaciones personalizadas
- Mejoras en el sistema de notificaciones
  - Plantillas de correo personalizables
  - Notificaciones push
  - Integración con WhatsApp Business API
- Analíticas y reportes
  - Dashboard de satisfacción del cliente
  - Métricas de uso del chatbot
  - Reportes de conversión