/**
 * User Model - Defines the user data structure
 */

export class User {
  constructor(uid, email, username = null, organisation = null, googleAccount = null) { 
    this.uid = uid;
    this.email = email;
    this.username = username;
    this.organisation = organisation; //added org
    this.googleAccount = googleAccount; //added googleacc
    this.createdAt = new Date();
  }

  toJSON() {
    return {
      uid: this.uid,
      email: this.email,
      username: this.username,
      organisation: this.organisation,
      googleAccount: this.googleAccount,
      createdAt: this.createdAt,
    };
  }
}

/**
 * Authentication response structure
 */
export class AuthResponse {
  constructor(success, message, user = null, token = null) {
    this.success = success;
    this.message = message;
    this.user = user;
    this.token = token;
  }
}