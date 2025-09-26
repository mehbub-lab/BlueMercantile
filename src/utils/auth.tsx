import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-c7236e13`;

export interface User {
  userId: string;
  userType: 'admin' | 'patron' | 'creditClient';
  fullName?: string;
  email?: string;
  token: string;
  userData?: any;
}

export interface RegistrationData {
  userType: 'patron' | 'creditClient';
  fullName: string;
  entityType?: string;
  ngoRegId?: string;
  vp?: string;
  mobile: string;
  email: string;
  aadharId: string;
  address: string;
  pincode: string;
  state: string;
  walletAddress: string;
}

class AuthService {
  private user: User | null = null;
  private listeners: Array<(user: User | null) => void> = [];

  constructor() {
    // Load user from localStorage on initialization
    const savedUser = localStorage.getItem('bluemercantile_user');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
    }
  }

  subscribe(listener: (user: User | null) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.user));
  }

  getCurrentUser(): User | null {
    return this.user;
  }

  async loginAdmin(username: string, password: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.success) {
        this.user = {
          userId: 'admin',
          userType: 'admin',
          token: data.token
        };
        localStorage.setItem('bluemercantile_user', JSON.stringify(this.user));
        this.notifyListeners();
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Admin login error:', error);
      return { success: false, message: 'Login failed' };
    }
  }

  async loginUser(userId: string, password: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${API_BASE}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ userId, password })
      });

      const data = await response.json();

      if (data.success) {
        this.user = {
          userId: data.userId,
          userType: data.userType,
          token: data.token,
          userData: data.userData,
          fullName: data.userData?.fullName,
          email: data.userData?.email
        };
        localStorage.setItem('bluemercantile_user', JSON.stringify(this.user));
        this.notifyListeners();
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('User login error:', error);
      return { success: false, message: 'Login failed' };
    }
  }

  async register(registrationData: RegistrationData): Promise<{ success: boolean; message?: string; registrationId?: string }> {
    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(registrationData)
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Registration failed' };
    }
  }

  logout() {
    this.user = null;
    localStorage.removeItem('bluemercantile_user');
    this.notifyListeners();
  }

  isAuthenticated(): boolean {
    return this.user !== null;
  }

  isAdmin(): boolean {
    return this.user?.userType === 'admin';
  }

  // Admin functions
  async getPendingRegistrations() {
    try {
      const response = await fetch(`${API_BASE}/admin/pending-registrations`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Get pending registrations error:', error);
      return { success: false, message: 'Failed to fetch registrations' };
    }
  }

  async approveRegistration(registrationId: string) {
    try {
      const response = await fetch(`${API_BASE}/admin/approve-registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ registrationId })
      });
      return await response.json();
    } catch (error) {
      console.error('Approve registration error:', error);
      return { success: false, message: 'Approval failed' };
    }
  }

  async rejectRegistration(registrationId: string, reason: string) {
    try {
      const response = await fetch(`${API_BASE}/admin/reject-registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ registrationId, reason })
      });
      return await response.json();
    } catch (error) {
      console.error('Reject registration error:', error);
      return { success: false, message: 'Rejection failed' };
    }
  }

  async getApprovedUsers() {
    try {
      const response = await fetch(`${API_BASE}/admin/approved-users`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Get approved users error:', error);
      return { success: false, message: 'Failed to fetch users' };
    }
  }

  async toggleUserStatus(userId: string, banned: boolean) {
    try {
      const response = await fetch(`${API_BASE}/admin/toggle-user-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ userId, banned })
      });
      return await response.json();
    } catch (error) {
      console.error('Toggle user status error:', error);
      return { success: false, message: 'Failed to update user status' };
    }
  }

  async changeUserPassword(userId: string, newPassword: string) {
    try {
      const response = await fetch(`${API_BASE}/admin/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ userId, newPassword })
      });
      return await response.json();
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, message: 'Failed to change password' };
    }
  }

  async getEmailLogs() {
    try {
      const response = await fetch(`${API_BASE}/admin/email-logs`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Get email logs error:', error);
      return { success: false, message: 'Failed to fetch email logs' };
    }
  }
}

export const authService = new AuthService();