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

// Create or update debt configuration
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

// Get debt configuration
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

// Update default quota
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
