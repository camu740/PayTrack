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

// Add a new payment
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

// Get all payments for a user
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
                // Convert Firestore Timestamp to JS Date, or use current date if null
                createdAt: data.createdAt?.toDate() || new Date()
            });
        });

        // Sort by date on client side (newest first)
        payments.sort((a, b) => b.createdAt - a.createdAt);

        return { data: payments, error: null };
    } catch (error) {
        console.error('Error getting payments:', error);
        return { data: [], error: error.message };
    }
};

// Calculate remaining payments
export const calculateRemainingPayments = (totalDebt, totalPaid, defaultQuota) => {
    const remaining = totalDebt - totalPaid;

    if (remaining <= 0) {
        return { remainingAmount: 0, remainingPayments: 0, adjustedQuota: 0 };
    }

    // If remaining is less than default quota, adjust quota
    const adjustedQuota = remaining < defaultQuota ? remaining : defaultQuota;
    const remainingPayments = Math.ceil(remaining / adjustedQuota);

    return {
        remainingAmount: remaining,
        remainingPayments,
        adjustedQuota
    };
};

// Calculate total paid from payments array
export const calculateTotalPaid = (payments) => {
    return payments.reduce((total, payment) => total + payment.amount, 0);
};
