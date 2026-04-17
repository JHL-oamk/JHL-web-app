# MVVM Architecture Explanation

## Overview

This project uses the **MVVM (Model-View-ViewModel)** architectural pattern to separate concerns and make the code more maintainable, testable, and scalable.

## The Three Layers

### 1. MODEL Layer (`src/models/`)

**Responsibility**: Data and business logic

The Model layer contains:
- **Data structures**: User class, AuthResponse class
- **API logic**: Functions that communicate with the backend
- **Business rules**: Validation logic, data transformations

**Files**:
- `User.js`: Defines data models
- `authApi.js`: Mock API endpoints

**Example**:
```javascript
// Model: Pure data and API
export const loginApi = async (email, password) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  return response.json();
};
```

**Why separate?**
- Easy to replace with real APIs
- Testable without UI
- Reusable across components

---

### 2. VIEWMODEL Layer (`src/viewModels/`)

**Responsibility**: State management and business logic

The ViewModel layer contains:
- **State management**: React hooks to manage state
- **Validation logic**: Form validation, error checking
- **Handlers**: Methods to handle user interactions
- **Side effects**: API calls, redirects, etc.

**Files**:
- `useAuthViewModel.js`: Global authentication state
- `useLoginViewModel.js`: Login form state and validation
- `useSignUpViewModel.js`: Sign up form state and validation

**Example**:
```javascript
// ViewModel: State management and logic
export const useLoginViewModel = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  
  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    if (!EMAIL_REGEX.test(email)) return 'Invalid email';
    return '';
  };
  
  return { formData, validateEmail, ... };
};
```

**Why separate?**
- Logic is independent of UI
- Can be reused in multiple components
- Easy to unit test
- Clear separation from presentation

---

### 3. VIEW Layer (`src/views/`)

**Responsibility**: UI rendering only

The View layer contains:
- **Page components**: Login, SignUp, Dashboard pages
- **UI components**: FormInput, LoadingSpinner
- **Presentation logic**: What to show when
- **User interactions**: Button clicks, form submissions

**Organization**:
```
views/
├── pages/          # Full page components
│   ├── Login.jsx
│   ├── SignUp.jsx
│   └── Dashboard.jsx
└── components/     # Reusable small components
    ├── FormInput.jsx
    └── LoadingSpinner.jsx
```

**Example**:
```javascript
// View: UI only, calls ViewModel methods
export const Login = ({ authViewModel }) => {
  const loginForm = useLoginViewModel();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    authViewModel.login(loginForm.formData.email, loginForm.formData.password);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <FormInput name="email" value={loginForm.formData.email} />
      {/* JSX for rendering */}
    </form>
  );
};
```

**Why separate?**
- UI is independent of business logic
- Easy to change design without affecting logic
- Can test logic separately from presentation
- Clear, focused components

---

## Data Flow Diagram

```
USER INTERACTION
      ↓
┌─────────────────────────────────────┐
│        VIEW (UI Component)          │
│    - Renders JSX                   │
│    - Captures user input           │
│    - Calls ViewModel methods       │
└─────────────┬───────────────────────┘
              │
              ↓
┌─────────────────────────────────────┐
│   VIEWMODEL (React Hooks)           │
│    - Manages state                 │
│    - Validates input               │
│    - Calls Model methods           │
│    - Returns updated state         │
└─────────────┬───────────────────────┘
              │
              ↓
┌─────────────────────────────────────┐
│     MODEL (Logic & Data)            │
│    - API calls                     │
│    - Data processing               │
│    - Business logic                │
│    - Returns response              │
└─────────────┬───────────────────────┘
              │
              ↓
        RESPONSE DATA
              │
              ↓
    ViewModel Updates State
              │
              ↓
        View Re-renders
              │
              ↓
         USER SEES UPDATE
```

---

## Example: Login Process

### 1. User enters email and clicks login (VIEW)
```javascript
// In Login.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  const result = await authViewModel.login(
    loginForm.formData.email,
    loginForm.formData.password
  );
};
```

### 2. ViewModel validates and processes (VIEWMODEL)
```javascript
// In useAuthViewModel.js
const login = async (email, password) => {
  setIsLoading(true);
  setError(null);
  
  const response = await loginApi(email, password);
  
  if (response.success) {
    setUser(response.user);
    setIsAuthenticated(true);
  } else {
    setError(response.message);
  }
  
  setIsLoading(false);
};
```

### 3. Model makes API call (MODEL)
```javascript
// In authApi.js
export const loginApi = async (email, password) => {
  const user = mockDatabase.users.find(
    u => u.email === email && u.password === password
  );
  
  if (user) {
    return { success: true, user, token: 'token_123' };
  } else {
    return { success: false, message: 'Invalid credentials' };
  }
};
```

### 4. ViewModel updates state with response
### 5. View re-renders with new state
### 6. User sees success message or error

---

## Benefits of MVVM Architecture

1. **Separation of Concerns**
   - Each layer has a single responsibility
   - Easy to understand and maintain

2. **Reusability**
   - ViewModel can be used by multiple Views
   - Model can be shared across entire app

3. **Testability**
   - Logic can be tested independently
   - No need to test UI to test business logic

4. **Scalability**
   - Easy to add new features
   - Easy to modify existing features without side effects

5. **Maintainability**
   - Clear structure makes code easy to navigate
   - Changes are localized to specific layers

6. **Team Collaboration**
   - Different team members can work on different layers
   - Clear contracts between layers

---

## Real-World Example: Adding a Feature

### Scenario: Add "Remember Me" Checkbox

#### Step 1: Update MODEL
```javascript
// authApi.js - Add remember me to API
export const loginApi = async (email, password, rememberMe) => {
  // Save rememberMe preference to backend
};
```

#### Step 2: Update VIEWMODEL
```javascript
// useLoginViewModel.js - Add rememberMe state
const [rememberMe, setRememberMe] = useState(false);

// useAuthViewModel.js - Pass to login method
const login = async (email, password, rememberMe) => {
  await loginApi(email, password, rememberMe);
};
```

#### Step 3: Update VIEW
```javascript
// Login.jsx - Add checkbox
<input
  type="checkbox"
  checked={rememberMe}
  onChange={(e) => setRememberMe(e.target.checked)}
/>
```

**Notice**: Each layer handles its part independently!

---

## Common Mistakes to Avoid

❌ **DON'T** put UI logic in ViewModels  
❌ **DON'T** put API calls in View components  
❌ **DON'T** put validation in View components  
❌ **DON'T** access Model directly from View  

✅ **DO** keep each layer focused on its responsibility  
✅ **DO** pass data between layers through arguments and returns  
✅ **DO** use ViewModels as intermediaries  

---

## Comparison with Other Patterns

### MVC (Model-View-Controller)
- Controller handles input
- Can lead to controller bloat
- Two-way binding between View and Model

### MVVM (Model-View-ViewModel)
- ViewModel handles input and logic
- Cleaner separation of concerns
- One-way binding through ViewModels

### Redux (State Management)
- Centralized store
- Great for complex state
- More boilerplate

**Our Approach**: Combining MVVM with React hooks for simplicity and clarity

---

## File Organization Recap

```
✓ Models handle DATA and API
  src/models/authApi.js
  src/models/User.js

✓ ViewModels handle STATE and LOGIC
  src/viewModels/useAuthViewModel.js
  src/viewModels/useLoginViewModel.js
  src/viewModels/useSignUpViewModel.js

✓ Views handle UI and USER INTERACTION
  src/views/pages/Login.jsx
  src/views/pages/SignUp.jsx
  src/views/pages/Dashboard.jsx
  src/views/components/FormInput.jsx
  src/views/components/LoadingSpinner.jsx
```

---

**This architecture makes the code scalable, maintainable, and easy to test!**
