import { auth } from "../config/firebase";
import { User, AuthResponse } from "./User";
import { createUser, getUser } from "../services/userService"

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

/**
 * Login API
 */
// Added Auth login + Firestore user profile fetch
export const loginApi = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    //FIRESTORE FETCH
    const firestoreUser = await getUser(firebaseUser.uid);

    if (!firestoreUser) {
      console.warn("Firestore user missing for uid:", firebaseUser.uid);
    }

    const user = new User(
      firebaseUser.uid,
      firebaseUser.email,
      firestoreUser?.username || firebaseUser.displayName || "User"
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
// Added firestore to store registered account details
export const registerApi = async (email, username, password, organisation) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("REGISTER API organisation:", organisation);
    const firebaseUser = userCredential.user;

    await updateProfile(firebaseUser, {
      displayName: username
    });

    //FIRESTORE
    await createUser(firebaseUser.uid, {
      email: firebaseUser.email,
      username: username,
      organisation: organisation?.trim() ? organisation.trim() : null,
      role: "user",
      createdAt: new Date(),
    });
    
    const user = new User(
     firebaseUser.uid,
     firebaseUser.email,
     username
    );

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

/**
 * Reset Password API (Firebase standard)
 */
export const resetPasswordApi = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);

    // ⚠️ Firebase intentionally hides whether email exists
    return new AuthResponse(
      true,
      "If this email exists, a reset link has been sent",
      null,
      null
    );

  } catch (error) {
    return new AuthResponse(
      false,
      error.message,
      null,
      null
    );
  }
};

/**
 * Google Sign in firebase
 */
export const loginWithGoogleApi = async () => {
  try {
    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user;

    const firestoreUser = await getUser(firebaseUser.uid);

    //Create new user to firebase if doesn't exist
    if (!firestoreUser) {
      await createUser(firebaseUser.uid, {
        email: firebaseUser.email,
        username: firebaseUser.displayName || "User",
        organisation: null,
        role: "user",
        createdAt: new Date(),
      });
    }

    const user = new User(
      firebaseUser.uid,
      firebaseUser.email,
      firestoreUser?.username || firebaseUser.displayName || "User"
    );

    const token = await firebaseUser.getIdToken();
    localStorage.setItem("authToken", token);

    return new AuthResponse(true, "Google login successful", user, token);

  } catch (error) {
    return new AuthResponse(false, error.message, null, null);
  }
};