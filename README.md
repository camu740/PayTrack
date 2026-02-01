# PayTrack - Plataforma de Gestión y Seguimiento de Pagos

**PayTrack** es una aplicación web progresiva (PWA) diseñada para facilitar el control financiero personal, específicamente orientada a la gestión y amortización de deudas o pagos recurrentes. Este proyecto ha sido desarrollado como parte de un Trabajo de Fin de Grado (TFG), demostrando el uso de arquitecturas modernas en el desarrollo web.

## 📌 Descripción del Proyecto

El objetivo principal de PayTrack es proporcionar una interfaz intuitiva y visual para que los usuarios puedan realizar un seguimiento exhaustivo de sus obligaciones financieras. La aplicación permite establecer objetivos de pago, visualizar el progreso mediante gráficos interactivos en tiempo real y generar informes detallados para constancia documental.

### Características Principales

*   **Autenticación Segura**: Sistema de registro e inicio de sesión mediante Email/Contraseña y proveedor externo (Google Account), garantizando la privacidad de los datos.
*   **Gestión de Deuda**: Configuración personalizada del monto total a amortizar y establecimiento de cuotas mensuales por defecto.
*   **Visualización de Datos**: Dashboard interactivo con gráficos de progreso que muestran el estado actual de la amortización (pagado vs. pendiente) y porcentajes de cumplimiento.
*   **Historial Transaccional**: Registro detallado de cada pago realizado, con opción de incluir conceptos y fechas automáticas.
*   **Informes y Exportación**: Generación de informes en formato PDF con el resumen de la deuda y el histórico de pagos, listos para descargar o compartir.
*   **Experiencia de Usuario (UX)**: Diseño *responsive* adaptado a dispositivos móviles y escritorio, con feedback visual y animaciones suaves.

## 🛠️ Stack Tecnológico

El desarrollo de este proyecto se ha basado en un stack tecnológico actual, priorizando el rendimiento, la escalabilidad y la experiencia de desarrollo.

*   **Frontend**: React 18 (Biblioteca UI), Vite (Entorno de desarrollo y construcción).
*   **Backend & Cloud**: Firebase (Backend-as-a-Service).
    *   *Authentication*: Gestión de identidades.
    *   *Firestore Database*: Base de datos NoSQL en tiempo real.
    *   *Hosting*: Despliegue y distribución de contenido estático.
*   **Visualización**: Recharts (Gráficos composables).
*   **Utilidades**: jsPDF (Generación de documentos), date-fns (Manipulación de fechas).

## 📋 Requisitos de Instalación

Para ejecutar este proyecto en un entorno local, se requiere:

*   **Node.js**: Versión 18.0.0 o superior.
*   **Gestor de Paquetes**: npm (incluido con Node.js) o yarn.
*   **Git**: Para el control de versiones.

## 🚀 Guía de Puesta en Marcha

Sigue estos pasos para desplegar el proyecto en tu máquina local:

### 1. Clonar el Repositorio

```bash
git clone https://github.com/camu740/PayTrack.git
cd PayTrack
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configuración de Variables de Entorno (Firebase)

Para que la aplicación funcione, es necesario conectarla a un proyecto de Firebase.

1.  Crea un proyecto gratuito en [Firebase Console](https://console.firebase.google.com/).
2.  Registra una "App Web" dentro del proyecto.
3.  Copia las credenciales de configuración.
4.  Crea/Modifica el archivo `src/config/firebase.js` y añade tus claves:

```javascript
// src/config/firebase.js
import { initializeApp } from 'firebase/app';
// ... otros imports

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
// ... exportaciones
```

> **Nota para el evaluación**: Asegúrate de habilitar **Authentication** (Email/Google) y **Firestore Database** en la consola de Firebase.

### 4. Ejecutar en Entorno de Desarrollo

```bash
npm run dev
```

La aplicación estará accesible en: `http://localhost:5173`

## 📦 Construcción y Despliegue

Para generar una versión optimizada para producción:

```bash
npm run build
```

Esto generará la carpeta `dist/` con los archivos estáticos listos para ser servidos.

Para desplegar directamente a Firebase Hosting (si tienes Firebase CLI instalado):

```bash
firebase deploy
```

## 🔐 Seguridad y Privacidad

Este proyecto implementa reglas de seguridad en nivel de base de datos (Firestore Security Rules) para asegurar que:
*   Un usuario **solo puede leer y escribir sus propios datos**.
*   No existe acceso cruzado entre cuentas.
*   Se validan los tipos de datos en la entrada.

## 👤 Autor

Desarrollado como parte del Trabajo de Fin de Máster.

---
© 2026 PayTrack Project. Todos los derechos reservados.
