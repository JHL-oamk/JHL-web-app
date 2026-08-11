import { auth } from "../config/firebase";
import { User, AuthResponse } from "./User";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  deleteUser as firebaseDeleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = async (firebaseUser) => {
  const token = await firebaseUser.getIdToken();
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    token
  };
};

/**
 * Login API
 */
export const loginApi = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    const { headers, token } = await getAuthHeaders(firebaseUser);

    const response = await fetch(`${API_URL}/api/users/${firebaseUser.uid}`, { headers });
    const firestoreUser = response.ok ? await response.json() : null;

    // Auto-create user in DB if missing
    if (!firestoreUser) {
      await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          username: firebaseUser.displayName || "User",
          organisation: null,
          role: "user",
          createdAt: new Date(),
        })
      });
    }

    const user = new User(
      firebaseUser.uid,
      firebaseUser.email,
      firestoreUser?.username || firebaseUser.displayName || "User",
      firestoreUser?.organisation || null, 
      null
    );

    localStorage.setItem("authToken", token);

    return new AuthResponse(true, "Login successful", user, token);

  } catch (error) {
    return new AuthResponse(false, error.message, null, null);
  }
};

/**
 * Register API
 */
export const registerApi = async (email, username, password, organisation) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    await updateProfile(firebaseUser, { displayName: username });

    const { headers, token } = await getAuthHeaders(firebaseUser);

    await fetch(`${API_URL}/api/users`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        username: username,
        organisation: organisation?.trim() ? organisation.trim() : null,
        role: "user",
        createdAt: new Date(),
      })
    });

    const user = new User(
      firebaseUser.uid,
      firebaseUser.email,
      username,
      organisation?.trim() ? organisation.trim() : null, 
      null
    );
    localStorage.setItem("authToken", token);

    return new AuthResponse(true, "Registration successful", user, token);

  } catch (error) {
    return new AuthResponse(false, error.message, null, null);
  }
};

/**
 * Logout API
 */
export const logoutApi = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("authToken");
    return new AuthResponse(true, "Logout successful");
  } catch (error) {
    return new AuthResponse(false, error.message);
  }
};

/**
 * Reset Password API
 */
export const resetPasswordApi = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return new AuthResponse(true, "If this email exists, a reset link has been sent", null, null);
  } catch (error) {
    return new AuthResponse(false, error.message, null, null);
  }
};

/**
 * Google Sign in
 */
export const loginWithGoogleApi = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user;

    const { headers, token } = await getAuthHeaders(firebaseUser);

    const response = await fetch(`${API_URL}/api/users/${firebaseUser.uid}`, { headers });
    const firestoreUser = response.ok ? await response.json() : null;

    if (!firestoreUser) {
      await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          username: firebaseUser.displayName || "User",
          organisation: null,
          role: "user",
          createdAt: new Date(),
        })
      });
    }

    const user = new User(
      firebaseUser.uid,
      firebaseUser.email,
      firestoreUser?.username || firebaseUser.displayName || "User",
      firestoreUser?.organisation || null,
      firebaseUser.email 
    );

    localStorage.setItem("authToken", token);

    return new AuthResponse(true, "Google login successful", user, token);

  } catch (error) {
    return new AuthResponse(false, error.message, null, null);
  }
};

/**
 * Delete Account API
 */
export const deleteUserApi = async (password) => {
  try {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      return new AuthResponse(false, "No user logged in", null, null);
    }

    const isGoogleUser = firebaseUser.providerData?.some((provider) => provider.providerId === 'google.com');

    if (!isGoogleUser) {
      if (!password) {
        return new AuthResponse(false, "Please enter your password to confirm deletion.", null, null);
      }

      try {
        const credential = EmailAuthProvider.credential(firebaseUser.email, password);
        await reauthenticateWithCredential(firebaseUser, credential);
      } catch (reauthError) {
        return new AuthResponse(false, "Invalid password. Please try again.", null, null);
      }
    }

    const { headers } = await getAuthHeaders(firebaseUser);

    // Delete user from backend database
    const response = await fetch(`${API_URL}/api/users/${firebaseUser.uid}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return new AuthResponse(false, errorData.error || "Failed to delete user account", null, null);
    }

    // Delete Firebase user account
    await firebaseDeleteUser(firebaseUser);
    localStorage.removeItem("authToken");

    return new AuthResponse(true, "Account deleted successfully", null, null);

  } catch (error) {
    return new AuthResponse(false, error.message, null, null);
  }
};