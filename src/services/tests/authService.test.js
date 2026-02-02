import { describe, it, expect } from 'vitest';
// We need to export the helper or test it indirectly via public functions if not exported.
// Since getFriendlyErrorMessage is internal, we might need to modify authService to export it for testing,
// or just trust it works via integration. 
// However, for unit testing purposes, let's verify if we can export it or copy logic for a pure function test.
// A better approach for TFG is to test the exported functions behavior or modifying the service to export the helper for testing.
// Let's modify authService.js to export the helper first to make it testable, or simple create a test ensuring the mapping logic works if we copy it (less ideal).

// Validating approach: modifying authService.js to export getFriendlyErrorMessage is cleaner.
// I will create a placeholder test file now and will update authService in the next step to export the helper.
// For now, let's assume I'll export `getFriendlyErrorMessage` as a named export.

import { getFriendlyErrorMessage } from '../authService';

describe('authService', () => {
    describe('getFriendlyErrorMessage', () => {
        it('should translate auth/user-not-found', () => {
            expect(getFriendlyErrorMessage('auth/user-not-found')).toBe('No existe ninguna cuenta con este correo.');
        });

        it('should translate auth/wrong-password', () => {
            expect(getFriendlyErrorMessage('auth/wrong-password')).toBe('La contraseña es incorrecta.');
        });

        it('should return default message for unknown error', () => {
            expect(getFriendlyErrorMessage('unknown-error')).toBe('Ocurrió un error inesperado al iniciar sesión. Inténtalo de nuevo.');
        });
    });
});
