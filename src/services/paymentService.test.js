import { describe, it, expect } from 'vitest';
import { calculateRemainingPayments, calculateTotalPaid } from './paymentService';

describe('paymentService', () => {
    describe('calculateTotalPaid', () => {
        it('should correctly sum payment amounts', () => {
            const payments = [
                { amount: 100 },
                { amount: 50.50 },
                { amount: 200 }
            ];
            expect(calculateTotalPaid(payments)).toBe(350.50);
        });

        it('should return 0 for empty array', () => {
            expect(calculateTotalPaid([])).toBe(0);
        });
    });

    describe('calculateRemainingPayments', () => {
        it('should calculate remaining amount correctly', () => {
            // Debt: 1000, Paid: 200, Quota: 100
            const result = calculateRemainingPayments(1000, 200, 100);
            expect(result.remainingAmount).toBe(800);
            expect(result.remainingPayments).toBe(8);
            expect(result.adjustedQuota).toBe(100);
        });

        it('should adjust quota when remaining is less than default quota', () => {
            // Debt: 1000, Paid: 950, Quota: 100
            // Remaining: 50. Quota should become 50.
            const result = calculateRemainingPayments(1000, 950, 100);
            expect(result.remainingAmount).toBe(50);
            expect(result.adjustedQuota).toBe(50);
            expect(result.remainingPayments).toBe(1);
        });

        it('should handle zero remaining debt', () => {
            const result = calculateRemainingPayments(1000, 1000, 100);
            expect(result.remainingAmount).toBe(0);
            expect(result.remainingPayments).toBe(0);
            expect(result.adjustedQuota).toBe(0);
        });
    });
});
