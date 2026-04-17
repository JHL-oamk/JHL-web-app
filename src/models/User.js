/**
 * User Model - Defines the user data structure
 */

export class User {
  constructor(email, username = null, password = null) {
    this.email = email;
    this.username = username;
    this.password = password;
    this.createdAt = new Date();
  }

  toJSON() {
    return {
      email: this.email,
      username: this.username,
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
