import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Logo } from "./logo";
import { useAuth, type SignupData } from "../contexts/auth";
import { toast } from "sonner";
import {
  User,
  Mail,
  Lock,
  Phone,
  Loader2,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

export function Signup() {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    label: "Very Weak",
    color: "bg-red-500",
  });

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;

    const strengthMap: Record<number, PasswordStrength> = {
      0: { score: 0, label: "Very Weak", color: "bg-red-500" },
      1: { score: 1, label: "Weak", color: "bg-orange-500" },
      2: { score: 2, label: "Fair", color: "bg-yellow-500" },
      3: { score: 3, label: "Good", color: "bg-lime-500" },
      4: { score: 4, label: "Strong", color: "bg-green-500" },
      5: { score: 5, label: "Very Strong", color: "bg-emerald-500" },
      6: { score: 6, label: "Excellent", color: "bg-emerald-600" },
    };

    return strengthMap[score] || strengthMap[0];
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 12) {
      newErrors.password = "Password must be at least 12 characters";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Password must include uppercase letters";
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = "Password must include lowercase letters";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must include numbers";
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password)) {
      newErrors.password = "Password must include special characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, password: newPassword });
    setPasswordStrength(calculatePasswordStrength(newPassword));
    if (errors.password) setErrors({ ...errors, password: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const signupData: SignupData = {
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
      };

      await signup(signupData);
      toast.success("Account created successfully");
      navigate("/admin");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Signup failed";
      toast.error(errorMessage);
    }
  };

  const getPasswordRequirements = () => {
    const requirements = [
      {
        met: formData.password.length >= 12,
        text: "At least 12 characters",
      },
      { met: /[A-Z]/.test(formData.password), text: "Uppercase letter" },
      { met: /[a-z]/.test(formData.password), text: "Lowercase letter" },
      { met: /[0-9]/.test(formData.password), text: "Number" },
      { met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password), text: "Special character" },
    ];

    return requirements;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <Card className="backdrop-blur-xl bg-white/10 border-white/20 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              Create Account
            </h1>
            <p className="text-gray-400">Join MAXIMUM today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-white">
                First Name
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Ahmed"
                value={formData.firstName}
                onChange={(e) => {
                  setFormData({ ...formData, firstName: e.target.value });
                  if (errors.firstName)
                    setErrors({ ...errors, firstName: "" });
                }}
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                disabled={isLoading}
              />
              {errors.firstName && (
                <p className="text-sm text-red-400">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-white">
                Last Name
              </Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Al Mansouri"
                value={formData.lastName}
                onChange={(e) => {
                  setFormData({ ...formData, lastName: e.target.value });
                  if (errors.lastName) setErrors({ ...errors, lastName: "" });
                }}
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                disabled={isLoading}
              />
              {errors.lastName && (
                <p className="text-sm text-red-400">{errors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Phone (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">
                Phone (Optional)
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+971 50 123 4567"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Strength */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      Strength: <span className="text-white">{passwordStrength.label}</span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} transition-all`}
                      style={{
                        width: `${(passwordStrength.score / 6) * 100}%`,
                      }}
                    ></div>
                  </div>

                  {/* Requirements */}
                  <div className="space-y-1 mt-2">
                    {getPasswordRequirements().map((req) => (
                      <div
                        key={req.text}
                        className="flex items-center gap-2 text-xs"
                      >
                        {req.met ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-gray-500" />
                        )}
                        <span
                          className={
                            req.met ? "text-gray-400" : "text-gray-600"
                          }
                        >
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {errors.password && (
                <p className="text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmPassword: e.target.value });
                    if (errors.confirmPassword)
                      setErrors({ ...errors, confirmPassword: "" });
                  }}
                  className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {formData.confirmPassword &&
                formData.password === formData.confirmPassword && (
                  <div className="flex items-center gap-2 text-xs text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    Passwords match
                  </div>
                )}
              {errors.confirmPassword && (
                <p className="text-sm text-red-400">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-2.5 mt-6"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 hover:text-blue-300">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
