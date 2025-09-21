import { Injectable } from '@angular/core';

export interface StoredUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string; // In a real app, this would be hashed
  dateOfBirth: string;
  gender: string;
  createdAt: string;
  subscribeNewsletter: boolean;
}

export interface UserCredentials {
  username: string; // email or mobile
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  private readonly USERS_KEY = 'irctc_registered_users';

  constructor() {
    this.initializeDemoUser();
  }

  /**
   * Initialize demo user for testing purposes
   */
  private initializeDemoUser(): void {
    const users = this.getAllUsers();

    // Check if demo user already exists
    const demoExists = users.some((u) => u.email === 'demo@irctc.com');

    if (!demoExists) {
      const demoUser: StoredUser = {
        id: 'demo_user_001',
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@irctc.com',
        mobile: '9876543210',
        password: 'Demo@123',
        dateOfBirth: new Date('1990-01-01').toISOString(),
        gender: 'other',
        createdAt: new Date().toISOString(),
        subscribeNewsletter: true,
      };

      users.push(demoUser);
      this.saveUsers(users);
    }
  }

  /**
   * Register a new user
   */
  registerUser(userData: Omit<StoredUser, 'id' | 'createdAt'>): {
    success: boolean;
    user?: StoredUser;
    error?: string;
  } {
    try {
      // Check if user already exists
      if (this.userExists(userData.email, userData.mobile)) {
        return {
          success: false,
          error: 'User with this email or mobile number already exists',
        };
      }

      // Create new user
      const newUser: StoredUser = {
        ...userData,
        id: this.generateUserId(),
        createdAt: new Date().toISOString(),
      };

      // Save user
      const users = this.getAllUsers();
      users.push(newUser);
      this.saveUsers(users);

      return {
        success: true,
        user: newUser,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to register user',
      };
    }
  }

  /**
   * Authenticate user with email/mobile and password
   */
  authenticateUser(credentials: UserCredentials): {
    success: boolean;
    user?: StoredUser;
    error?: string;
  } {
    try {
      const users = this.getAllUsers();
      const user = users.find(
        (u) =>
          (u.email === credentials.username ||
            u.mobile === credentials.username) &&
          u.password === credentials.password
      );

      if (user) {
        return {
          success: true,
          user: user,
        };
      } else {
        return {
          success: false,
          error: 'Invalid email/mobile or password',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Authentication failed',
      };
    }
  }

  /**
   * Check if user exists by email or mobile
   */
  private userExists(email: string, mobile: string): boolean {
    const users = this.getAllUsers();
    return users.some((u) => u.email === email || u.mobile === mobile);
  }

  /**
   * Get all registered users
   */
  private getAllUsers(): StoredUser[] {
    try {
      const usersData = localStorage.getItem(this.USERS_KEY);
      return usersData ? JSON.parse(usersData) : [];
    } catch (error) {
      console.error('Error loading users:', error);
      return [];
    }
  }

  /**
   * Save users to localStorage
   */
  private saveUsers(users: StoredUser[]): void {
    try {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users:', error);
      throw error;
    }
  }

  /**
   * Generate unique user ID
   */
  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get user by email or mobile (for debugging/admin purposes)
   */
  getUserByEmailOrMobile(emailOrMobile: string): StoredUser | null {
    const users = this.getAllUsers();
    return (
      users.find(
        (u) => u.email === emailOrMobile || u.mobile === emailOrMobile
      ) || null
    );
  }

  /**
   * Get user by ID
   */
  getUserById(id: string): StoredUser | null {
    const users = this.getAllUsers();
    return users.find((u) => u.id === id) || null;
  }

  /**
   * Get total registered users count
   */
  getTotalUsersCount(): number {
    return this.getAllUsers().length;
  }

  /**
   * Clear all users (for testing purposes)
   */
  clearAllUsers(): void {
    localStorage.removeItem(this.USERS_KEY);
  }
}
