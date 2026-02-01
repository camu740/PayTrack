import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import './PaymentChart.css';

const PaymentChart = ({ totalDebt, totalPaid, onAddPayment }) => {
    const remaining = Math.max(0, totalDebt - totalPaid);
    const percentage = totalDebt > 0 ? ((totalPaid / totalDebt) * 100).toFixed(1) : 0;

    const data = [
        { name: 'Pagado', value: totalPaid },
        { name: 'Pendiente', value: remaining }
    ];

    const COLORS = ['#10b981', '#334155'];

    const CustomLabel = ({ cx, cy }) => {
        return (
            <text
                x={cx}
                y={cy}
                fill="#f1f5f9"
                textAnchor="middle"
                dominantBaseline="central"
                className="chart-percentage"
            >
                {percentage}%
            </text>
        );
    };

    return (
        <div className="payment-chart-container card fade-in">
            <h2 className="chart-title">Progreso de Pago</h2>

            <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={CustomLabel}
                            outerRadius={100}
                            innerRadius={60}
                            fill="#8884d8"
                            dataKey="value"
                            animationBegin={0}
                            animationDuration={800}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                background: 'rgba(30, 41, 59, 0.95)',
                                border: '1px solid rgba(148, 163, 184, 0.15)',
                                borderRadius: '0.5rem',
                                color: '#f1f5f9'
                            }}
                            formatter={(value) => `€${value.toFixed(2)}`}
                        />
                        <Legend
                            wrapperStyle={{
                                color: '#cbd5e1'
                            }}
                            formatter={(value) => <span style={{ color: '#cbd5e1' }}>{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="chart-stats">
                <div className="stat-item">
                    <span className="stat-label">Total a pagar</span>
                    <span className="stat-value">€{totalDebt.toFixed(2)}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Total pagado</span>
                    <span className="stat-value stat-success">€{totalPaid.toFixed(2)}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Pendiente</span>
                    <span className="stat-value stat-warning">€{remaining.toFixed(2)}</span>
                </div>
                <div className="stat-item stat-item-button">
                    <button
                        onClick={onAddPayment}
                        className="btn btn-primary w-full btn-add-payment"
                        disabled={remaining <= 0}
                    >
                        ➕ Añadir Pago
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentChart;
