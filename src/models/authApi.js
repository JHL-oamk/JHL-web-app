/**
 * Authentication API - Mock Data
 * Add your backend integration here
 */

import { User, AuthResponse } from './User';

// Mock user database (for testing only)
const mockUsers = [
  {
    email: 'test@example.com',
    username: 'testuser',
    password: 'password123',
  },
];

/**
 * Login API
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<AuthResponse>}
 */
export const loginApi = async (email, password) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    const user = mockUsers.find(u => u.email === email && u.password === password);

    if (user) {
      const authenticatedUser = new User(user.email, user.username);
      const token = 'mock_token_' + Date.now();
      localStorage.setItem('authToken', token);
      return new AuthResponse(true, 'Login successful', authenticatedUser, token);
    } else {
      return new AuthResponse(false, 'Invalid email or password', null, null);
    }
  } catch (error) {
    return new AuthResponse(false, 'Login failed: ' + error.message, null, null);
  }
};

/**
 * Register API
 * @param {string} email - User email
 * @param {string} username - User username
 * @param {string} password - User password
 * @returns {Promise<AuthResponse>}
 */
export const registerApi = async (email, username, password) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    // Check if email exists
    if (mockUsers.find(u => u.email === email)) {
      return new AuthResponse(false, 'Email already registered', null, null);
    }

    // Add new user
    mockUsers.push({ email, username, password });

    const authenticatedUser = new User(email, username);
    const token = 'mock_token_' + Date.now();
    localStorage.setItem('authToken', token);
    return new AuthResponse(true, 'Registration successful', authenticatedUser, token);
  } catch (error) {
    return new AuthResponse(false, 'Registration failed: ' + error.message, null, null);
  }
};

/**
 * Logout API
 * @returns {Promise<AuthResponse>}
 */
export const logoutApi = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  try {
    localStorage.removeItem('authToken');
    return new AuthResponse(true, 'Logout successful');
  } catch (error) {
    return new AuthResponse(false, 'Logout failed: ' + error.message);
  }
};



