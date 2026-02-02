/**
 * Servicio para gestionar la configuración de la deuda global del usuario.
 * Interactúa con la colección 'debts' de Firestore.
 */
import {
    collection,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

const DEBTS_COLLECTION = 'debts';

/**
 * Crea o actualiza la configuración base de la deuda (Importe total y cuota ideal).
 */
export const createOrUpdateDebt = async (userId, totalAmount, defaultQuota) => {
    try {
        const debtRef = doc(db, DEBTS_COLLECTION, userId);
        await setDoc(debtRef, {
            totalAmount: parseFloat(totalAmount),
            defaultQuota: parseFloat(defaultQuota),
            updatedAt: serverTimestamp()
        }, { merge: true });
        return { error: null };
    } catch (error) {
        return { error: error.message };
    }
};

/**
 * Recupera la configuración de deuda de un usuario específico.
 */
export const getDebt = async (userId) => {
    try {
        const debtRef = doc(db, DEBTS_COLLECTION, userId);
        const debtSnap = await getDoc(debtRef);

        if (debtSnap.exists()) {
            return { data: debtSnap.data(), error: null };
        } else {
            return { data: null, error: null };
        }
    } catch (error) {
        return { data: null, error: error.message };
    }
};

/**
 * Actualiza únicamente el valor de la cuota por defecto.
 */
export const updateDefaultQuota = async (userId, newQuota) => {
    try {
        const debtRef = doc(db, DEBTS_COLLECTION, userId);
        await updateDoc(debtRef, {
            defaultQuota: parseFloat(newQuota),
            updatedAt: serverTimestamp()
        });
        return { error: null };
    } catch (error) {
        return { error: error.message };
    }
};
