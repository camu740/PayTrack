import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { signOut } from '../../services/authService';
import { getDebt, createOrUpdateDebt, updateDefaultQuota } from '../../services/debtService';
import { addPayment, getPayments, calculateRemainingPayments, calculateTotalPaid } from '../../services/paymentService';
import PaymentChart from '../PaymentChart/PaymentChart';
import PaymentForm from '../PaymentForm/PaymentForm';
import PaymentList from '../PaymentList/PaymentList';
import Modal from './Modal';
import { sharePaymentReport } from '../../utils/pdfGenerator';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const [debtData, setDebtData] = useState({ totalAmount: 0, defaultQuota: 0 });
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showConfig, setShowConfig] = useState(false);

    // Modal states
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showQuotaModal, setShowQuotaModal] = useState(false);

    // Form states
    const [totalAmount, setTotalAmount] = useState('');
    const [defaultQuota, setDefaultQuota] = useState('');
    const [quotaInput, setQuotaInput] = useState('');

    // Load data
    useEffect(() => {
        loadData();
    }, [user]);

    const loadData = async () => {
        if (!user) return;

        setLoading(true);

        // Load debt configuration
        const { data: debt } = await getDebt(user.uid);
        if (debt) {
            setDebtData(debt);
            setTotalAmount(debt.totalAmount.toString());
            setDefaultQuota(debt.defaultQuota.toString());
            setQuotaInput(debt.defaultQuota.toString());
        } else {
            setShowConfig(true); // Show config if no debt is set
        }

        // Load payments
        const { data: paymentsData } = await getPayments(user.uid);
        setPayments(paymentsData);

        setLoading(false);
    };

    const handleLogout = async () => {
        await signOut();
    };

    const handleSaveConfig = async (e) => {
        e.preventDefault();

        const amount = parseFloat(totalAmount);
        const quota = parseFloat(defaultQuota);

        if (isNaN(amount) || amount <= 0) {
            alert('Por favor ingresa un importe total válido');
            return;
        }

        if (isNaN(quota) || quota <= 0) {
            alert('Por favor ingresa una cuota por defecto válida');
            return;
        }

        await createOrUpdateDebt(user.uid, amount, quota);
        setDebtData({ totalAmount: amount, defaultQuota: quota });
        setQuotaInput(quota.toString());
        setShowConfig(false);
    };

    const handleUpdateQuota = async (e) => {
        e.preventDefault();

        const quota = parseFloat(quotaInput);

        if (isNaN(quota) || quota <= 0) {
            alert('Por favor ingresa una cuota válida');
            return;
        }

        await updateDefaultQuota(user.uid, quota);
        setDebtData({ ...debtData, defaultQuota: quota });
        setDefaultQuota(quota.toString());
        setShowQuotaModal(false);
    };

    const handleAddPayment = async (amount, concept) => {
        await addPayment(user.uid, amount, concept);
        await loadData(); // Reload all data
        setShowPaymentModal(false);
    };

    const handleGenerateReport = async () => {
        const totalPaid = calculateTotalPaid(payments);
        const result = await sharePaymentReport(debtData, payments, totalPaid);

        if (result.success && !result.shared && result.message) {
            alert(result.message);
        } else if (!result.success) {
            alert('Error al generar el informe: ' + result.error);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Cargando...</p>
            </div>
        );
    }

    const totalPaid = calculateTotalPaid(payments);
    const { remainingAmount, remainingPayments, adjustedQuota } = calculateRemainingPayments(
        debtData.totalAmount,
        totalPaid,
        debtData.defaultQuota
    );

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="container">
                    <div className="header-content">
                        <h1>💰 PayTrack</h1>
                        <div className="header-actions">
                            <span className="user-email">{user.email}</span>
                            <button onClick={() => setShowConfig(!showConfig)} className="btn btn-secondary">
                                ⚙️ Configuración
                            </button>
                            <button onClick={handleLogout} className="btn btn-secondary">
                                Salir
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container">
                {showConfig && (
                    <div className="config-panel card fade-in">
                        <h2>Configuración de Deuda</h2>
                        <form onSubmit={handleSaveConfig} className="config-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="totalAmount">Total a Pagar (€)</label>
                                    <input
                                        type="number"
                                        id="totalAmount"
                                        value={totalAmount}
                                        onChange={(e) => setTotalAmount(e.target.value)}
                                        step="0.01"
                                        min="0.01"
                                        required
                                        placeholder="10000.00"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="defaultQuota">Cuota por Defecto (€)</label>
                                    <input
                                        type="number"
                                        id="defaultQuota"
                                        value={defaultQuota}
                                        onChange={(e) => setDefaultQuota(e.target.value)}
                                        step="0.01"
                                        min="0.01"
                                        required
                                        placeholder="500.00"
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Guardar Configuración
                            </button>
                        </form>
                    </div>
                )}

                {/* Section 1: Summary with chart and stats */}
                <PaymentChart
                    totalDebt={debtData.totalAmount}
                    totalPaid={totalPaid}
                    onAddPayment={() => setShowPaymentModal(true)}
                />

                {/* Section 2: Quota info and actions */}
                <div className="quota-section card">
                    <h2 className="chart-title">Información de Cuotas</h2>
                    <div className="quota-info-grid">
                        <div className="quota-info-item">
                            <div className="quota-info-label">Cuota Actual</div>
                            <div className="quota-info-value">€{adjustedQuota.toFixed(2)}</div>
                            {adjustedQuota !== debtData.defaultQuota && remainingAmount > 0 && (
                                <div className="quota-info-note">Ajustado automáticamente</div>
                            )}
                        </div>
                        <div className="quota-info-item">
                            <div className="quota-info-label">Cuotas Restantes</div>
                            <div className="quota-info-value">{remainingPayments}</div>
                        </div>
                    </div>
                    <div className="quota-actions">
                        <button
                            onClick={() => setShowQuotaModal(true)}
                            className="btn btn-primary"
                        >
                            ⚙️ Modificar Cuota
                        </button>
                        <button
                            onClick={handleGenerateReport}
                            className="btn btn-primary"
                        >
                            📤 Compartir Informe
                        </button>
                    </div>
                </div>

                {/* Section 3: Payment history */}
                <PaymentList payments={payments} />
            </main>

            {/* Modals */}
            <Modal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                title="Añadir Pago"
            >
                <PaymentForm
                    defaultQuota={adjustedQuota}
                    remainingAmount={remainingAmount}
                    onPaymentAdd={handleAddPayment}
                />
            </Modal>

            <Modal
                isOpen={showQuotaModal}
                onClose={() => setShowQuotaModal(false)}
                title="Modificar Cuota por Defecto"
            >
                <form onSubmit={handleUpdateQuota} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="quotaInput">Nueva Cuota (€)</label>
                        <input
                            type="number"
                            id="quotaInput"
                            value={quotaInput}
                            onChange={(e) => setQuotaInput(e.target.value)}
                            step="0.01"
                            min="0.01"
                            max={remainingAmount > 0 ? remainingAmount : undefined}
                            placeholder="Nueva cuota"
                            required
                        />
                        <p className="text-small text-muted" style={{ marginTop: '0.5rem' }}>
                            La cuota se ajustará automáticamente si es mayor al monto pendiente
                        </p>
                    </div>
                    <button type="submit" className="btn btn-primary w-full">
                        Actualizar Cuota
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Dashboard;
