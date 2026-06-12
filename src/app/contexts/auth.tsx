import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { User, AuthSession, Role, Permission } from "../data/mock-data";
import { users, roles, permissions } from "../data/mock-data";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  hasPermission: (permissionId: string) => boolean;
  hasRole: (roleName: string) => boolean;
  canAccess: (resource: string, action: string) => boolean;
  resetPassword: (email: string) => Promise<void>;
  verifyTwoFactor: (code: string) => Promise<void>;
}

export interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface PasswordValidation {
  isValid: boolean;
  errors: string[];
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  // Initialize auth from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        try {
          // Simulate token verification
          await new Promise((resolve) => setTimeout(resolve, 500));
          const storedUser = localStorage.getItem("current_user");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
            setSessionToken(token);
          }
        } catch (error) {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("current_user");
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Validate password according to OWASP standards
  const validatePassword = (password: string): PasswordValidation => {
    const errors: string[] = [];

    if (password.length < 12) {
      errors.push("Password must be at least 12 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  // Simulate password hashing (use bcrypt in production)
  const hashPassword = (password: string): string => {
    return btoa(password) + "_hash";
  };

  // Verify password
  const verifyPassword = (plainPassword: string, hashedPassword: string): boolean => {
    const computed = btoa(plainPassword) + "_hash";
    return computed === hashedPassword;
  };

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      const foundUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (!foundUser || !verifyPassword(password, foundUser.password)) {
        throw new Error("Invalid email or password");
      }

      if (foundUser.status === "suspended") {
        throw new Error("Account is suspended. Please contact support.");
      }

      if (foundUser.status === "inactive") {
        throw new Error("Account is inactive. Please contact support.");
      }

      // Generate session token (in production, use JWT)
      const token = btoa(`${foundUser.id}:${Date.now()}`);
      const cleanUser: User = { ...foundUser };
      delete (cleanUser as any).password;

      setUser(cleanUser);
      setSessionToken(token);

      // Store in localStorage
      localStorage.setItem("auth_token", token);
      localStorage.setItem("current_user", JSON.stringify(cleanUser));
      localStorage.setItem("login_time", new Date().toISOString());
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setUser(null);
      setSessionToken(null);
      localStorage.removeItem("auth_token");
      localStorage.removeItem("current_user");
      localStorage.removeItem("login_time");
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData): Promise<void> => {
    setIsLoading(true);
    try {
      // Validate input
      if (!data.email || !data.password || !data.firstName || !data.lastName) {
        throw new Error("All required fields must be filled");
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error("Invalid email format");
      }

      // Check if user already exists
      if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
        throw new Error("Email already registered");
      }

      // Validate password confirmation
      if (data.password !== data.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // Validate password strength
      const passwordValidation = validatePassword(data.password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors.join(". "));
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create new user
      const newUser: User = {
        id: `USER${Date.now()}`,
        email: data.email,
        password: hashPassword(data.password),
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: "customer",
        status: "active",
        twoFactorEnabled: false,
        createdAt: new Date().toISOString(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.firstName}`,
      };

      // Add to users array (in production, save to database)
      users.push(newUser);

      // Auto-login after signup
      const cleanUser: User = { ...newUser };
      delete (cleanUser as any).password;

      const token = btoa(`${newUser.id}:${Date.now()}`);
      setUser(cleanUser);
      setSessionToken(token);

      localStorage.setItem("auth_token", token);
      localStorage.setItem("current_user", JSON.stringify(cleanUser));
      localStorage.setItem("login_time", new Date().toISOString());
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    if (!user) throw new Error("Not authenticated");

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedUser: User = { ...user, ...data };
      setUser(updatedUser);

      localStorage.setItem("current_user", JSON.stringify(updatedUser));
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (
    oldPassword: string,
    newPassword: string
  ): Promise<void> => {
    if (!user) throw new Error("Not authenticated");

    setIsLoading(true);
    try {
      const foundUser = users.find((u) => u.id === user.id);
      if (!foundUser || !verifyPassword(oldPassword, foundUser.password)) {
        throw new Error("Current password is incorrect");
      }

      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors.join(". "));
      }

      // Prevent reusing old password
      if (oldPassword === newPassword) {
        throw new Error("New password must be different from old password");
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      foundUser.password = hashPassword(newPassword);
    } finally {
      setIsLoading(false);
    }
  };

  const hasPermission = (permissionId: string): boolean => {
    if (!user) return false;

    const userRole = roles.find((r) => r.name === user.role);
    return userRole?.permissions.includes(permissionId) || false;
  };

  const hasRole = (roleName: string): boolean => {
    return user?.role === roleName;
  };

  const canAccess = (resource: string, action: string): boolean => {
    if (!user) return false;

    const userRole = roles.find((r) => r.name === user.role);
    if (!userRole) return false;

    const requiredPermission = permissions.find(
      (p) => p.resource === resource && p.action === (action as any)
    );

    return (
      requiredPermission &&
      userRole.permissions.includes(requiredPermission.id)
    );
  };

  const resetPassword = async (email: string): Promise<void> => {
    setIsLoading(true);
    try {
      const foundUser = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (!foundUser) {
        throw new Error("Email not found");
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      // In production: Send reset email with token
    } finally {
      setIsLoading(false);
    }
  };

  const verifyTwoFactor = async (code: string): Promise<void> => {
    setIsLoading(true);
    try {
      if (!code || code.length !== 6) {
        throw new Error("Invalid code format");
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
      // In production: Verify with TOTP provider
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user && !!sessionToken,
    isLoading,
    login,
    logout,
    signup,
    updateProfile,
    changePassword,
    hasPermission,
    hasRole,
    canAccess,
    resetPassword,
    verifyTwoFactor,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
