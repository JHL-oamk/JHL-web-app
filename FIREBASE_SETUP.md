# Firebase Setup Guide

This app is now connected to **Firebase Authentication**. Follow these steps to set up:

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name and click **"Continue"**
4. Accept the terms and click **"Create project"**
5. Wait for project to be created

## 2. Enable Authentication

1. In Firebase Console, go to **Authentication** (left menu)
2. Click **"Get started"**
3. Click **"Email/Password"** provider
4. Toggle **"Enable"** to on
5. Click **"Save"**

## 3. Get Firebase Config

1. Go to **Project settings** (gear icon, top right)
2. Scroll down to **"Your apps"**
3. Click the **Web app icon** (if not created, create one)
4. Copy the config object

## 4. Add to .env File

Create a `.env` file in project root:

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=1:your-app-id:web:your-web-app-id
```

## 5. Restart Dev Server

```bash
npm run dev
```

## 6. Test the App

### Create Account
- Email: any email
- Username: any username
- Password: must be 6+ characters

### Login
- Use the email and password you created

### Features
- ✅ Automatic token management
- ✅ User profile stored in Firebase
- ✅ Email/password authentication
- ✅ Persistent sessions with localStorage

## Firebase Features Available

### Current
- ✅ Email/Password authentication
- ✅ User profiles (with username)
- ✅ Token management
- ✅ Logout

### Optional Additions
- [ ] Google Sign-in
- [ ] GitHub Sign-in
- [ ] Phone authentication
- [ ] Email verification
- [ ] Password reset
- [ ] 2FA (Two-Factor Authentication)
- [ ] Firestore user data storage
- [ ] Real-time updates

## Troubleshooting

### "auth config not found"
- Check `.env` file exists with all Firebase credentials
- Restart the dev server after adding `.env`

### "Email already in use"
- Firebase automatically prevents duplicate emails
- Try a different email address

### "Weak password"
- Password must be at least 6 characters
- Use a stronger password

### Login fails
- Make sure email/password are correct
- Check that Email/Password provider is enabled in Firebase Console

## Security Notes

🔒 Never commit `.env` file with real credentials  
🔒 Use `.env.example` to show required variables  
🔒 Firebase handles password hashing automatically  
🔒 Tokens are stored in localStorage (consider using httpOnly cookies for production)  

## Advanced Setup

### Add Google Sign-in
1. Enable Google provider in Firebase Authentication
2. Install additional package: `npm install @react-oauth/google`
3. Implement Google sign-in button in LoginPage

### Setup Firestore (User Data)
1. Create Firestore database in Firebase Console
2. Add user documents automatically after signup
3. Store additional user info (profile, settings, etc.)

### Email Verification
1. Enable email verification in Firebase Console settings
2. Add verification check after signup
3. Send verification email prompt to user

## Resources

- [Firebase Docs](https://firebase.google.com/docs/auth)
- [Firebase Console](https://console.firebase.google.com/)
- [React + Firebase Best Practices](https://firebase.google.com/docs/auth/web/start)

---

**Your app is now connected to Firebase! 🚀**
