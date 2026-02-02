/**
 * Servicio para gestionar las transferencias y cálculos de pagos.
 * Interactúa con la colección 'payments' de Firestore.
 */
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

const PAYMENTS_COLLECTION = 'payments';

/**
 * Registra un nuevo pago en el sistema.
 * @param {string} userId - ID del usuario propietario.
 * @param {number} amount - Importe del pago.
 * @param {string} concept - Motivo o descripción del pago.
 */
export const addPayment = async (userId, amount, concept = '') => {
    try {
        const paymentsRef = collection(db, PAYMENTS_COLLECTION);
        await addDoc(paymentsRef, {
            userId,
            amount: parseFloat(amount),
            concept: concept.trim(),
            createdAt: serverTimestamp()
        });
        return { error: null };
    } catch (error) {
        return { error: error.message };
    }
};

/**
 * Recupera el historial completo de pagos de un usuario.
 * @param {string} userId - ID del usuario.
 * @returns {Promise<{data: Array, error: string|null}>}
 */
export const getPayments = async (userId) => {
    try {
        const paymentsRef = collection(db, PAYMENTS_COLLECTION);
        const q = query(
            paymentsRef,
            where('userId', '==', userId)
        );

        const querySnapshot = await getDocs(q);
        const payments = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            payments.push({
                id: doc.id,
                ...data,
                // Conversión de Timestamp de Firestore a Date de JS
                createdAt: data.createdAt?.toDate() || new Date()
            });
        });

        // Ordenación cronológica descendente (más reciente primero)
        payments.sort((a, b) => b.createdAt - a.createdAt);

        return { data: payments, error: null };
    } catch (error) {
        console.error('Error al recuperar pagos:', error);
        return { data: [], error: error.message };
    }
};

/**
 * Calcula el estado de la deuda (cuotas restantes, montos pendientes y ajuste de cuota).
 * Lógica central del motor de pagos.
 */
export const calculateRemainingPayments = (totalDebt, totalPaid, defaultQuota) => {
    const remaining = totalDebt - totalPaid;

    if (remaining <= 0) {
        return { remainingAmount: 0, remainingPayments: 0, adjustedQuota: 0 };
    }

    // Ajuste automático: si lo que queda es menor que la cuota habitual, la cuota final se ajusta.
    const adjustedQuota = remaining < defaultQuota ? remaining : defaultQuota;
    const remainingPayments = Math.ceil(remaining / adjustedQuota);

    return {
        remainingAmount: remaining,
        remainingPayments,
        adjustedQuota
    };
};

/**
 * Suma el total de todos los pagos realizados.
 */
export const calculateTotalPaid = (payments) => {
    return payments.reduce((total, payment) => total + payment.amount, 0);
};
