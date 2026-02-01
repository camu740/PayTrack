
import React, { useState } from 'react';
import { signUpWithEmail, signInWithGoogle } from '../../services/authService';
import './Auth.css';

const Register = ({ onToggleMode }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setLoading(true);

        const { user, error } = await signUpWithEmail(email, password);

        if (error) {
            setError(error);
        }

        setLoading(false);
    };

    const handleGoogleSignup = async () => {
        setError('');
        setLoading(true);

        const { user, error } = await signInWithGoogle();

        if (error) {
            setError(error);
        }

        setLoading(false);
    };

    return (
        <div className="auth-container fade-in">
            <div className="auth-header text-center mb-lg">
                <div className="app-logo">💰</div>
                <h1 className="app-title">PayTrack</h1>
                <h2 className="text-muted text-small">Gestión de Pagos</h2>
            </div>

            <div className="auth-card card card-glass">
                <h2 className="text-center mb-lg">Crear Cuenta</h2>

                {error && (
                    <div className="error-message mb-md">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={loading}
                    >
                        {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                    </button>
                </form>

                <p className="text-center mt-md text-muted">
                    ¿Ya tienes cuenta?{' '}
                    <button
                        onClick={onToggleMode}
                        className="link-button"
                        disabled={loading}
                    >
                        Inicia sesión
                    </button>
                </p>

                <div className="divider">
                    <span>O continúa con</span>
                </div>

                <button
                    onClick={handleGoogleSignup}
                    className="btn btn-google w-full"
                    disabled={loading}
                >
                    <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                        <path fill="none" d="M0 0h48v48H0z" />
                    </svg>
                    Google
                </button>
            </div>
        </div>
    );
};

export default Register;
