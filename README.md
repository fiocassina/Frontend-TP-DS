# Sistema StudyRoom

[![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

## Tabla de contenido
- [Descripcion general](#descripcion-general)
- [Caracteristicas principales](#caracteristicas-principales)
- [Tecnologias y dependencias destacadas](#tecnologias-y-dependencias-destacadas)
- [Prerrequisitos](#prerrequisitos)
- [Instalacion rapida](#instalacion-rapida)
- [Configuracion del entorno](#configuracion-del-entorno)
- [Uso de la aplicacion](#uso-de-la-aplicacion)
- [Tests y calidad](#tests-y-calidad)
- [Problemas frecuentes](#problemas-frecuentes)
- [Video demostrativo](#video-demostrativo)
- [Recursos utiles](#recursos-utiles)
- [Equipo de desarrollo](#equipo-de-desarrollo)

---

## Descripcion general
**StudyRoom** es una plataforma integral de gestión educativa orientada a facilitar la interacción entre docentes y alumnos. Permite la administración de clases, carga y descarga de material de estudio, gestión de proyectos y un sistema completo de entregas y correcciones, todo centralizado en una interfaz intuitiva.

## Caracteristicas principales
-  **Gestión de Usuarios y Seguridad:** Registro, inicio de sesión y recuperación de contraseñas, todo protegido mediante JWT. Soporta perfiles diferenciados para organizar la interacción entre docentes y alumnos.
-  **Administración de Clases y Contenidos:** Sistema para crear clases, gestionar inscripciones y organizar los recursos de estudio mediante la creación de distintos "Materiales", "Proyectos" y "Tipos de Proyectos".
-  **Ciclo de Entregas y Evaluaciones:** Flujo dinámico donde los alumnos pueden visualizar sus proyectos pendientes y realizar entregas. A su vez, los docentes pueden evaluar, emitir correcciones y consultar informe de entregas aprobadas de un proyecto.
-  **Notificaciones y Recordatorios:** Integración con Nodemailer para el envío de correos automáticos, incluyendo recuperación de accesos y un servicio de recordatorios programados.
-  **Navegación Modular:** A través de una barra de navegación (Navbar) intuitiva, los usuarios pueden moverse entre distintas vistas dedicadas: un **Inicio (Dashboard)** para las clases, un espacio propio de **Perfil** para gestionar sus datos, y una sección de **Entregas Pendientes** para su organización.
  
## Tecnologias y dependencias destacadas
**Frontend:**
- [Angular 17/18](https://angular.io/) (Framework principal)
- TypeScript
- Cypress (Testing E2E)

**Backend:**
- Node.js & Express
- TypeScript
- MongoDB & Mongoose (Base de Datos)
- JWT (Seguridad)
- Nodemailer (Mailing)
- Swagger (Documentación de API)

## Prerrequisitos
Antes de comenzar, asegúrate de tener instalado:
- **Node.js** (v18 o superior)
- **pnpm** (Gestor de paquetes recomendado: `npm install -g pnpm`)
- **Git**
- **MongoDB** (Instancia Local o cuenta en MongoDB Atlas)

## Instalacion rapida
El sistema se divide en dos repositorios. Te recomendamos abrir dos terminales (por ejemplo, Git Bash) distintas.

**1. Clonar los repositorios:**
```bash
# Terminal 1 - Backend
git clone [https://github.com/fiocassina/Backend-TP-DS.git](https://github.com/fiocassina/Backend-TP-DS.git)

# Terminal 2 - Frontend
git clone [https://github.com/fiocassina/Frontend-TP-DS.git](https://github.com/fiocassina/Frontend-TP-DS.git)
```

**2. Instalar dependencias:**
```bash
# En la carpeta de Backend:
cd Backend-TP-DS
pnpm install

# En la carpeta de Frontend:
cd Frontend-TP-DS/cliente
pnpm install
```

## Configuracion del entorno
El proyecto utiliza variables de entorno para gestionar la configuración de seguridad y servicios externos. Debes crear un archivo `.env` en la raíz del directorio `/Backend-TP-DS` basándote en el siguiente formato:

```env
# Configuración del Servidor
PORT=8080
FRONTEND_URL=http://localhost:4200

# Base de datos (MongoDB Atlas o Local)
MONGO_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/nombre_db

# Seguridad (JWT) - Genera una clave aleatoria
JWT_SECRET=tu_clave_secreta_para_jwt

# Servicio de Correo (Nodemailer - Gmail)
# IMPORTANTE: EMAIL_PASS debe ser una 'Contraseña de Aplicación' de Google
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=xxxx yyyy zzzz wwww
```

## Uso de la aplicacion
Para iniciar el sistema de manera local:

**1. Levantar el Backend:**
En la terminal del backend, ejecuta:
```bash
pnpm run start:dev
```
*El servidor estará corriendo en `http://localhost:8080`. Puedes ver la documentación de la SWAGGER en `http://localhost:8080/api-docs`.*

**2. Levantar el Frontend:**
En la terminal del frontend (dentro de la carpeta `/cliente`), ejecuta:
```bash
ng serve
```
*Accede a la aplicación desde tu navegador en `http://localhost:4200`.*

## Tests y calidad
El proyecto cuenta con testing para asegurar la estabilidad del código:
- **Backend:** Ejecuta `pnpm test` para correr las pruebas unitarias y de integración.
- **Frontend:** Se utiliza **Cypress** para pruebas End-to-End (E2E), como el flujo de login y ng test para test unitarios.

## Problemas frecuentes
- **Error de CORS al intentar loguearse:** Asegúrate de que tu `.env` del backend tenga la variable `FRONTEND_URL=http://localhost:4200` correctamente configurada.
- **No llegan los correos electrónicos:** Verifica que la contraseña en `EMAIL_PASS` sea una "Contraseña de aplicación" de Google y no tu contraseña habitual de Gmail.
- **Fallo al conectar a la base de datos:** Revisa que tu IP esté autorizada en el Network Access de MongoDB Atlas o que el servicio local de MongoDB esté corriendo.

## Video demostrativo
[Colocar aquí el enlace a los videos]

## Recursos utiles
- [Documentación oficial de Angular](https://angular.dev/)
- [Guía para crear Contraseñas de Aplicación en Google](https://support.google.com/accounts/answer/185833?hl=es)
- [MongoDB Atlas Tutorial](https://www.mongodb.com/docs/atlas/getting-started/)

---

## Equipo de desarrollo
- Cassina, Fiorella
- García, Candela
- Vega, Lucila Bianca
