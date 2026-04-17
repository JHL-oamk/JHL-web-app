# 🔧 API Integration Guide

## Overview

This project currently uses **mock APIs** for demonstration. This guide shows how to connect it to a real backend.

---

## Current Mock Setup

### Mock API Location
`src/models/authApi.js` contains three functions:
- `loginApi(email, password)`
- `registerApi(email, username, password)`
- `logoutApi()`

### How Mock Works
1. Simulates 1-second network delay
2. Stores users in memory
3. Returns mock tokens

---

## Converting to Real API

### Step 1: Update `src/models/authApi.js`

#### Before (Mock):
```javascript
export const loginApi = async (email, password) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockDatabase.users.find(
        (u) => u.email === email && u.password === password
      );
      resolve(new AuthResponse(true, 'Login successful', user, 'token_123'));
    }, 1000);
  });
};
```

#### After (Real API):
```javascript
export const loginApi = async (email, password) => {
  try {
    const response = await fetch('https://your-api.com/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    const user = new User(data.email, data.username);
    
    // Store token in localStorage
    localStorage.setItem('authToken', data.token);
    
    return new AuthResponse(true, 'Login successful', user, data.token);
  } catch (error) {
    return new AuthResponse(false, error.message, null, null);
  }
};
```

---

## API Endpoints Expected

### Login
```
POST /api/auth/login
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response (Success - 200):
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "username": "john_doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response (Error - 401):
{
  "success": false,
  "message": "Invalid email or password"
}
```

### Register
```
POST /api/auth/register
Content-Type: application/json

Request:
{
  "email": "newuser@example.com",
  "username": "new_user",
  "password": "securepassword123"
}

Response (Success - 201):
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "id": "124",
    "email": "newuser@example.com",
    "username": "new_user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response (Error - 400):
{
  "success": false,
  "message": "Email already registered"
}
```

### Logout
```
POST /api/auth/logout
Authorization: Bearer <token>

Response (Success - 200):
{
  "success": true,
  "message": "Logout successful"
}
```

---

## Token Management

### Store Token
```javascript
// After login/register
localStorage.setItem('authToken', response.token);
```

### Retrieve Token
```javascript
const token = localStorage.getItem('authToken');
```

### Send Token with Requests
```javascript
const response = await fetch('/api/user/profile', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
```

### Clear Token
```javascript
// On logout
localStorage.removeItem('authToken');
```

---

## Enhanced API Service with Authorization

### Updated `authApi.js` with Token Support

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';

const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export const loginApi = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem('authToken', data.token);
      return new AuthResponse(true, data.message, 
        new User(data.user.email, data.user.username), 
        data.token);
    } else {
      return new AuthResponse(false, data.message);
    }
  } catch (error) {
    return new AuthResponse(false, 'Network error: ' + error.message);
  }
};

export const registerApi = async (email, username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem('authToken', data.token);
      return new AuthResponse(true, data.message,
        new User(data.user.email, data.user.username),
        data.token);
    } else {
      return new AuthResponse(false, data.message);
    }
  } catch (error) {
    return new AuthResponse(false, 'Network error: ' + error.message);
  }
};

export const logoutApi = async () => {
  try {
    localStorage.removeItem('authToken');
    return new AuthResponse(true, 'Logout successful');
  } catch (error) {
    return new AuthResponse(false, 'Logout failed: ' + error.message);
  }
};
```

---

## Environment Variables

### Create `.env` file in project root:
```
VITE_API_URL=http://localhost:3001
VITE_API_TIMEOUT=10000
```

### Use in config:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL;
```

### Update `vite.config.js`:
```javascript
export default defineConfig({
  define: {
    'process.env': import.meta.env,
  },
  // ... rest of config
});
```

---

## Error Handling

### Add to ViewModel

```javascript
const login = useCallback(async (email, password) => {
  setIsLoading(true);
  setError(null);

  try {
    const response = await loginApi(email, password);

    if (response.success) {
      setUser(response.user);
      setIsAuthenticated(true);
      return { success: true, message: response.message };
    } else {
      // Specific error handling
      if (response.message.includes('Email')) {
        setError('Email not found');
      } else if (response.message.includes('password')) {
        setError('Incorrect password');
      } else {
        setError(response.message);
      }
      return { success: false, message: response.message };
    }
  } catch (error) {
    const errorMsg = 'An unexpected error occurred';
    setError(errorMsg);
    return { success: false, message: errorMsg };
  } finally {
    setIsLoading(false);
  }
}, []);
```

---

## Session Persistence

### Check for Existing Token on App Load

```javascript
// Add to App.jsx useEffect
useEffect(() => {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('authUser');
  
  if (token && user) {
    // Restore session
    setIsAuthenticated(true);
    setUser(JSON.parse(user));
  }
}, []);

// Save user on login
if (response.success) {
  localStorage.setItem('authUser', JSON.stringify(response.user));
}
```

---

## Common Backend Integrations

### Node.js + Express
```bash
npm install axios
```

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginApi = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};
```

### Python + Flask
```python
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    
    if user and user.check_password(data['password']):
        token = create_access_token(identity=user.id)
        return jsonify({
            'success': True,
            'token': token,
            'user': user.to_dict()
        })
    
    return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
```

---

## Security Checklist

- [ ] Use HTTPS in production (not HTTP)
- [ ] Store sensitive data server-side, not in localStorage
- [ ] Validate input on backend (never trust frontend validation)
- [ ] Implement HTTPS with secure cookies for tokens
- [ ] Add CORS headers properly
- [ ] Never expose sensitive API keys in frontend code
- [ ] Implement token refresh mechanism
- [ ] Add rate limiting for login attempts
- [ ] Use strong password hashing (bcrypt, argon2)
- [ ] Implement 2FA for sensitive operations

---

## Debugging API Calls

### Log Requests
```javascript
export const loginApi = async (email, password) => {
  console.log('🔐 Login request:', { email });
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log('✅ Login response:', data);
    
    return data;
  } catch (error) {
    console.error('❌ Login error:', error);
    throw error;
  }
};
```

### Use Browser DevTools
- Network tab: See actual requests/responses
- Console tab: See logged data
- Application tab: Check localStorage for tokens

---

## Testing with Mock Data

### Keep Mock API for Development
```javascript
const USE_MOCK_API = process.env.VITE_USE_MOCK === 'true';

export const loginApi = async (email, password) => {
  if (USE_MOCK_API) {
    return mockLoginApi(email, password);
  }
  // Real API call
};
```

### Run with Mock
```bash
VITE_USE_MOCK=true npm run dev
```

---

## Performance Optimization

### Cancel Previous Requests
```javascript
let authAbortController;

export const loginApi = async (email, password) => {
  authAbortController?.abort();
  authAbortController = new AbortController();

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    signal: authAbortController.signal,
  });

  return response.json();
};
```

### Add Request Timeout
```javascript
const fetchWithTimeout = (url, options = {}, timeout = 10000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    ),
  ]);
};
```

---

## Migration Path

1. **Phase 1**: Keep mock API working
2. **Phase 2**: Create new `authApi.real.js` alongside mock
3. **Phase 3**: Switch to real API with feature flag
4. **Phase 4**: Remove mock API once tested in production
5. **Phase 5**: Monitor errors and optimize

---

## Support Resources

- [Fetch API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [JWT Authentication](https://jwt.io/)
- [CORS Explained](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [REST API Best Practices](https://restfulapi.net/)

---

**Ready to connect to a real backend? Start with Step 1!** 🚀
