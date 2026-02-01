import React, { useState } from 'react';
import './PaymentForm.css';

const PaymentForm = ({ defaultQuota, remainingAmount, onPaymentAdd }) => {
    const [amount, setAmount] = useState(defaultQuota.toString());
    const [concept, setConcept] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const numAmount = parseFloat(amount);

        if (isNaN(numAmount) || numAmount <= 0) {
            alert('Por favor ingresa un importe válido');
            return;
        }

        if (numAmount > remainingAmount) {
            alert(`El importe no puede ser mayor al pendiente: €${remainingAmount.toFixed(2)}`);
            return;
        }

        setLoading(true);
        await onPaymentAdd(numAmount, concept);
        setLoading(false);

        // Reset form
        setConcept('');
        // Keep the amount as default quota for next payment
    };

    // Update amount when defaultQuota changes
    React.useEffect(() => {
        setAmount(Math.min(defaultQuota, remainingAmount).toFixed(2));
    }, [defaultQuota, remainingAmount]);

    return (
        <div className="payment-form-container">
            <form onSubmit={handleSubmit} className="payment-form">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="amount">Importe (€)</label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            step="0.01"
                            min="0.01"
                            max={remainingAmount}
                            required
                            disabled={loading || remainingAmount <= 0}
                            placeholder="0.00"
                        />
                    </div>

                    <div className="form-group flex-grow">
                        <label htmlFor="concept">Concepto (opcional)</label>
                        <input
                            type="text"
                            id="concept"
                            value={concept}
                            onChange={(e) => setConcept(e.target.value)}
                            placeholder="Ej: Pago mensual enero"
                            disabled={loading || remainingAmount <= 0}
                            maxLength={100}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={loading || remainingAmount <= 0}
                >
                    {loading ? 'Guardando...' : 'Añadir Pago'}
                </button>
            </form>
        </div>
    );
};

export default PaymentForm;
