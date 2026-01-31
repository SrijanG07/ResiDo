# RoomGi Authentication System 🔐

This document describes the enhanced authentication system for RoomGi, featuring Firebase Authentication integrated with PostgreSQL backend.

## Architecture Overview

### Hybrid Approach
- **Firebase Auth**: Handles authentication, email verification, password reset, social logins
- **PostgreSQL**: Stores user profiles, properties, preferences, activity logs

### Flow Diagram
```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                   │
├─────────────────────────────────────────────────────────────────┤
│  UserLogin (Buyers/Renters)    │    OwnerAuth (List Property)   │
│         ↓                      │           ↓                     │
│  FirebaseAuthContext  ←────────┼────→  Firebase SDK              │
└────────────────────────────────┼─────────────────────────────────┘
                                 │
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND                                    │
├─────────────────────────────────────────────────────────────────┤
│  /api/auth/firebase-sync      →   Sync Firebase UID              │
│  /api/auth/firebase-register  →   Create user with Firebase UID  │
│  /api/auth/login              →   Legacy email/password          │
│  /api/auth/register           →   Legacy registration            │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│                     POSTGRESQL                                    │
├─────────────────────────────────────────────────────────────────┤
│  users (with firebase_uid)                                        │
│  user_sessions                                                    │
│  user_preferences                                                 │
│  user_activity_logs                                               │
└─────────────────────────────────────────────────────────────────┘
```

## Setup Instructions

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Enable Authentication > Sign-in methods:
   - Email/Password
   - Google (optional)
   - Phone (optional)
4. Get your config from Project Settings > General > Your apps

5. Create `.env` in frontend:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 2. Database Migration

Run the migration SQL to add new tables and columns:

```bash
cd backend
psql -U postgres -d roomgi -f ../database/migrations/001_firebase_auth_migration.sql
```

### 3. Backend Dependencies

Already installed:
```bash
npm install helmet express-rate-limit express-validator
```

### 4. Frontend Dependencies

Already installed:
```bash
npm install firebase
```

## User Flows

### Buyer/Renter Flow
```
Home → "Sign In" → UserLogin → Sign In/Up as Buyer or Renter → Dashboard
```
- Users can only sign up as `buyer` or `renter`
- No owner option in this flow
- Redirected to owner flow if they want to list property

### Owner/Broker Flow
```
Home → "List Property" → OwnerAuth → Sign In OR Create Owner Account → Dashboard
```
- Dedicated authentication for property owners
- Includes owner-specific onboarding
- Can also upgrade from buyer account

## Components

### Frontend Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `FirebaseAuthContext` | `context/FirebaseAuthContext.jsx` | Firebase auth state management |
| `LoginForm` | `components/auth/LoginForm.jsx` | Email/password & Google login |
| `SignupForm` | `components/auth/SignupForm.jsx` | Buyer/renter registration |
| `OwnerAuth` | `components/auth/OwnerAuth.jsx` | Owner login/signup flow |
| `PasswordReset` | `components/auth/PasswordReset.jsx` | Forgot password flow |
| `EmailVerification` | `components/auth/EmailVerification.jsx` | Email verification UI |
| `ProtectedRoute` | `components/auth/ProtectedRoute.jsx` | Route protection |
| `UserLoginNew` | `pages/UserLoginNew.jsx` | Updated user login page |

### Backend Endpoints

#### Authentication (Rate Limited)
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/register` | POST | Legacy registration |
| `/api/auth/login` | POST | Legacy login |
| `/api/auth/logout` | POST | Logout |
| `/api/auth/refresh` | POST | Refresh JWT token |

#### Firebase Integration
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/firebase-sync` | POST | Sync Firebase user with DB |
| `/api/auth/firebase-register` | POST | Register via Firebase |
| `/api/auth/verify-email-status` | POST | Update email verification |

#### Password Management
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/forgot-password` | POST | Request password reset |
| `/api/auth/reset-password` | POST | Reset password with token |
| `/api/auth/change-password` | POST | Change password (auth required) |

#### Session Management
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/sessions` | GET | Get active sessions |
| `/api/auth/sessions/:id` | DELETE | Invalidate a session |
| `/api/auth/logout-all` | POST | Logout from all devices |

## Database Schema

### New/Updated Tables

#### users (updated)
```sql
- firebase_uid VARCHAR(128) UNIQUE
- is_email_verified BOOLEAN
- is_phone_verified BOOLEAN
- account_status ENUM('active', 'suspended', 'deactivated')
- profile_pic_url TEXT
- verification_level INTEGER (0-5)
- last_login TIMESTAMP
```

#### user_sessions (new)
```sql
- session_token, refresh_token, firebase_token
- expires_at, last_used
- ip_address, user_agent, device_info
- is_active BOOLEAN
```

#### user_preferences (new)
```sql
- notification_email, notification_sms, notification_push
- marketing_emails, theme, language, currency
```

#### user_activity_logs (new)
```sql
- action, details (JSONB)
- ip_address, user_agent
```

## Security Features

### Rate Limiting
- Auth endpoints: 10 requests per 15 minutes
- Password reset: 3 requests per hour
- General API: 500 requests per 15 minutes

### Validation
- Email format validation
- Password strength requirements (8+ chars, letters, numbers)
- Input sanitization with express-validator

### Security Headers
- Helmet.js for HTTP security headers
- CORS with origin validation
- JWT with 7-day expiration

## Usage Examples

### Frontend: Using Firebase Auth

```jsx
import { useFirebaseAuth } from '../context/FirebaseAuthContext';

function MyComponent() {
    const { 
        user, 
        login, 
        register, 
        logout, 
        isAuthenticated,
        isOwner 
    } = useFirebaseAuth();

    const handleLogin = async () => {
        try {
            await login(email, password);
            // Success
        } catch (error) {
            // Handle error
        }
    };

    return (
        <div>
            {isAuthenticated ? (
                <p>Welcome, {user.name}!</p>
            ) : (
                <button onClick={handleLogin}>Login</button>
            )}
        </div>
    );
}
```

### Backend: Protected Route

```javascript
const { authenticateToken, requireOwner } = require('../middleware/auth');

// Any authenticated user
router.get('/profile', authenticateToken, (req, res) => {
    res.json({ user: req.user });
});

// Only owners/brokers
router.post('/properties', authenticateToken, requireOwner, (req, res) => {
    // Create property
});
```

## Migration from Legacy Auth

To migrate existing users:

1. Users can continue using email/password login
2. When they login, their account will be linked to Firebase
3. Or they can use "Forgot Password" through Firebase

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### Backend (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=roomgi
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret
PORT=5000
NODE_ENV=development

FRONTEND_URL=http://localhost:3000
REQUIRE_SESSION_VALIDATION=false
```

## Troubleshooting

### Common Issues

1. **Firebase not initialized**: Check firebase.js config values
2. **CORS errors**: Verify FRONTEND_URL in backend .env
3. **Database errors**: Run the migration SQL file
4. **Rate limit hit**: Wait 15 minutes or increase limits in development

### Debug Mode

Enable request logging:
```env
NODE_ENV=development
```

## Future Enhancements

- [ ] Phone number verification (Firebase)
- [ ] Two-factor authentication
- [ ] Social logins (Facebook, Apple)
- [ ] Admin user management panel
- [ ] Account suspension workflow
- [ ] Email templates customization
