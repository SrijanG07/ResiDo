import React from 'react';
import './DashboardSidebar.css';

function DashboardSidebar({ activeSection, onSectionChange, onLogout }) {
    const menuItems = [
        { id: 'analytics', icon: '📊', label: 'Analytics' },
        { id: 'properties', icon: '🏠', label: 'My Properties' },
        { id: 'add-property', icon: '➕', label: 'Add Property' },
        { id: 'inquiries', icon: '💬', label: 'Inquiries', badge: 3 },
        { id: 'calendar', icon: '📅', label: 'Calendar' },
        { id: 'settings', icon: '⚙️', label: 'Settings' }
    ];

    return (
        <aside className="dashboard-sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <span className="logo-icon">🏠</span>
                    <span className="logo-text">Owner Hub</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                        onClick={() => onSectionChange(item.id)}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                        {item.badge && (
                            <span className="nav-badge">{item.badge}</span>
                        )}
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button className="logout-btn" onClick={onLogout}>
                    <span>🚪</span>
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}

export default DashboardSidebar;
