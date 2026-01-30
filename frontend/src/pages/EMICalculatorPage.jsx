import React, { useState } from 'react';
import './EMICalculatorPage.css';

// Common home loan schemes in India
const loanSchemes = [
    { name: 'PMAY - Credit Linked Subsidy', rate: 6.5, subsidy: 267000, eligibility: 'First-time buyers, income ≤ ₹18L/year', icon: 'pmay', color: '#27ae60' },
    { name: 'SBI Home Loan', rate: 8.5, subsidy: 0, eligibility: 'All buyers, salaried & self-employed', icon: 'sbi', color: '#2962ff' },
    { name: 'HDFC Home Loan', rate: 8.7, subsidy: 0, eligibility: 'All buyers, quick approval', icon: 'hdfc', color: '#e91e63' },
    { name: 'ICICI Home Loan', rate: 8.75, subsidy: 0, eligibility: 'All buyers, digital process', icon: 'icici', color: '#ff5722' },
    { name: 'LIC Housing Finance', rate: 8.65, subsidy: 0, eligibility: 'All buyers, flexible tenure', icon: 'lic', color: '#9c27b0' },
];

// Government schemes data
const govtSchemes = [
    {
        name: 'PMAY - Pradhan Mantri Awas Yojana',
        category: 'Subsidy',
        benefit: 'Up to ₹2.67 Lakh',
        eligibility: 'First-time buyers with annual income ≤ ₹18 Lakh',
        details: 'Interest subsidy on home loans for EWS, LIG, MIG-I & MIG-II categories',
        icon: 'govt',
        color: '#27ae60'
    },
    {
        name: 'Section 80C - Principal Repayment',
        category: 'Tax Deduction',
        benefit: 'Up to ₹1.5 Lakh/year',
        eligibility: 'All home loan borrowers',
        details: 'Deduction on principal repayment including stamp duty & registration',
        icon: 'document',
        color: '#c9a54d'
    },
    {
        name: 'Section 24(b) - Interest Deduction',
        category: 'Tax Deduction',
        benefit: 'Up to ₹2 Lakh/year',
        eligibility: 'Self-occupied property owners',
        details: 'Deduction on interest paid for self-occupied property (no limit for let-out)',
        icon: 'savings',
        color: '#3498db'
    },
    {
        name: 'Section 80EE - First Time Buyers',
        category: 'Additional Benefit',
        benefit: 'Extra ₹50,000/year',
        eligibility: 'First-time buyers, loan ≤ ₹35L, property ≤ ₹50L',
        details: 'Additional deduction over and above Section 24(b) for first-time buyers',
        icon: 'home',
        color: '#9b59b6'
    },
    {
        name: 'Section 80EEA - Affordable Housing',
        category: 'Additional Benefit',
        benefit: 'Extra ₹1.5 Lakh/year',
        eligibility: 'Stamp value ≤ ₹45L, no other house owned',
        details: 'For affordable housing purchased between Apr 2019 - Mar 2022 (extended)',
        icon: 'apartment',
        color: '#e74c3c'
    },
    {
        name: 'Joint Home Loan Benefits',
        category: 'Tax Strategy',
        benefit: 'Double Deductions',
        eligibility: 'Co-borrowers who are co-owners',
        details: 'Both borrowers can claim separate deductions under 80C & 24(b)',
        icon: 'users',
        color: '#1abc9c'
    }
];

// SVG Icon Components
const SchemeIcon = ({ type, size = 32 }) => {
    const icons = {
        govt: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/>
            </svg>
        ),
        document: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
            </svg>
        ),
        savings: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/><path d="M12 6v12M8 10h8M8 14h8"/>
            </svg>
        ),
        home: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>
            </svg>
        ),
        apartment: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 6h2M13 6h2M9 10h2M13 10h2M9 14h2M13 14h2M9 18h6"/>
            </svg>
        ),
        users: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
        ),
        pmay: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/>
            </svg>
        ),
        sbi: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
            </svg>
        ),
        hdfc: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12h8M12 8v8"/>
            </svg>
        ),
        icici: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>
            </svg>
        ),
        lic: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
        ),
        check: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/>
            </svg>
        ),
        good: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>
            </svg>
        ),
        warning: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
        ),
        error: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
        )
    };
    return icons[type] || icons.home;
};

function EMICalculatorPage({ onBack }) {
    const [propertyPrice, setPropertyPrice] = useState(5000000);
    const [downPaymentPercent, setDownPaymentPercent] = useState(20);
    const [tenureYears, setTenureYears] = useState(20);
    const [selectedScheme, setSelectedScheme] = useState(loanSchemes[1]);
    const [monthlyIncome, setMonthlyIncome] = useState('');
    const [isFirstTimeBuyer, setIsFirstTimeBuyer] = useState(true);
    const [isJointLoan, setIsJointLoan] = useState(false);

    // Calculations
    const downPayment = (propertyPrice * downPaymentPercent) / 100;
    const loanAmount = Math.max(0, propertyPrice - downPayment - (selectedScheme.subsidy || 0));
    const monthlyRate = selectedScheme.rate / 12 / 100;
    const tenureMonths = tenureYears * 12;

    // EMI Formula
    const emi = loanAmount > 0 && monthlyRate > 0 ?
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
        (Math.pow(1 + monthlyRate, tenureMonths) - 1) : 0;

    const totalPayment = emi * tenureMonths;
    const totalInterest = totalPayment - loanAmount;

    // Affordability
    const income = parseFloat(monthlyIncome) || 0;
    const emiToIncomeRatio = income > 0 ? (emi / income) * 100 : 0;
    const affordabilityStatus = emiToIncomeRatio === 0 ? 'unknown' :
        emiToIncomeRatio <= 40 ? 'excellent' :
            emiToIncomeRatio <= 50 ? 'good' :
                emiToIncomeRatio <= 60 ? 'stretched' : 'risky';

    // Enhanced Tax benefits calculation
    const annualPrincipal = loanAmount / tenureYears;
    const annualInterest = totalInterest / tenureYears;
    const section80C = Math.min(annualPrincipal, 150000);
    const section24b = Math.min(annualInterest, 200000);
    const section80EE = isFirstTimeBuyer && loanAmount <= 3500000 && propertyPrice <= 5000000 ? Math.min(annualInterest - section24b, 50000) : 0;
    const section80EEA = isFirstTimeBuyer && propertyPrice <= 4500000 ? Math.min(Math.max(annualInterest - section24b - section80EE, 0), 150000) : 0;
    
    // Joint loan multiplier
    const jointMultiplier = isJointLoan ? 2 : 1;
    
    const totalDeduction = (section80C + section24b + section80EE + section80EEA) * jointMultiplier;
    const annualTaxSaving = totalDeduction * 0.3; // 30% tax bracket
    const monthlyTaxSaving = annualTaxSaving / 12;
    const effectiveEMI = emi - monthlyTaxSaving;

    const formatCurrency = (amount) => {
        if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
        return `₹${Math.round(amount).toLocaleString('en-IN')}`;
    };

    const principalPercent = totalPayment > 0 ? (loanAmount / totalPayment) * 100 : 50;
    const interestPercent = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 50;

    return (
        <div className="emi-page">
            {/* Header */}
            <div className="emi-page__header">
                <button className="btn btn-outline" onClick={onBack}>← Back to Properties</button>
                <div className="emi-page__title">
                    <h1>Home Loan EMI Calculator</h1>
                    <p>Plan your dream home with precision</p>
                </div>
            </div>

            <div className="emi-page__content">
                {/* Left Panel - Controls */}
                <div className="emi-page__controls">
                    {/* Property Price */}
                    <div className="emi-control-group">
                        <label>Property Price</label>
                        <div className="emi-input-with-value">
                            <input
                                type="number"
                                value={propertyPrice}
                                onChange={(e) => setPropertyPrice(Number(e.target.value))}
                            />
                            <span className="emi-display-value">{formatCurrency(propertyPrice)}</span>
                        </div>
                        <input
                            type="range"
                            min="1000000"
                            max="100000000"
                            step="500000"
                            value={propertyPrice}
                            onChange={(e) => setPropertyPrice(Number(e.target.value))}
                        />
                        <div className="range-labels">
                            <span>₹10L</span>
                            <span>₹10Cr</span>
                        </div>
                    </div>

                    {/* Down Payment */}
                    <div className="emi-control-group">
                        <label>Down Payment: {downPaymentPercent}%</label>
                        <span className="control-subvalue">{formatCurrency(downPayment)}</span>
                        <input
                            type="range"
                            min="10"
                            max="50"
                            step="5"
                            value={downPaymentPercent}
                            onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                        />
                        <div className="range-labels">
                            <span>10%</span>
                            <span>50%</span>
                        </div>
                    </div>

                    {/* Loan Tenure */}
                    <div className="emi-control-group">
                        <label>Loan Tenure: {tenureYears} years</label>
                        <input
                            type="range"
                            min="5"
                            max="30"
                            step="1"
                            value={tenureYears}
                            onChange={(e) => setTenureYears(Number(e.target.value))}
                        />
                        <div className="range-labels">
                            <span>5 yrs</span>
                            <span>30 yrs</span>
                        </div>
                    </div>

                    {/* Monthly Income */}
                    <div className="emi-control-group">
                        <label>Monthly Income (for affordability check)</label>
                        <input
                            type="number"
                            placeholder="₹ Enter your monthly income"
                            value={monthlyIncome}
                            onChange={(e) => setMonthlyIncome(e.target.value)}
                            className="income-input"
                        />
                    </div>

                    {/* Buyer Options */}
                    <div className="emi-control-group">
                        <label>Tax Benefit Options</label>
                        <div className="buyer-options">
                            <label className="checkbox-option">
                                <input
                                    type="checkbox"
                                    checked={isFirstTimeBuyer}
                                    onChange={(e) => setIsFirstTimeBuyer(e.target.checked)}
                                />
                                <span className="checkbox-custom"></span>
                                <span className="checkbox-label">First-time Home Buyer</span>
                            </label>
                            <label className="checkbox-option">
                                <input
                                    type="checkbox"
                                    checked={isJointLoan}
                                    onChange={(e) => setIsJointLoan(e.target.checked)}
                                />
                                <span className="checkbox-custom"></span>
                                <span className="checkbox-label">Joint Home Loan</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Results */}
                <div className="emi-page__results">
                    {/* Big EMI Display */}
                    <div className="emi-hero-card">
                        <div className="emi-hero-left">
                            <span className="emi-label">Your Monthly EMI</span>
                            <span className="emi-big-value">{formatCurrency(emi)}</span>
                            <span className="emi-sub">@ {selectedScheme.rate}% for {tenureYears} years</span>
                        </div>
                        <div className="emi-hero-right">
                            <div className="emi-donut">
                                <svg viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                                    <circle
                                        cx="50" cy="50" r="45"
                                        fill="none"
                                        stroke="#c9a54d"
                                        strokeWidth="10"
                                        strokeDasharray={`${principalPercent * 2.83} ${interestPercent * 2.83}`}
                                        transform="rotate(-90 50 50)"
                                    />
                                </svg>
                                <div className="emi-donut-center">
                                    <span className="donut-total">{formatCurrency(totalPayment)}</span>
                                    <span className="donut-label">Total</span>
                                </div>
                            </div>
                            <div className="emi-legend">
                                <div className="legend-item">
                                    <span className="legend-dot" style={{ background: '#c9a54d' }}></span>
                                    <div>
                                        <span className="legend-label">Principal</span>
                                        <span className="legend-value">{formatCurrency(loanAmount)}</span>
                                    </div>
                                </div>
                                <div className="legend-item">
                                    <span className="legend-dot" style={{ background: '#ff6b6b' }}></span>
                                    <div>
                                        <span className="legend-label">Interest</span>
                                        <span className="legend-value">{formatCurrency(totalInterest)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Affordability Card */}
                    {income > 0 && (
                        <div className={`affordability-card ${affordabilityStatus}`}>
                            <div className="affordability-content">
                                <span className="affordability-icon">
                                    <SchemeIcon type={affordabilityStatus === 'excellent' ? 'check' :
                                        affordabilityStatus === 'good' ? 'good' :
                                            affordabilityStatus === 'stretched' ? 'warning' : 'error'} size={28} />
                                </span>
                                <div className="affordability-text">
                                    <span className="affordability-title">
                                        {affordabilityStatus === 'excellent' ? 'Excellent Fit!' :
                                            affordabilityStatus === 'good' ? 'Good Fit' :
                                                affordabilityStatus === 'stretched' ? 'Slightly Stretched' : 'High Risk'}
                                    </span>
                                    <span className="affordability-desc">
                                        EMI is {emiToIncomeRatio.toFixed(1)}% of your income
                                    </span>
                                </div>
                            </div>
                            <div className="affordability-bar">
                                <div className="affordability-fill" style={{ width: `${Math.min(emiToIncomeRatio, 100)}%` }}></div>
                            </div>
                        </div>
                    )}

                    {/* Tax Benefits */}
                    <div className="tax-benefits-card">
                        <h3>Your Tax Benefits Breakdown</h3>
                        <div className="tax-benefits-grid">
                            <div className="tax-item">
                                <span className="tax-label">Section 80C</span>
                                <span className="tax-value">{formatCurrency(section80C * jointMultiplier)}</span>
                                <span className="tax-desc">Principal Repayment</span>
                            </div>
                            <div className="tax-item">
                                <span className="tax-label">Section 24(b)</span>
                                <span className="tax-value">{formatCurrency(section24b * jointMultiplier)}</span>
                                <span className="tax-desc">Interest Deduction</span>
                            </div>
                            {section80EE > 0 && (
                                <div className="tax-item bonus">
                                    <span className="tax-label">Section 80EE</span>
                                    <span className="tax-value">{formatCurrency(section80EE * jointMultiplier)}</span>
                                    <span className="tax-desc">First-time Buyer Bonus</span>
                                </div>
                            )}
                            {section80EEA > 0 && (
                                <div className="tax-item bonus">
                                    <span className="tax-label">Section 80EEA</span>
                                    <span className="tax-value">{formatCurrency(section80EEA * jointMultiplier)}</span>
                                    <span className="tax-desc">Affordable Housing</span>
                                </div>
                            )}
                            <div className="tax-item total">
                                <span className="tax-label">Total Deduction</span>
                                <span className="tax-value">{formatCurrency(totalDeduction)}</span>
                                <span className="tax-desc">Per Year</span>
                            </div>
                            <div className="tax-item highlight">
                                <span className="tax-label">Annual Tax Saved</span>
                                <span className="tax-value">{formatCurrency(annualTaxSaving)}</span>
                                <span className="tax-desc">@ 30% Tax Bracket</span>
                            </div>
                        </div>

                        {/* Effective EMI after tax benefit */}
                        <div className="effective-emi-card">
                            <div className="effective-emi-content">
                                <div className="effective-emi-item">
                                    <span className="effective-label">Actual EMI</span>
                                    <span className="effective-value">{formatCurrency(emi)}</span>
                                </div>
                                <div className="effective-emi-minus">−</div>
                                <div className="effective-emi-item">
                                    <span className="effective-label">Monthly Tax Benefit</span>
                                    <span className="effective-value benefit">{formatCurrency(monthlyTaxSaving)}</span>
                                </div>
                                <div className="effective-emi-equals">=</div>
                                <div className="effective-emi-item final">
                                    <span className="effective-label">Effective EMI</span>
                                    <span className="effective-value final">{formatCurrency(effectiveEMI)}</span>
                                </div>
                            </div>
                        </div>

                        {isJointLoan && (
                            <div className="joint-loan-note">
                                <span className="note-icon"><SchemeIcon type="users" size={20} /></span>
                                <span>Joint loan benefits applied - Both borrowers can claim deductions separately</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Government Schemes Section */}
            <div className="emi-page__govt-schemes">
                <h2>Government Schemes & Tax Benefits</h2>
                <p className="section-subtitle">Maximize your savings with these schemes</p>
                <div className="govt-schemes-grid">
                    {govtSchemes.map((scheme, idx) => (
                        <div key={idx} className="govt-scheme-card" style={{ '--scheme-accent': scheme.color }}>
                            <div className="scheme-badge">{scheme.category}</div>
                            <div className="scheme-icon-large"><SchemeIcon type={scheme.icon} size={36} /></div>
                            <h4>{scheme.name}</h4>
                            <div className="scheme-benefit">{scheme.benefit}</div>
                            <p className="scheme-eligibility">{scheme.eligibility}</p>
                            <p className="scheme-details">{scheme.details}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Loan Schemes Section */}
            <div className="emi-page__schemes">
                <h2>Compare Home Loan Schemes</h2>
                <div className="schemes-grid">
                    {loanSchemes.map((scheme, idx) => (
                        <div
                            key={idx}
                            className={`scheme-card ${selectedScheme.name === scheme.name ? 'selected' : ''}`}
                            onClick={() => setSelectedScheme(scheme)}
                            style={{ '--scheme-color': scheme.color }}
                        >
                            <div className="scheme-header">
                                <span className="scheme-icon"><SchemeIcon type={scheme.icon} size={28} /></span>
                                <span className="scheme-rate">{scheme.rate}%</span>
                            </div>
                            <h4>{scheme.name}</h4>
                            <p>{scheme.eligibility}</p>
                            {scheme.subsidy > 0 && (
                                <div className="scheme-subsidy">
                                    Save {formatCurrency(scheme.subsidy)} with PMAY
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default EMICalculatorPage;
