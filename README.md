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

### 3. Configuración Detallada de Firebase

Este proyecto requiere servicios de Firebase (Google) para funcionar. Sigue esta guía paso a paso si es tu primera vez:

#### Paso 3.1: Crear el Proyecto
1.  Accede a la [Consola de Firebase](https://console.firebase.google.com/) e inicia sesión con tu cuenta de Google.
2.  Haz clic en el cuadro grande que dice **"Crear un proyecto"** (o "Agregar proyecto").
3.  Escribe el nombre del proyecto: **PayTrack**.
4.  Desactiva la opción *Google Analytics* (no es necesaria para este proyecto) y haz clic en **Crear proyecto**.
5.  Espera a que termine y pulsa **Continuar**.

#### Paso 3.2: Registrar la Aplicación Web
1.  En la pantalla principal de tu nuevo proyecto, verás varios iconos circulares bajo el título *"Comenza por agregar Firebase a tu app"*.
2.  Haz clic en el icono **Web** (el que parece un símbolo de código `</>`).
3.  En "Apodo de la app", escribe: `paytrack-web`.
4.  No marques la casilla de "Firebase Hosting" (lo haremos más tarde).
5.  Haz clic en **Registrar app**.
6.  Aparecerá un bloque de código con `const firebaseConfig = { ... }`. **Copia este bloque**, lo necesitarás en el paso 3.5.
7.  Haz clic en **Ir a la consola**.

#### Paso 3.3: Habilitar Autenticación
1.  En el menú lateral izquierdo, haz clic en **Compilación** (Build) > **Authentication**.
2.  Haz clic en el botón **Comenzar**.
3.  En la pestaña *Sign-in method* (Métodos de inicio de sesión), selecciona **Correo electrónico/contraseña**.
    *   Habilita el interruptor "Correo electrónico/contraseña".
    *   Deja desactivado "Vínculo del correo electrónico".
    *   Haz clic en **Guardar**.
4.  Haz clic en **Agregar proveedor nuevo** y selecciona **Google**.
    *   Habilita el interruptor.
    *   Escribe un nombre para el proyecto (ej: PayTrack).
    *   Selecciona tu correo en el desplegable de "Correo electrónico de asistencia".
    *   Haz clic en **Guardar**.

#### Paso 3.4: Habilitar Base de Datos (Firestore)
1.  En el menú lateral, ve a **Compilación** > **Firestore Database**.
2.  Haz clic en **Crear base de datos**.
3.  Selecciona una ubicación (Ubicación del servidor). Elige la más cercana a ti (ej: `eur3` para Europa).
4.  En las reglas de seguridad, selecciona **Comenzar en modo de producción**.
5.  Haz clic en **Crear** / **Habilitar**.
6.  Una vez creada, ve a la pestaña **Reglas** (arriba).
7.  Borra todo el contenido y pega el siguiente código para asegurar la privacidad de los datos:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // El usuario solo puede leer/escribir sus propia configuración de deuda
    match /debts/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // El usuario solo puede leer/escribir sus propios pagos
    match /payments/{paymentId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```
8.  Haz clic en **Publicar**.

#### Paso 3.5: Configurar el Archivo Local
1.  En el código del proyecto (en tu ordenador), navega a la carpeta `src/config/`.
2.  Abre el archivo `firebase.js`.
3.  Busca la sección `const firebaseConfig = { ... }` y reemplázala con el objeto que copiaste en el Paso 3.2.

Debería verse similar a esto (pero con tus claves):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "paytrack-12345.firebaseapp.com",
  projectId: "paytrack-12345",
  storageBucket: "paytrack-12345.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

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
