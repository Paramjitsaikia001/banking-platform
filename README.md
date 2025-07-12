# Banking Platform

A full-stack banking platform with React frontend and Node.js backend.

## Quick Start

### Option 1: Start Both Servers (Recommended)
```bash
# Install dependencies for all projects
npm run install:all

# Start both backend and frontend servers
npm run dev
```

### Option 2: Start Servers Separately

**Backend (Port 3001):**
```bash
cd backend
npm start
```

**Frontend (Port 3000):**
```bash
cd banking-app
npm run dev
```

## Testing the Application

### 1. Registration Flow
1. Go to `http://localhost:3000/auth/register`
2. Enter phone number and email
3. **Check backend console for OTP logs:**
   - Phone OTP: `🔐 [PHONE VERIFICATION] Use this OTP: 123456`
   - Email OTP: `📧 [EMAIL VERIFICATION] Use this OTP: 123456`
4. Use the OTPs shown in console to verify
5. Complete registration with personal details

### 2. Login Flow
1. Go to `http://localhost:3000/auth/login`
2. Use email/password or phone/OTP
3. Should redirect to dashboard

### 3. Wallet Features
1. Go to `http://localhost:3000/wallet`
2. Click "Add Money" to add funds
3. View transaction history
4. Check wallet balance

## Features Implemented

✅ **Fully Functional Authentication**
- Email/password login
- Phone/OTP login
- User session management

✅ **Phone & Email Verification on One Page**
- Combined verification flow
- Real-time OTP validation

✅ **OTP Console Logging**
- Clear console output with emojis
- Easy to identify OTPs for testing

✅ **Frontend User Data in MongoDB**
- Complete user profile storage
- Wallet initialization with 0 balance

✅ **Add Money Functionality**
- Multiple payment methods
- Real-time balance updates
- Transaction history

## Console OTP Logs

When testing, you'll see logs like:
```
🔐 [PHONE VERIFICATION] Generated OTP for 1234567890: 123456
📱 [PHONE VERIFICATION] Use this OTP: 123456
✅ [PHONE VERIFICATION] OTP stored in database for 1234567890

📧 [EMAIL VERIFICATION] Generated OTP for user@example.com: 654321
✉️ [EMAIL VERIFICATION] Use this OTP: 654321
✅ [EMAIL VERIFICATION] OTP stored in database for user@example.com
```

## Troubleshooting

- **Backend not starting:** Make sure you're in the `backend` directory
- **Frontend not starting:** Make sure you're in the `banking-app` directory
- **OTP not showing:** Check backend console logs
- **CORS errors:** Backend is configured for port 3000 and 3001