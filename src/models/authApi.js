import { auth } from "../config/firebase";
import { User, AuthResponse } from "./User";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";

/**
 * Login API
 */
export const loginApi = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    const user = new User(
      firebaseUser.email,
      firebaseUser.displayName || "User"
    );

    const token = await firebaseUser.getIdToken();
    localStorage.setItem("authToken", token);

    return new AuthResponse(true, "Login successful", user, token);

  } catch (error) {
    return new AuthResponse(false, error.message, null, null);
  }
};

/**
 * Register API
 */
export const registerApi = async (email, username, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    await updateProfile(firebaseUser, {
      displayName: username
    });

    const user = new User(email, username);

    const token = await firebaseUser.getIdToken();
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