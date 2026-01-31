# RoomGi Authentication & Database Management TODO 🔐

## Current Problems & Issues ❌

### 1. **User Flow Confusion**
- **Problem**: Property owner signup is available in general user signup, but should be in "List Property" flow
- **Current**: Users can sign up as "Property Owner" in UserLogin.jsx but get confused about where to go next
- **Impact**: Poor UX, users don't know where to manage properties

### 2. **Authentication Route Issues**
- **Problem**: Multiple authentication paths causing confusion
  - General user login/signup (UserLogin.jsx)
  - Owner-specific login (OwnerLogin.jsx) 
  - Owner landing page with disabled signup
- **Current**: Inconsistent authentication flows across different user types

### 3. **Database Schema Limitations**
- **Problem**: Basic user management with PostgreSQL but missing:
  - Email verification system
  - Phone number verification
  - Two-factor authentication
  - Password reset functionality
  - User session management
  - Account deactivation/suspension

### 4. **Security Vulnerabilities**
- **Problem**: Weak security implementation
  - No email verification
  - Simple password hashing without salt rounds config
  - No rate limiting on auth endpoints
  - JWT tokens don't expire gracefully
  - No refresh token mechanism

### 5. **User Type Management**
- **Problem**: Confusing user type switching
  - Users can't upgrade from buyer to owner easily
  - No role-based permissions properly implemented
  - Mixed authentication contexts

### 6. **Database Connection & Management**
- **Problem**: Basic PostgreSQL setup but missing:
  - Connection pooling optimization
  - Database backup strategy
  - Migration system
  - Seed data management
  - Error logging and monitoring

---

## Required Solutions & Improvements ✅

### 1. **Restructure User Authentication Flow**

#### **Current State:**
```
Home → UserLogin (Sign In/Up as Buyer OR Owner) → Dashboard
Home → List Property → OwnerLogin (Owner only) → Dashboard
```

#### **Proposed New Flow:**
```
Home → UserLogin (Sign In/Up as Buyer/Renter ONLY) → Dashboard
Home → List Property → (Owner Auth Flow) → Dashboard

List Property Page Should Have:
├── Sign In as Owner (existing owners)
├── Create Owner Account (new owners)
└── Tour/Demo mode (non-authenticated)
```

### 2. **Implement Firebase Authentication** 🔥

#### **Why Firebase?**
- Email/phone verification built-in
- Social logins (Google, Facebook)
- Two-factor authentication
- Password reset flows
- Real-time user management
- Better security than custom auth

#### **Implementation Plan:**
```javascript
// Install Firebase
npm install firebase

// Config (frontend/src/config/firebase.js)
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  // Your config
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
```

### 3. **Database Migration Strategy**

#### **Option A: Keep PostgreSQL + Add Firebase Auth**
```javascript
// Hybrid approach
- Firebase handles: Authentication, user sessions, verification
- PostgreSQL handles: Properties, inquiries, reviews, analytics

// User flow:
1. Firebase auth creates user with UID
2. Store Firebase UID in PostgreSQL users table
3. Link all property data to Firebase UID
```

#### **Option B: Full Firebase Migration**
```javascript
// Full Firebase setup
- Firestore for all data (users, properties, inquiries)
- Cloud Functions for backend logic
- Firebase Storage for images
- Firebase Hosting for deployment
```

### 4. **Enhanced User Management System**

#### **New User Schema (PostgreSQL + Firebase)**
```sql
-- Update users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  firebase_uid VARCHAR(128) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(15) UNIQUE,
  user_type ENUM('buyer', 'renter', 'owner', 'broker') NOT NULL,
  profile_pic_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_phone_verified BOOLEAN DEFAULT FALSE,
  is_email_verified BOOLEAN DEFAULT FALSE,
  verification_level INT DEFAULT 0,
  account_status ENUM('active', 'suspended', 'deactivated') DEFAULT 'active',
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add user preferences
CREATE TABLE user_preferences (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  notification_email BOOLEAN DEFAULT TRUE,
  notification_sms BOOLEAN DEFAULT TRUE,
  marketing_emails BOOLEAN DEFAULT FALSE,
  theme ENUM('light', 'dark') DEFAULT 'light',
  language VARCHAR(5) DEFAULT 'en'
);
```

### 5. **New Authentication Components Structure**

```
src/
├── components/
│   ├── auth/
│   │   ├── AuthProvider.jsx (Firebase context)
│   │   ├── ProtectedRoute.jsx
│   │   ├── LoginForm.jsx
│   │   ├── SignupForm.jsx
│   │   ├── PhoneVerification.jsx
│   │   ├── EmailVerification.jsx
│   │   └── PasswordReset.jsx
│   └── owner/
│       ├── OwnerOnboarding.jsx
│       ├── OwnerVerification.jsx
│       └── OwnerDashboard.jsx
├── pages/
│   ├── auth/
│   │   ├── Login.jsx (Buyer/Renter only)
│   │   ├── Signup.jsx (Buyer/Renter only)
│   │   ├── ForgotPassword.jsx
│   │   └── EmailVerification.jsx
│   └── owner/
│       ├── OwnerAuth.jsx (Combined login/signup)
│       ├── OwnerOnboarding.jsx
│       └── ListProperty.jsx
```

### 6. **Security Enhancements**

#### **Backend Security (Node.js + Express)**
```javascript
// Add these packages
npm install helmet express-rate-limit express-validator cors dotenv

// Security middleware
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts'
})

app.use('/api/auth', authLimiter)
app.use(helmet())
```

#### **Firebase Security Rules**
```javascript
// Firestore security rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /properties/{propertyId} {
      allow read: if true;
      allow write: if request.auth != null && 
        (resource.data.ownerId == request.auth.uid || 
         !('ownerId' in resource.data));
    }
  }
}
```

---

## Implementation Roadmap 🗺️

### **Phase 1: Authentication Restructure (Week 1-2)**
- [ ] Remove owner signup from UserLogin.jsx
- [ ] Create new OwnerAuth.jsx component for List Property page
- [ ] Update navigation flows
- [ ] Test user experience flows

### **Phase 2: Firebase Integration (Week 2-3)**
- [ ] Set up Firebase project
- [ ] Install and configure Firebase SDK
- [ ] Create Firebase auth context
- [ ] Implement email verification
- [ ] Add phone verification
- [ ] Implement password reset

### **Phase 3: Database Migration (Week 3-4)**
- [ ] Create migration scripts
- [ ] Add Firebase UID to existing users
- [ ] Update all auth endpoints
- [ ] Test data consistency
- [ ] Implement user preferences

### **Phase 4: Security Hardening (Week 4-5)**
- [ ] Add rate limiting
- [ ] Implement CSRF protection
- [ ] Add request validation
- [ ] Set up Firebase security rules
- [ ] Add logging and monitoring

### **Phase 5: Advanced Features (Week 5-6)**
- [ ] Two-factor authentication
- [ ] Social login options
- [ ] User account management
- [ ] Admin user management
- [ ] Analytics and reporting

---

## Tech Stack Recommendations 🛠️

### **Current Stack:**
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: PostgreSQL
- Authentication: Custom JWT

### **Recommended Stack:**

#### **Option 1: Hybrid (Recommended)**
```
Frontend: React + Vite
Authentication: Firebase Auth
Backend: Node.js + Express
Database: PostgreSQL (properties) + Firestore (users)
File Storage: Firebase Storage
Hosting: Vercel (frontend) + Railway (backend)
```

#### **Option 2: Full Firebase**
```
Frontend: React + Vite
Authentication: Firebase Auth
Backend: Firebase Cloud Functions
Database: Firestore
File Storage: Firebase Storage
Hosting: Firebase Hosting
```

#### **Option 3: Modern Alternative**
```
Frontend: React + Vite
Authentication: Clerk or Auth0
Backend: Node.js + Express
Database: Supabase (PostgreSQL + Auth)
File Storage: Cloudinary
Hosting: Vercel
```

---

## Database Schema Updates 📊

### **User Management Tables**
```sql
-- Enhanced users table
ALTER TABLE users ADD COLUMN firebase_uid VARCHAR(128) UNIQUE;
ALTER TABLE users ADD COLUMN is_phone_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN is_email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN account_status ENUM('active', 'suspended', 'deactivated') DEFAULT 'active';
ALTER TABLE users ADD COLUMN last_login TIMESTAMP;

-- User sessions (if not using Firebase)
CREATE TABLE user_sessions (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  session_token VARCHAR(255) UNIQUE NOT NULL,
  refresh_token VARCHAR(255) UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address INET,
  user_agent TEXT
);

-- Email verification tokens
CREATE TABLE verification_tokens (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  token VARCHAR(255) NOT NULL,
  token_type ENUM('email_verification', 'phone_verification', 'password_reset') NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User activity logs
CREATE TABLE user_activity_logs (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## API Endpoints Restructure 🔄

### **New Auth Endpoints**
```javascript
// Authentication routes
POST   /api/auth/signup/buyer          - Buyer/renter signup
POST   /api/auth/signup/owner          - Owner/broker signup
POST   /api/auth/login                 - Universal login
POST   /api/auth/logout                - Logout + session cleanup
POST   /api/auth/refresh               - Refresh JWT token
POST   /api/auth/verify-email          - Email verification
POST   /api/auth/verify-phone          - Phone verification
POST   /api/auth/resend-verification   - Resend verification
POST   /api/auth/forgot-password       - Password reset request
POST   /api/auth/reset-password        - Password reset confirmation

// User management
GET    /api/users/profile              - Get user profile
PUT    /api/users/profile              - Update user profile
POST   /api/users/change-password      - Change password
POST   /api/users/deactivate           - Deactivate account
GET    /api/users/activity             - Get user activity log

// Owner specific
GET    /api/owner/verification-status  - Check verification level
POST   /api/owner/request-verification - Request owner verification
POST   /api/owner/upgrade-account      - Upgrade buyer to owner
```

---

## Priority Issues to Fix Immediately ⚠️

### **Critical (Fix This Week):**
1. **Remove property owner signup from UserLogin component**
2. **Add owner auth to List Property page**
3. **Implement basic email verification**
4. **Add password strength requirements**
5. **Fix JWT token expiration handling**

### **High Priority (Fix Next Week):**
1. **Set up Firebase authentication**
2. **Add rate limiting to auth endpoints**
3. **Implement password reset functionality**
4. **Add user session management**
5. **Create proper error handling for auth failures**

### **Medium Priority (Month 2):**
1. **Add two-factor authentication**
2. **Implement social logins**
3. **Add user activity logging**
4. **Create admin user management**
5. **Add user preferences management**

---

## Testing Strategy 🧪

### **Authentication Testing Checklist:**
- [ ] User signup flow (buyer/renter)
- [ ] Owner signup flow (from List Property)
- [ ] Email verification process
- [ ] Phone verification process
- [ ] Password reset flow
- [ ] Login with verified account
- [ ] Login with unverified account
- [ ] Session timeout handling
- [ ] Multiple device login
- [ ] Account deactivation
- [ ] User type upgrade (buyer → owner)

---

## Monitoring & Analytics 📈

### **Key Metrics to Track:**
- User registration conversion rates
- Email verification completion rates
- Login success/failure rates
- Password reset usage
- Account deactivation reasons
- Authentication method preferences
- User journey drop-off points

### **Tools to Implement:**
- Firebase Analytics
- Google Analytics 4
- Custom event tracking
- Error monitoring (Sentry)
- Performance monitoring (Firebase Performance)

---

This comprehensive plan addresses all the current authentication issues and provides a roadmap for implementing a robust, secure, and user-friendly authentication system for RoomGi.