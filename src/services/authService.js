import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../config/firebase';

// Helper to get friendly error messages
export const getFriendlyErrorMessage = (errorCode) => {
    console.warn('Firebase Auth Error Code:', errorCode); // Log for debugging

    switch (errorCode) {
        case 'auth/invalid-email':
            return 'El correo electrónico no es válido.';
        case 'auth/user-disabled':
            return 'Esta cuenta ha sido deshabilitada.';
        case 'auth/user-not-found':
        case 'auth/invalid-credential':
            return 'Credenciales incorrectas. Si te registraste con Google, usa el botón de Google para entrar.';
        case 'auth/wrong-password':
            return 'La contraseña es incorrecta. Si usas Google normalmente, intenta entrar con ese botón.';
        case 'auth/email-already-in-use':
            return 'Este correo ya está registrado. Si creaste la cuenta con Google, inicia sesión con el botón de Google.';
        case 'auth/weak-password':
            return 'La contraseña es demasiado débil (mínimo 6 caracteres).';
        case 'auth/account-exists-with-different-credential':
            return 'Existe una cuenta con este correo vinculada a Google. Por favor, inicia sesión con Google.';
        case 'auth/credential-already-in-use':
            return 'Esta cuenta ya está vinculada a otro usuario.';
        case 'auth/popup-closed-by-user':
            return 'Has cerrado la ventana de inicio de sesión antes de terminar.';
        case 'auth/cancelled-popup-request':
            return 'Operación cancelada.';
        case 'auth/too-many-requests':
            return 'Demasiados intentos fallidos. Por favor, inténtalo más tarde.';
        case 'auth/network-request-failed':
            return 'Error de conexión. Comprueba tu internet.';
        case 'auth/api-key-not-valid.-please-pass-a-valid-api-key.':
        case 'auth/invalid-api-key':
            return 'Error de configuración en la aplicación (API Key).';
        default:
            return 'Ocurrió un error inesperado. Inténtalo de nuevo o usa otro método de acceso.';
    }
};

// Register with email and password
export const signUpWithEmail = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return { user: userCredential.user, error: null };
    } catch (error) {
        return { user: null, error: getFriendlyErrorMessage(error.code) };
    }
};

// Sign in with email and password
export const signInWithEmail = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { user: userCredential.user, error: null };
    } catch (error) {
        return { user: null, error: getFriendlyErrorMessage(error.code) };
    }
};

// Sign in with Google (Popup Flow)
export const signInWithGoogle = async () => {
    try {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        return { user: userCredential.user, error: null };
    } catch (error) {
        // Log user-friendly message but use original error if needed later
        return { user: null, error: getFriendlyErrorMessage(error.code) };
    }
};

// Check for redirect result (run on page load)
export const checkGoogleRedirect = async () => {
    try {
        const result = await getRedirectResult(auth);
        if (result) {
            return { user: result.user, error: null };
        }
        return { user: null, error: null };
    } catch (error) {
        return { user: null, error: getFriendlyErrorMessage(error.code) };
    }
};

// Sign out
export const signOut = async () => {
    try {
        await firebaseSignOut(auth);
        return { error: null };
    } catch (error) {
        return { error: getFriendlyErrorMessage(error.code) };
    }
};

// Get current user
export const getCurrentUser = () => {
    return auth.currentUser;
};

// Listen to auth state changes
export const onAuthChange = (callback) => {
    return onAuthStateChanged(auth, callback);
};
