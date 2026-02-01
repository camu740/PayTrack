import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import './PaymentList.css';

const PaymentList = ({ payments }) => {
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [searchTerm, setSearchTerm] = useState('');

    // Filter and sort payments
    const filteredAndSortedPayments = useMemo(() => {
        let result = [...payments];

        // Filter by search term
        if (searchTerm) {
            result = result.filter(payment =>
                payment.concept.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort
        result.sort((a, b) => {
            let comparison = 0;

            if (sortBy === 'date') {
                comparison = new Date(a.createdAt) - new Date(b.createdAt);
            } else if (sortBy === 'amount') {
                comparison = a.amount - b.amount;
            }

            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return result;
    }, [payments, sortBy, sortOrder, searchTerm]);

    const handleSortChange = (newSortBy) => {
        if (sortBy === newSortBy) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(newSortBy);
            setSortOrder('desc');
        }
    };

    return (
        <div className="payment-list-container card fade-in">
            <div className="list-header">
                <h2 className="chart-title">Historial de Transferencias</h2>
                <p className="text-muted text-small">
                    {payments.length} transferencia{payments.length !== 1 ? 's' : ''} registrada{payments.length !== 1 ? 's' : ''}
                </p>
            </div>

            <div className="list-controls">
                <input
                    type="text"
                    placeholder="🔍 Buscar por concepto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />

                <div className="sort-buttons">
                    <button
                        className={`btn btn-secondary sort-btn ${sortBy === 'date' ? 'active' : ''}`}
                        onClick={() => handleSortChange('date')}
                    >
                        Fecha {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </button>
                    <button
                        className={`btn btn-secondary sort-btn ${sortBy === 'amount' ? 'active' : ''}`}
                        onClick={() => handleSortChange('amount')}
                    >
                        Importe {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </button>
                </div>
            </div>

            {filteredAndSortedPayments.length === 0 ? (
                <div className="empty-state">
                    <p className="text-muted">
                        {searchTerm ? 'No se encontraron transferencias con ese concepto' : 'No hay transferencias registradas aún'}
                    </p>
                </div>
            ) : (
                <div className="payments-list">
                    {filteredAndSortedPayments.map((payment) => (
                        <div key={payment.id} className="payment-item">
                            <div className="payment-info">
                                <div className="payment-amount">€{payment.amount.toFixed(2)}</div>
                                <div className="payment-concept">
                                    {payment.concept || <span className="text-muted">Sin concepto</span>}
                                </div>
                            </div>
                            <div className="payment-date">
                                {payment.createdAt ? format(payment.createdAt, 'dd/MM/yyyy HH:mm') : 'N/A'}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PaymentList;
