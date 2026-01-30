import React, { useState, useEffect } from 'react';
import './EMICalculator.css';

// Common home loan schemes in India
const loanSchemes = [
    { name: 'PMAY - Credit Linked Subsidy', rate: 6.5, subsidy: 267000, eligibility: 'First-time buyers, income ≤ ₹18L/year' },
    { name: 'SBI Home Loan', rate: 8.5, subsidy: 0, eligibility: 'All buyers, salaried & self-employed' },
    { name: 'HDFC Home Loan', rate: 8.7, subsidy: 0, eligibility: 'All buyers, quick approval' },
    { name: 'ICICI Home Loan', rate: 8.75, subsidy: 0, eligibility: 'All buyers, digital process' },
    { name: 'LIC Housing Finance', rate: 8.65, subsidy: 0, eligibility: 'All buyers, flexible tenure' },
];

function EMICalculator({ propertyPrice, listingType }) {
    // Only show for sale properties
    if (listingType !== 'sale') return null;

    const [downPaymentPercent, setDownPaymentPercent] = useState(20);
    const [tenureYears, setTenureYears] = useState(20);
    const [selectedScheme, setSelectedScheme] = useState(loanSchemes[1]); // SBI default
    const [monthlyIncome, setMonthlyIncome] = useState('');
    const [showDetails, setShowDetails] = useState(false);

    // Calculations
    const downPayment = (propertyPrice * downPaymentPercent) / 100;
    const loanAmount = propertyPrice - downPayment - (selectedScheme.subsidy || 0);
    const monthlyRate = selectedScheme.rate / 12 / 100;
    const tenureMonths = tenureYears * 12;

    // EMI Formula: P × r × (1 + r)^n / ((1 + r)^n - 1)
    const emi = loanAmount > 0 ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
        (Math.pow(1 + monthlyRate, tenureMonths) - 1) : 0;

    const totalPayment = emi * tenureMonths;
    const totalInterest = totalPayment - loanAmount;

    // Affordability check
    const income = parseFloat(monthlyIncome) || 0;
    const emiToIncomeRatio = income > 0 ? (emi / income) * 100 : 0;
    const affordabilityStatus = emiToIncomeRatio === 0 ? 'unknown' :
        emiToIncomeRatio <= 40 ? 'excellent' :
            emiToIncomeRatio <= 50 ? 'good' :
                emiToIncomeRatio <= 60 ? 'stretched' : 'risky';

    // Tax benefits (simplified)
    const annualPrincipal = loanAmount / tenureYears;
    const annualInterest = totalInterest / tenureYears;
    const section80C = Math.min(annualPrincipal, 150000);
    const section24b = Math.min(annualInterest, 200000);
    const annualTaxSaving = (section80C + section24b) * 0.3; // 30% tax bracket

    const formatCurrency = (amount) => {
        if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
        return `₹${Math.round(amount).toLocaleString('en-IN')}`;
    };

    // Calculate pie chart percentages
    const principalPercent = (loanAmount / totalPayment) * 100;
    const interestPercent = (totalInterest / totalPayment) * 100;

    return (
        <div className="emi-calculator">
            <div className="emi-calculator__header">
                <div className="emi-calculator__title">
                    <div>
                        <h2>EMI Calculator</h2>
                        <p>Plan your home loan with ease</p>
                    </div>
                </div>
                <button
                    className="emi-calculator__toggle"
                    onClick={() => setShowDetails(!showDetails)}
                >
                    {showDetails ? 'Hide Details' : 'View Details'}
                </button>
            </div>

            {/* Main EMI Display */}
            <div className="emi-main-display">
                <div className="emi-big-number">
                    <span className="emi-label">Monthly EMI</span>
                    <span className="emi-value">{formatCurrency(emi)}</span>
                    <span className="emi-sublabel">for {tenureYears} years @ {selectedScheme.rate}%</span>
                </div>

                <div className="emi-breakdown-visual">
                    <div className="emi-pie-chart">
                        <svg viewBox="0 0 100 100">
                            <circle
                                cx="50" cy="50" r="40"
                                fill="none"
                                stroke="#c9a54d"
                                strokeWidth="20"
                                strokeDasharray={`${principalPercent * 2.51} ${interestPercent * 2.51}`}
                                transform="rotate(-90 50 50)"
                            />
                            <circle
                                cx="50" cy="50" r="40"
                                fill="none"
                                stroke="#ff6b6b"
                                strokeWidth="20"
                                strokeDasharray={`${interestPercent * 2.51} ${principalPercent * 2.51}`}
                                strokeDashoffset={`-${principalPercent * 2.51}`}
                                transform="rotate(-90 50 50)"
                            />
                        </svg>
                        <div className="emi-pie-center">
                            <span>{formatCurrency(totalPayment)}</span>
                            <small>Total</small>
                        </div>
                    </div>
                    <div className="emi-legend">
                        <div className="emi-legend-item">
                            <span className="legend-dot principal"></span>
                            <div>
                                <span className="legend-label">Principal</span>
                                <span className="legend-value">{formatCurrency(loanAmount)}</span>
                            </div>
                        </div>
                        <div className="emi-legend-item">
                            <span className="legend-dot interest"></span>
                            <div>
                                <span className="legend-label">Interest</span>
                                <span className="legend-value">{formatCurrency(totalInterest)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loan Schemes */}
            <div className="emi-schemes">
                <h3>Available Loan Schemes</h3>
                <div className="scheme-cards">
                    {loanSchemes.map((scheme, idx) => (
                        <div
                            key={idx}
                            className={`scheme-card ${selectedScheme.name === scheme.name ? 'selected' : ''}`}
                            onClick={() => setSelectedScheme(scheme)}
                        >
                            <div className="scheme-info">
                                <span className="scheme-name">{scheme.name}</span>
                                <span className="scheme-rate">{scheme.rate}% p.a.</span>
                            </div>
                            {scheme.subsidy > 0 && (
                                <span className="scheme-subsidy">Save {formatCurrency(scheme.subsidy)}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Detailed Controls (collapsible) */}
            {showDetails && (
                <div className="emi-details">
                    {/* Sliders */}
                    <div className="emi-controls">
                        <div className="emi-control">
                            <div className="control-header">
                                <label>Down Payment</label>
                                <span className="control-value">{downPaymentPercent}% ({formatCurrency(downPayment)})</span>
                            </div>
                            <input
                                type="range"
                                min="10"
                                max="50"
                                step="5"
                                value={downPaymentPercent}
                                onChange={(e) => setDownPaymentPercent(parseInt(e.target.value))}
                            />
                            <div className="control-range">
                                <span>10%</span>
                                <span>50%</span>
                            </div>
                        </div>

                        <div className="emi-control">
                            <div className="control-header">
                                <label>Loan Tenure</label>
                                <span className="control-value">{tenureYears} years</span>
                            </div>
                            <input
                                type="range"
                                min="5"
                                max="30"
                                step="1"
                                value={tenureYears}
                                onChange={(e) => setTenureYears(parseInt(e.target.value))}
                            />
                            <div className="control-range">
                                <span>5 yrs</span>
                                <span>30 yrs</span>
                            </div>
                        </div>

                        <div className="emi-control">
                            <div className="control-header">
                                <label>Monthly Income (Optional)</label>
                            </div>
                            <input
                                type="number"
                                placeholder="₹ Enter your monthly income"
                                value={monthlyIncome}
                                onChange={(e) => setMonthlyIncome(e.target.value)}
                                className="income-input"
                            />
                        </div>
                    </div>

                    {/* Affordability Status */}
                    {income > 0 && (
                        <div className={`affordability-card ${affordabilityStatus}`}>
                            <div className="affordability-header">
                                <span className="affordability-icon">
                                    {affordabilityStatus === 'excellent' ? '✓' :
                                        affordabilityStatus === 'good' ? '✓' :
                                            affordabilityStatus === 'stretched' ? '!' : '×'}
                                </span>
                                <div>
                                    <span className="affordability-status">
                                        {affordabilityStatus === 'excellent' ? 'Excellent Fit' :
                                            affordabilityStatus === 'good' ? 'Good Fit' :
                                                affordabilityStatus === 'stretched' ? 'Slightly Stretched' : 'High Risk'}
                                    </span>
                                    <span className="affordability-ratio">EMI is {emiToIncomeRatio.toFixed(1)}% of your income</span>
                                </div>
                            </div>
                            <div className="affordability-bar">
                                <div
                                    className="affordability-fill"
                                    style={{ width: `${Math.min(emiToIncomeRatio, 100)}%` }}
                                ></div>
                                <div className="affordability-markers">
                                    <span style={{ left: '40%' }}>40%</span>
                                    <span style={{ left: '50%' }}>50%</span>
                                    <span style={{ left: '60%' }}>60%</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tax Benefits */}
                    <div className="tax-benefits">
                        <h3>Tax Benefits</h3>
                        <div className="tax-grid">
                            <div className="tax-item">
                                <span className="tax-section">Section 80C</span>
                                <span className="tax-amount">{formatCurrency(section80C)}</span>
                                <span className="tax-desc">Principal repayment</span>
                            </div>
                            <div className="tax-item">
                                <span className="tax-section">Section 24(b)</span>
                                <span className="tax-amount">{formatCurrency(section24b)}</span>
                                <span className="tax-desc">Interest deduction</span>
                            </div>
                            <div className="tax-item highlight">
                                <span className="tax-section">Annual Savings</span>
                                <span className="tax-amount">{formatCurrency(annualTaxSaving)}</span>
                                <span className="tax-desc">At 30% tax bracket</span>
                            </div>
                        </div>
                    </div>

                    {/* Selected Scheme Details */}
                    <div className="scheme-details">
                        <h3>{selectedScheme.name}</h3>
                        <p className="scheme-eligibility">{selectedScheme.eligibility}</p>
                        <div className="scheme-summary">
                            <div className="summary-item">
                                <span className="summary-label">Property Price</span>
                                <span className="summary-value">{formatCurrency(propertyPrice)}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Down Payment</span>
                                <span className="summary-value">{formatCurrency(downPayment)}</span>
                            </div>
                            {selectedScheme.subsidy > 0 && (
                                <div className="summary-item subsidy">
                                    <span className="summary-label">PMAY Subsidy</span>
                                    <span className="summary-value">-{formatCurrency(selectedScheme.subsidy)}</span>
                                </div>
                            )}
                            <div className="summary-item">
                                <span className="summary-label">Loan Amount</span>
                                <span className="summary-value">{formatCurrency(loanAmount)}</span>
                            </div>
                            <div className="summary-item total">
                                <span className="summary-label">Total Payable</span>
                                <span className="summary-value">{formatCurrency(totalPayment)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EMICalculator;
