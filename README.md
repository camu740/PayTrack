# Payment Tracker - Aplicación de Gestión de Pagos

Aplicación web moderna para seguimiento y gestión de pagos de deudas con autenticación de usuarios, visualización de progreso y generación de informes en PDF.

## 🚀 Características

- ✅ **Autenticación** - Email/Contraseña y Google OAuth
- 💰 **Gestión de Deudas** - Configurar monto total y cuota por defecto
- 📊 **Visualización** - Gráfico de progreso en tiempo real
- 💸 **Registro de Pagos** - Añadir transferencias con concepto opcional
- 📋 **Historial** - Lista de pagos con búsqueda y ordenación
- 📄 **Informes PDF** - Generación de informes descargables
- 🎨 **Diseño Moderno** - UI atractiva con animaciones suaves
- 📱 **Responsive** - Compatible con móviles, tablets y desktop

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- npm o yarn
- Cuenta de Firebase (gratuita)

## 🔧 Configuración

### 1. Instalar Dependencias

```bash
cd payment-tracker
npm install
```

### 2. Configurar Firebase

#### Paso 1: Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto"
3. Nombra tu proyecto (ej: "payment-tracker")
4. Deshabilita Google Analytics si no lo necesitas
5. Haz clic en "Crear proyecto"

#### Paso 2: Configurar Authentication

1. En el panel izquierdo, ve a **Build** > **Authentication**
2. Haz clic en "Get started"
3. Habilita los siguientes proveedores:
   - **Email/Password**: Actívalo
   - **Google**: Actívalo (configura el correo del proyecto)

#### Paso 3: Configurar Firestore Database

1. En el panel izquierdo, ve a **Build** > **Firestore Database**
2. Haz clic en "Create database"
3. Selecciona "Start in **production mode**" (cambiaremos las reglas después)
4. Elige la región más cercana
5. Haz clic en "Enable"

#### Paso 4: Configurar Reglas de Seguridad

En la pestaña "Rules" de Firestore, reemplaza las reglas con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own debt configuration
    match /debts/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow users to read/write their own payments
    match /payments/{paymentId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

Haz clic en "Publish" para guardar.

#### Paso 5: Obtener Credenciales

1. Ve a **Project Settings** (⚙️ en el panel izquierdo)
2. En la sección "Your apps", haz clic en el icono web `</>`
3. Registra tu app (puedes llamarla "payment-tracker-web")
4. Copia el objeto `firebaseConfig` que aparece

#### Paso 6: Configurar la Aplicación

1. Abre el archivo `src/config/firebase.js`
2. Reemplaza las credenciales con las tuyas:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROJECT_ID.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROJECT_ID.appspot.com",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};
```

## 🚀 Ejecutar la Aplicación

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📖 Uso

### Primera Vez

1. **Registrarse** - Crea una cuenta con email/contraseña o Google
2. **Configurar Deuda** - Ingresa el monto total y la cuota por defecto
3. **Añadir Pagos** - Registra tus transferencias
4. **Ver Progreso** - Visualiza tu progreso en el gráfico
5. **Generar Informe** - Descarga un PDF con el resumen

### Funcionalidades Clave

- **Modificar Cuota**: Actualiza la cuota por defecto en cualquier momento
- **Búsqueda**: Busca transferencias por concepto
- **Ordenación**: Ordena por fecha o importe
- **Auto-ajuste**: La cuota se ajusta automáticamente cuando queda menos dinero que la cuota configurada

## 🏗️ Estructura del Proyecto

```
payment-tracker/
├── src/
│   ├── components/
│   │   ├── Auth/          # Login y Register
│   │   ├── Dashboard/     # Dashboard principal
│   │   ├── PaymentChart/  # Gráfico de progreso
│   │   ├── PaymentForm/   # Formulario de pagos
│   │   └── PaymentList/   # Lista de transferencias
│   ├── config/
│   │   └── firebase.js    # Configuración de Firebase
│   ├── context/
│   │   └── AuthContext.jsx # Context de autenticación
│   ├── services/
│   │   ├── authService.js    # Servicios de auth
│   │   ├── debtService.js    # Servicios de deuda
│   │   └── paymentService.js # Servicios de pagos
│   ├── utils/
│   │   └── pdfGenerator.js   # Generador de PDFs
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
└── package.json
```

## 🛠️ Tecnologías Utilizadas

- **React 18** - Framework UI
- **Vite** - Build tool
- **Firebase** - Backend (Auth + Firestore)
- **React Router** - Navegación
- **Recharts** - Gráficos
- **jsPDF** - Generación de PDFs
- **date-fns** - Manejo de fechas

## 📱 Compatibilidad

- ✅ Chrome (recomendado)
- ✅ Safari
- ✅ Firefox
- ✅ Edge
- ✅ Móviles (iOS/Android)

## 🔒 Seguridad

- Autenticación segura con Firebase
- Reglas de seguridad en Firestore
- Datos privados por usuario
- No se comparte información entre usuarios

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso personal y educativo.

## 🆘 Soporte

Si tienes problemas con la configuración de Firebase, consulta la [documentación oficial](https://firebase.google.com/docs)
