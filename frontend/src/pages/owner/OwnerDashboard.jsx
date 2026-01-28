import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardSidebar from '../../components/owner/DashboardSidebar';
import AnalyticsOverview from '../../components/owner/AnalyticsOverview';
import MyProperties from '../../components/owner/MyProperties';
import InquiryInbox from '../../components/owner/InquiryInbox';
import VisitCalendar from '../../components/owner/VisitCalendar';
import OwnerSettings from '../../components/owner/OwnerSettings';
import AddPropertyWizard from './AddPropertyWizard';
import './OwnerDashboard.css';

function OwnerDashboard({ onLogout }) {
    const { user, logout } = useAuth();
    const [activeSection, setActiveSection] = useState('analytics');

    const handleLogout = () => {
        logout();
        onLogout();
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'analytics':
                return <AnalyticsOverview />;
            case 'properties':
                return <MyProperties onAddProperty={() => setActiveSection('add-property')} />;
            case 'add-property':
                return <AddPropertyWizard onComplete={() => setActiveSection('properties')} />;
            case 'inquiries':
                return <InquiryInbox />;
            case 'calendar':
                return <VisitCalendar />;
            case 'settings':
                return <OwnerSettings />;
            default:
                return <AnalyticsOverview />;
        }
    };

    return (
        <div className="owner-dashboard">
            <DashboardSidebar
                activeSection={activeSection}
                onSectionChange={setActiveSection}
                onLogout={handleLogout}
            />

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div className="header-left">
                        <h1>{getSectionTitle(activeSection)}</h1>
                    </div>
                    <div className="header-right">
                        <div className="user-info">
                            <span className="user-name">{user?.name || 'Owner'}</span>
                            <span className="trust-badge">
                                Trust Level {user?.verification_level || 2}
                            </span>
                        </div>
                    </div>
                </header>

                <div className="dashboard-content">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}

function getSectionTitle(section) {
    const titles = {
        'analytics': '📊 Analytics Dashboard',
        'properties': '🏠 My Properties',
        'add-property': '➕ Add New Property',
        'inquiries': '💬 Inquiries',
        'calendar': '📅 Calendar',
        'settings': '⚙️ Settings'
    };
    return titles[section] || 'Dashboard';
}

export default OwnerDashboard;

