# 🚀 Quick Start Guide

## Installation & Running the App

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will open automatically at **http://localhost:3000**

---

## 🎮 Quick Demo

### Try the Demo Account
- **Email**: test@example.com
- **Password**: password123

### Or Create a New Account
1. Click "Sign up"
2. Enter any email, username (3+ chars), and password (8+ chars)
3. Fill in confirm password
4. Click "Create Account"

---

## 📁 Project Structure at a Glance

**Models** = Data structures and API logic  
**ViewModels** = State management and validation  
**Views** = UI components (Pages & Reusable Components)

Complete documentation in **[README.md](README.md)**

---

## ✨ Key Features

✅ Real-time form validation  
✅ Loading states and error handling  
✅ Protected routes (Dashboard only for logged-in users)  
✅ Responsive design (mobile, tablet, desktop)  
✅ Clean MVVM architecture  
✅ Mock API with simulated delays  

---

## 📝 Available Commands

```bash
npm run dev       # Start development server (auto-opens browser)
npm run build     # Build for production
npm run preview   # Preview production build locally
npm start         # Alias for npm run dev
```

---

## 🎓 Project Architecture

### MVVM Pattern
```
View (UI Components)
   ↓↑
ViewModel (State & Logic)
   ↓↑
Model (Data & API)
```

- **Models** (`src/models/`): User data structures, mock API
- **ViewModels** (`src/viewModels/`): React hooks for state management
- **Views** (`src/views/`): Page components and UI elements

---

## 🔐 Validation Examples

### Login
- Email must be valid
- Password minimum 6 characters

### Sign Up
- Email must be valid
- Username 3+ characters (letters, numbers, _)
- Password 8+ characters
- Passwords must match

---

## 📱 Responsive Design

Works perfectly on:
- 📱 Mobile phones
- 📱 Tablets
- 💻 Desktops

---

## 🛠️ Technologies Used

- React 18
- React Router 6
- Vite 5
- Tailwind CSS 3
- PostCSS & Autoprefixer

---

## 💡 Next Steps

1. Test all features with the demo account
2. Create a new account to test sign-up
3. Explore the code structure
4. Check the README for detailed documentation
5. Customize and extend the app

---

**Need Help?** Check the README.md for troubleshooting section!
