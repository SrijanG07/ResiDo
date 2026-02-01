import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './OwnerSettings.css';

function OwnerSettings() {
    const { user } = useAuth();

    const [profile, setProfile] = useState({
        name: user?.name || 'Property Owner',
        email: user?.email || 'owner@ResiDo.com',
        phone: '9876543210',
        company: 'Sharma Properties',
        address: 'Koramangala, Bangalore',
        bio: 'Experienced property owner with 5+ years in real estate.'
    });

    const [notifications, setNotifications] = useState({
        emailInquiries: true,
        emailUpdates: true,
        smsInquiries: false,
        pushNotifications: true,
        weeklyReport: true,
        priceAlerts: true
    });

    const [preferences, setPreferences] = useState({
        autoReply: true,
        showPhone: true,
        showEmail: true,
        instantBooking: false,
        defaultResponseTime: '24h'
    });

    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="owner-settings">
            {saved && (
                <div className="save-toast">
                    ✓ Settings saved successfully!
                </div>
            )}

            {/* Profile Section */}
            <div className="settings-section">
                <h3>Profile Information</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input
                            type="tel"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Company Name</label>
                        <input
                            type="text"
                            value={profile.company}
                            onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                        />
                    </div>
                    <div className="form-group full-width">
                        <label>Address</label>
                        <input
                            type="text"
                            value={profile.address}
                            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                        />
                    </div>
                    <div className="form-group full-width">
                        <label>Bio</label>
                        <textarea
                            rows={3}
                            value={profile.bio}
                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* Notification Settings */}
            <div className="settings-section">
                <h3>Notification Preferences</h3>
                <div className="toggle-grid">
                    <div className="toggle-item">
                        <div className="toggle-info">
                            <span className="toggle-label">Email for New Inquiries</span>
                            <span className="toggle-desc">Get notified when someone inquires about your property</span>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={notifications.emailInquiries}
                                onChange={(e) => setNotifications({ ...notifications, emailInquiries: e.target.checked })}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    <div className="toggle-item">
                        <div className="toggle-info">
                            <span className="toggle-label">SMS Notifications</span>
                            <span className="toggle-desc">Receive SMS alerts for urgent matters</span>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={notifications.smsInquiries}
                                onChange={(e) => setNotifications({ ...notifications, smsInquiries: e.target.checked })}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    <div className="toggle-item">
                        <div className="toggle-info">
                            <span className="toggle-label">Push Notifications</span>
                            <span className="toggle-desc">Browser push notifications for instant updates</span>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={notifications.pushNotifications}
                                onChange={(e) => setNotifications({ ...notifications, pushNotifications: e.target.checked })}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    <div className="toggle-item">
                        <div className="toggle-info">
                            <span className="toggle-label">Weekly Performance Report</span>
                            <span className="toggle-desc">Receive weekly analytics summary via email</span>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={notifications.weeklyReport}
                                onChange={(e) => setNotifications({ ...notifications, weeklyReport: e.target.checked })}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    <div className="toggle-item">
                        <div className="toggle-info">
                            <span className="toggle-label">Price Change Alerts</span>
                            <span className="toggle-desc">Get notified when similar properties change prices</span>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={notifications.priceAlerts}
                                onChange={(e) => setNotifications({ ...notifications, priceAlerts: e.target.checked })}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Listing Preferences */}
            <div className="settings-section">
                <h3>Listing Preferences</h3>
                <div className="toggle-grid">
                    <div className="toggle-item">
                        <div className="toggle-info">
                            <span className="toggle-label">Auto-Reply to Inquiries</span>
                            <span className="toggle-desc">Send automatic acknowledgement to new inquiries</span>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={preferences.autoReply}
                                onChange={(e) => setPreferences({ ...preferences, autoReply: e.target.checked })}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    <div className="toggle-item">
                        <div className="toggle-info">
                            <span className="toggle-label">Show Phone Number</span>
                            <span className="toggle-desc">Display your phone on property listings</span>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={preferences.showPhone}
                                onChange={(e) => setPreferences({ ...preferences, showPhone: e.target.checked })}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    <div className="toggle-item">
                        <div className="toggle-info">
                            <span className="toggle-label">Show Email</span>
                            <span className="toggle-desc">Display your email on property listings</span>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={preferences.showEmail}
                                onChange={(e) => setPreferences({ ...preferences, showEmail: e.target.checked })}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    <div className="toggle-item">
                        <div className="toggle-info">
                            <span className="toggle-label">Enable Instant Booking</span>
                            <span className="toggle-desc">Allow buyers to book visits without approval</span>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={preferences.instantBooking}
                                onChange={(e) => setPreferences({ ...preferences, instantBooking: e.target.checked })}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>

                <div className="form-group" style={{ marginTop: '1.5rem', maxWidth: '300px' }}>
                    <label>Default Response Time</label>
                    <select
                        value={preferences.defaultResponseTime}
                        onChange={(e) => setPreferences({ ...preferences, defaultResponseTime: e.target.value })}
                    >
                        <option value="1h">Within 1 hour</option>
                        <option value="6h">Within 6 hours</option>
                        <option value="24h">Within 24 hours</option>
                        <option value="48h">Within 48 hours</option>
                    </select>
                </div>
            </div>

            {/* Verification Section */}
            <div className="settings-section">
                <h3>Account Verification</h3>
                <div className="verification-status">
                    <div className="verification-item verified">
                        <span className="v-icon">✓</span>
                        <span className="v-label">Email Verified</span>
                    </div>
                    <div className="verification-item verified">
                        <span className="v-icon">✓</span>
                        <span className="v-label">Phone Verified</span>
                    </div>
                    <div className="verification-item pending">
                        <span className="v-icon">○</span>
                        <span className="v-label">ID Verification</span>
                        <button className="btn btn-outline btn-sm">Verify Now</button>
                    </div>
                </div>
                <div className="trust-level-card">
                    <div className="trust-info">
                        <span className="trust-label">Trust Level</span>
                        <div className="trust-progress">
                            <div className="progress-bar" style={{ width: '66%' }}></div>
                        </div>
                        <span className="trust-value">Level 2 of 3</span>
                    </div>
                    <p className="trust-desc">Complete ID verification to reach Level 3 and get priority listing placement.</p>
                </div>
            </div>

            {/* Save Button */}
            <div className="settings-actions">
                <button className="btn btn-primary btn-lg" onClick={handleSave}>
                    Save Settings
                </button>
            </div>
        </div>
    );
}

export default OwnerSettings;
