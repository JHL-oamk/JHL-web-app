# Authentication System with React MVVM Architecture

A modern, fully-functional authentication system built with **React**, **React Router**, and **Tailwind CSS** following the **MVVM (Model-View-ViewModel)** architectural pattern.

## 📋 Project Structure

```
JHL-web-app/
├── src/
│   ├── models/
│   │   ├── User.js                    # User data model & AuthResponse
│   │   └── authApi.js                 # Mock API functions (login, register, logout)
│   ├── viewModels/
│   │   ├── useAuthViewModel.js        # Main auth state management hook
│   │   ├── useLoginViewModel.js       # Login form logic & validation
│   │   └── useSignUpViewModel.js      # Sign up form logic & validation
│   ├── views/
│   │   ├── pages/
│   │   │   ├── Login.jsx              # Login page component
│   │   │   ├── SignUp.jsx             # Sign up page component
│   │   │   └── Dashboard.jsx          # Success/home page (after login)
│   │   └── components/
│   │       ├── FormInput.jsx          # Reusable form input component
│   │       └── LoadingSpinner.jsx     # Loading indicator component
│   ├── App.jsx                        # Main app component with routing
│   ├── index.jsx                      # React app entry point
│   ├── index.css                      # Global styles with Tailwind
│   └── vite.config.js                 # Vite configuration
├── public/
│   └── index.html                     # HTML template
├── package.json                       # Dependencies & scripts
├── tailwind.config.js                 # Tailwind CSS configuration
├── postcss.config.js                  # PostCSS configuration
├── .gitignore                         # Git ignore rules
└── README.md                          # This file
```

## 🏗️ Architecture Overview

### **Model Layer** (`src/models/`)
- **User.js**: Defines `User` and `AuthResponse` classes for type safety
- **authApi.js**: Mock API functions that simulate server requests
  - `loginApi(email, password)`: Authenticate user login
  - `registerApi(email, username, password)`: Create new user account
  - `logoutApi()`: Logout functionality

### **ViewModel Layer** (`src/viewModels/`)
- **useAuthViewModel.js**: Global auth state management
  - Manages user authentication state
  - Handles login, register, logout logic
  - Manages loading and error states
  
- **useLoginViewModel.js**: Login form state management
  - Form data state
  - Input validation with real-time feedback
  - Error handling per field
  - Touched field tracking

- **useSignUpViewModel.js**: Sign up form state management
  - Form data state with password confirmation
  - Complex validation (email, username, password strength)
  - Error handling with field-level validation
  - Touched field tracking

### **View Layer** (`src/views/`)
- **Login.jsx**: Clean login UI
  - Email and password fields
  - Real-time validation errors
  - Loading state during submission
  - Success message on login
  - Link to sign up page
  - Demo credentials display

- **SignUp.jsx**: Comprehensive sign up UI
  - Email, username, password, and confirm password fields
  - Real-time validation with detailed error messages
  - Loading state during submission
  - Success message on registration
  - Link to login page
  - Password requirements display

- **Dashboard.jsx**: Success page after authentication
  - User information display
  - Logout functionality
  - Protected route (only accessible when authenticated)

- **Components**:
  - `FormInput.jsx`: Reusable form input with error display
  - `LoadingSpinner.jsx`: Loading animation component

## 🚀 Features

✅ **MVVM Architecture**: Clean separation of concerns  
✅ **Form Validation**: Real-time validation with detailed error messages  
✅ **React Router**: Seamless navigation between pages  
✅ **Tailwind CSS**: Modern, responsive design  
✅ **Loading States**: Visual feedback during API calls  
✅ **Error Handling**: User-friendly error messages  
✅ **Protected Routes**: Dashboard only accessible when authenticated  
✅ **Mock API**: Simulated backend for testing  
✅ **Responsive Design**: Works on mobile, tablet, and desktop  

## 🔐 Validation Rules

### **Login Page**
- **Email**: Required, must be valid email format
- **Password**: Required, minimum 6 characters

### **Sign Up Page**
- **Email**: Required, must be valid email format
- **Username**: Required, 3+ characters, alphanumeric + underscores only
- **Password**: Required, minimum 8 characters
- **Confirm Password**: Must match password field

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Steps

1. **Navigate to project**:
```bash
cd /Users/xuanyuliu/Desktop/JHL-web-app
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start development server**:
```bash
npm run dev
```

The app will open at **http://localhost:3000** (or port 3001 if 3000 is in use)

## 🎮 Testing the App

### Demo Credentials
```
Email: test@example.com
Password: password123
```

### Test Sign Up
- Click "Sign up"
- Enter email, username (3+ chars), password (6+ chars)
- Click "Create Account"

### Test Login
- Use demo credentials above or create your own account
- Click "Sign In"

### Features to Test
1. **Login Page**
   - Try demo credentials
   - Test validation (empty fields, invalid email, wrong password)
   - Test "Sign Up" link navigation

2. **Sign Up Page**
   - Create new accounts
   - Test all validation rules
   - Verify password mismatch error
   - Verify duplicate email rejection

3. **Dashboard**
   - View logged-in user information
   - Test logout functionality
   - Verify redirect to login after logout

## 📝 Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Start dev server (alias for npm run dev)
npm start
```

## 🛠️ Technology Stack

- **React 18.2+**: UI library with hooks
- **React Router 6.18+**: Client-side routing
- **Vite 5.0+**: Fast build tool and dev server
- **Tailwind CSS 3.3+**: Utility-first CSS framework
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixes

## 🎨 UI/UX Highlights

- **Modern Design**: Clean, centered layouts with gradient backgrounds
- **Responsive**: Mobile-first approach, works on all screen sizes
- **Loading States**: Smooth spinner animations during operations
- **Error Display**: Clear, helpful error messages per field
- **Success Feedback**: Visual confirmation of successful actions
- **Accessibility**: Semantic HTML, proper form labels, focus states
- **Smooth Transitions**: CSS transitions for interactive elements

## 🔄 Data Flow

```
User Input → View Component
   ↓
ViewModel Hook (validate & process)
   ↓
Model Layer (API call)
   ↓
Response → ViewModel (update state)
   ↓
View (re-render with new state)
```

## 🧪 Mock Authentication

This app uses **mock authentication** for quick testing and development.

### Features
- ✅ Email/Password authentication
- ✅ User registration
- ✅ Session persistence
- ✅ Mock token management

### Test Account
```
Email: test@example.com
Password: password123
```

### Extend with Real Backend
Replace the mock API in `src/models/authApi.js` with your backend:
- Firebase Authentication
- Custom Node.js/Express API
- AWS Cognito
- Auth0
- Any other authentication service

## 📱 Responsive Breakpoints

- **Mobile**: Full width with padding
- **Tablet**: Mid-width forms with responsive text
- **Desktop**: Centered max-width layout

## 🚀 Next Steps

### To Integrate a Real Backend

1. Update `src/models/authApi.js`:
   - Replace mock functions with real API calls
   - Update endpoints to match your backend
   - Install necessary packages (e.g., `npm install firebase` or `axios`)

2. Choose your authentication method:
   - Firebase Auth
   - Custom REST API
   - AWS Cognito
   - Auth0
   - Passport.js

3. Optional Enhancements:
   - [ ] Add Google Sign-in
   - [ ] Add GitHub Sign-in
   - [ ] Implement email verification
   - [ ] Add password reset functionality
   - [ ] Add 2FA (Two-Factor Authentication)
   - [ ] Implement user profile editing
   - [ ] Add profile picture upload

## 📄 File Descriptions

| File | Purpose |
|------|---------|
| `User.js` | Data models for type safety |
| `authApi.js` | Mock API layer for authentication |
| `useAuthViewModel.js` | Global auth state management hook |
| `useLoginViewModel.js` | Login form validation & state |
| `useSignUpViewModel.js` | Sign up form validation & state |
| `Login.jsx` | Login page UI component |
| `SignUp.jsx` | Sign up page UI component |
| `Dashboard.jsx` | Authenticated user dashboard |
| `FormInput.jsx` | Reusable form input component |
| `LoadingSpinner.jsx` | Loading animation component |
| `App.jsx` | Main app with routing |
| `index.jsx` | React app entry point |
| `index.css` | Global Tailwind styles |

## 🐛 Troubleshooting

**Port 3000 already in use**:
```bash
# Change port in vite.config.js or use:
npm run dev -- --port 3001
```

**Dependencies not installing**:
```bash
rm -rf node_modules package-lock.json
npm install
```

**Tailwind styles not showing**:
- Ensure vite server is running (`npm run dev`)
- Clear browser cache
- Check that `content` paths are correct in `tailwind.config.js`

## 📖 Learning Resources

- [React Documentation](https://react.dev)
- [React Router Documentation](https://reactrouter.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Vite Documentation](https://vitejs.dev)
- [MVVM Pattern](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel)

## 💡 Code Quality

- ✅ Modular, reusable components
- ✅ Clear separation of concerns (MVVM)
- ✅ Comprehensive comments
- ✅ Consistent naming conventions (camelCase)
- ✅ Error handling throughout
- ✅ Clean, readable code structure

## 📄 License

ISC License - You're free to use this project

---

**Happy Coding!** 🚀 Feel free to extend this project with additional features.
