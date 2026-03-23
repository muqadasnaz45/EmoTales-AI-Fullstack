import React, { useState, useEffect, useCallback } from "react";
import {
  AlertCircle,
  BookOpen,
  Image,
  Type,
  Loader2,
  Trash2,
  Eye,
  LogOut,
  X,
  User,
  ChevronDown,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = "http://localhost:8000";

// ---------------------- TOAST ----------------------
function Toast({ message, type = "success", onClose }) {
  if (!message) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, x: 20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, y: -20, x: 20 }}
        transition={{ duration: 0.25 }}
        className={`fixed top-4 right-4 z-50 rounded-xl px-4 py-3 shadow-lg text-sm flex items-center space-x-2 ${
          type === "success"
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "bg-red-50 text-red-700 border border-red-200"
        }`}
      >
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-xs text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

// ---------------------- RESET PASSWORD MODAL ----------------------
function ResetPasswordModal({ isOpen, onClose, token, onSuccess }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (pwd) => {
    const lengthOK = pwd.length >= 8;
    const upperOK = /[A-Z]/.test(pwd);
    const lowerOK = /[a-z]/.test(pwd);
    const numOK = /[0-9]/.test(pwd);
    const specialOK = /[^A-Za-z0-9]/.test(pwd);
    return { lengthOK, upperOK, lowerOK, numOK, specialOK };
  };

  const validations = validatePassword(newPassword);
  const allValid =
    validations.lengthOK &&
    validations.upperOK &&
    validations.lowerOK &&
    validations.numOK &&
    validations.specialOK &&
    newPassword === confirmNewPassword &&
    oldPassword.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!allValid) {
      setError("Please fix the validation errors before submitting.");
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append("old_password", oldPassword);
      form.append("new_password", newPassword);
      const response = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Password reset failed");
      }
      onSuccess();
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="glass-card rounded-2xl shadow-soft max-w-md w-full mx-4 p-6 relative"
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-600">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Reset Password
              </h2>
              <p className="text-sm text-white">
                Choose a strong and secure password.
              </p>
            </div>
          </div>
          {error && (
            <div className="mb-3 p-2 text-xs bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
  <form onSubmit={handleSubmit} className="space-y-4 mt-2">
  <div>
    <label className="block text-sm font-medium text-white mb-1">
      Old Password
    </label>
    <input
      type="password"
      value={oldPassword}
      onChange={(e) => setOldPassword(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-white text-black"
      required
    />
  </div>
  <div>
    <label className="block text-sm font-medium text-white mb-1">
      New Password
    </label>
    <input
      type="password"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-white text-black"
      required
    />
    <div className="mt-2 text-xs space-y-1">
      <ValidationItem
        ok={validations.lengthOK}
        text="At least 8 characters"
      />
      <ValidationItem
        ok={validations.upperOK}
        text="Contains an uppercase letter"
      />
      <ValidationItem
        ok={validations.lowerOK}
        text="Contains a lowercase letter"
      />
      <ValidationItem
        ok={validations.numOK}
        text="Contains a number"
      />
      <ValidationItem
        ok={validations.specialOK}
        text="Contains a special character"
      />
    </div>
  </div>
  <div>
    <label className="block text-sm font-medium text-white mb-1">
      Confirm New Password
    </label>
    <input
      type="password"
      value={confirmNewPassword}
      onChange={(e) => setConfirmNewPassword(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-white text-black"
      required
    />
    <p className="mt-1 text-xs">
      <span
        className={
          confirmNewPassword.length === 0
            ? "text-gray-400"
            : newPassword === confirmNewPassword
            ? "text-emerald-600"
            : "text-red-600"
        }
      >
        {confirmNewPassword.length === 0
          ? "Please confirm your new password"
          : newPassword === confirmNewPassword
          ? "✓ Passwords match"
          : "✗ Passwords do not match"}
      </span>
    </p>
  </div>
  <button
    type="submit"
    disabled={!allValid || loading}
    className="btn-glow w-full flex items-center justify-center space-x-2 py-2.5 rounded-lg font-semibold text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 disabled:opacity-60 disabled:cursor-not-allowed transition-transform transform hover:translate-y-0.5"
  >
    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
    <span>{loading ? "Updating..." : "Update Password"}</span>
  </button>
</form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ValidationItem({ ok, text }) {
  return (
    <div className="flex items-center space-x-2">
      <span className={ok ? "text-emerald-600" : "text-red-600"}>
        {ok ? "✓" : "✗"}
      </span>
      <span className={ok ? "text-emerald-700" : "text-gray-500"}>{text}</span>
    </div>
  );
}

// ---------------------- PROFILE DROPDOWN ----------------------
function ProfileDropdown({ user, onLogoutClick, onResetPasswordClick }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold">
          {user?.name
            ? user.name.charAt(0).toUpperCase()
            : user?.email?.charAt(0).toUpperCase() || "U"}
        </div>
        <div className="hidden sm:flex flex-col items-start text-left">
          <span className="text-xs text-gray-500">Logged in as</span>
          <span className="text-sm font-medium text-gray-800 truncate max-w-[140px]">
            {user?.name || "User"}
          </span>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 glass-card rounded-2xl shadow-soft-sm border border-gray-100 z-30"
          >
            <div className="p-3 border-b border-gray-200 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                <User className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-white truncate">
                  {user?.email || "email@example.com"}
                </p>
              </div>
            </div>
            <div className="py-1">
              <button
                onClick={() => {
                  setOpen(false);
                  onResetPasswordClick();
                }}
                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-white hover:bg-black transition"
              >
                <Lock className="w-4 h-4 text-white" />
                <span>Reset Password</span>
              </button>
            </div>
            <div className="border-t border-gray-100">
              <button
                onClick={() => {
                  setOpen(false);
                  onLogoutClick();
                }}
                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------- LOGIN PAGE ----------------------
function LoginPage({ onLogin, onSwitch, showSuccessAnimation }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setLoginSuccess(false);
    try {
      const form = new FormData();
      form.append("email", formData.email);
      form.append("password", formData.password);
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        body: form,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Invalid email or password");
      }
      onLogin(data.access_token, data.user);
      setLoginSuccess(true);
      showSuccessAnimation();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isEmailFilled = formData.email.length > 0;
  const isPasswordFilled = formData.password.length > 0;

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8 items-center">
        {/* Left side */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden md:flex flex-col space-y-6 text-slate-100"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">StoryTeller</h1>
              <p className="text-slate-300 text-sm">
                Craft magical stories with the power of AI.
              </p>
            </div>
          </div>
          <p className="text-slate-200 text-sm leading-relaxed">
            Design interactive, age‑appropriate tales in seconds. Switch between
            categories, save your favorites, and revisit your creations anytime.
          </p>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3">
              <p className="font-semibold text-slate-100">Smart Creation</p>
              <p className="text-slate-400 mt-1">
                Turn a simple title into a full story instantly.
              </p>
            </div>
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3">
              <p className="font-semibold text-slate-100">Visual Mode</p>
              <p className="text-slate-400 mt-1">
                Soon you'll create stories from images.
              </p>
            </div>
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3">
              <p className="font-semibold text-slate-100">Your Library</p>
              <p className="text-slate-400 mt-1">
                Keep a history of every story you generate.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right side - form */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl shadow-black/40 p-6 backdrop-blur-xl"
        >
          <div className="text-center mb-6 md:mb-8 md:hidden">
            <BookOpen className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-white">StoryTeller</h2>
            <p className="text-slate-400 text-sm mt-1">
              Login to continue your stories
            </p>
          </div>
          <h2 className="text-xl font-semibold text-white mb-4">
            Welcome back
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Enter your credentials to access your dashboard.
          </p>
          {error && (
            <div className="mb-3 p-2.5 bg-red-950/50 border border-red-500/40 rounded-xl flex items-center space-x-2 text-red-200 text-xs">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block text-slate-200 mb-1.5 text-xs font-medium">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-slate-200 mb-1.5 text-xs font-medium">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || !isEmailFilled || !isPasswordFilled}
              className="btn-glow w-full flex items-center justify-center space-x-2 py-2.5 mt-2 rounded-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 disabled:opacity-60 disabled:cursor-not-allowed transition-transform transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>
          <p className="text-center text-xs text-slate-400 mt-5">
            Don't have an account?{" "}
            <button
              onClick={onSwitch}
              className="text-purple-300 hover:text-purple-200 font-medium underline-offset-2 hover:underline"
            >
              Sign up
            </button>
          </p>
          {loginSuccess && (
            <div className="mt-3 text-center text-xs text-emerald-300">
              Redirecting to dashboard...
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// ---------------------- SIGNUP PAGE ----------------------
function SignupPage({ onSwitch }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const nameRegex = /^[A-Za-z ]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validatePassword = (pwd) => {
    const lengthOK = pwd.length >= 8;
    const upperOK = /[A-Z]/.test(pwd);
    const lowerOK = /[a-z]/.test(pwd);
    const numOK = /[0-9]/.test(pwd);
    const specialOK = /[^A-Za-z0-9]/.test(pwd);
    return { lengthOK, upperOK, lowerOK, numOK, specialOK };
  };

  const pwdValidations = validatePassword(formData.password);
  const passwordsMatch =
    formData.password.length > 0 &&
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  const canSubmit =
    nameRegex.test(formData.name) &&
    emailRegex.test(formData.email) &&
    pwdValidations.lengthOK &&
    pwdValidations.upperOK &&
    pwdValidations.lowerOK &&
    pwdValidations.numOK &&
    pwdValidations.specialOK &&
    passwordsMatch;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!canSubmit) {
      setError("Please fix validation errors before submitting.");
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("password", formData.password);
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        body: form,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Signup failed");
      }
      setSuccess(true);
      setTimeout(() => onSwitch(), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderCheck = (ok) => (
    <span className={ok ? "text-emerald-600" : "text-red-600"}>
      {ok ? "✓" : "✗"}
    </span>
  );

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl shadow-black/40 p-6 backdrop-blur-xl"
      >
        <div className="text-center mb-6">
          <BookOpen className="w-12 h-12 text-purple-400 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-white">Create an account</h1>
          <p className="text-slate-400 text-xs mt-1">
            Start creating and saving your AI stories.
          </p>
        </div>
        {error && (
          <div className="mb-3 p-2.5 bg-red-950/50 border border-red-500/40 rounded-xl flex items-center space-x-2 text-red-200 text-xs">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-3 p-2.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs">
            Account created! Redirecting to login...
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-slate-200 mb-1.5 text-xs font-medium">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="John Doe"
              required
            />
            <p className="mt-1 text-xs">
              {renderCheck(
                formData.name.length === 0 || nameRegex.test(formData.name)
              )}{" "}
              <span
                className={
                  nameRegex.test(formData.name) || formData.name.length === 0
                    ? "text-slate-400"
                    : "text-red-300"
                }
              >
                Alphabets and spaces only.
              </span>
            </p>
          </div>
          <div>
            <label className="block text-slate-200 mb-1.5 text-xs font-medium">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="you@example.com"
              required
            />
            <p className="mt-1 text-xs">
              {renderCheck(
                formData.email.length === 0 || emailRegex.test(formData.email)
              )}{" "}
              <span
                className={
                  emailRegex.test(formData.email) || formData.email.length === 0
                    ? "text-slate-400"
                    : "text-red-300"
                }
              >
                Must be a valid email address.
              </span>
            </p>
          </div>
          <div>
            <label className="block text-slate-200 mb-1.5 text-xs font-medium">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
              required
              minLength={8}
            />
            <div className="mt-1 text-xs space-y-1">
              <div>
                {renderCheck(pwdValidations.lengthOK)}{" "}
                <span className="text-slate-400">At least 8 characters</span>
              </div>
              <div>
                {renderCheck(pwdValidations.upperOK)}{" "}
                <span className="text-slate-400">
                  Contains an uppercase letter
                </span>
              </div>
              <div>
                {renderCheck(pwdValidations.lowerOK)}{" "}
                <span className="text-slate-400">
                  Contains a lowercase letter
                </span>
              </div>
              <div>
                {renderCheck(pwdValidations.numOK)}{" "}
                <span className="text-slate-400">Contains a number</span>
              </div>
              <div>
                {renderCheck(pwdValidations.specialOK)}{" "}
                <span className="text-slate-400">
                  Contains a special character
                </span>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-slate-200 mb-1.5 text-xs font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
              required
            />
            <p className="mt-1 text-xs">
              {renderCheck(
                formData.confirmPassword.length === 0 || passwordsMatch
              )}{" "}
              <span
                className={
                  passwordsMatch || formData.confirmPassword.length === 0
                    ? "text-slate-400"
                    : "text-red-300"
                }
              >
                {formData.confirmPassword.length === 0
                  ? "Please confirm your password."
                  : passwordsMatch
                  ? "Passwords match."
                  : "Passwords do not match."}
              </span>
            </p>
          </div>
          <button
            type="submit"
            disabled={loading || success || !canSubmit}
            className="btn-glow w-full flex items-center justify-center space-x-2 py-2.5 mt-2 rounded-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 disabled:opacity-60 disabled:cursor-not-allowed transition-transform transform hover:-translate-y-0.5"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Sign Up</span>
            )}
          </button>
        </form>
        <p className="text-center text-xs text-slate-400 mt-5">
          Already have an account?{" "}
          <button
            onClick={onSwitch}
            className="text-purple-300 hover:text-purple-200 font-medium underline-offset-2 hover:underline"
          >
            Login
          </button>
        </p>
      </motion.div>
    </div>
  );
}

// ---------------------- DASHBOARD (STORY CREATION) ----------------------
function Dashboard({ token }) {
  const [storyType, setStoryType] = useState("text");
  const [formData, setFormData] = useState({
    title: "",
    category: "adventure",
    age_group: "children",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatedStory, setGeneratedStory] = useState(null);
  const [error, setError] = useState("");

  const categories = [
    "adventure",
    "fantasy",
    "mystery",
    "comedy",
    "horror",
    "romance",
    "sci-fi",
    "fairy-tale",
  ];
  const ageGroups = ["children", "teens", "adults"];

  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // Access the first file
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setGeneratedStory(null);
    try {
      if (storyType === "text") {
        const form = new FormData();
        form.append("title", formData.title);
        form.append("category", formData.category);
        form.append("age_group", formData.age_group);
        const response = await fetch(`${API_BASE}/story/text`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.detail || "Story generation failed");
        }
        setGeneratedStory(data);
        setFormData({
          title: "",
          category: "adventure",
          age_group: "children",
        });
      } else {
        setError(
          "Image to story feature coming soon! Backend integration pending."
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: "Mode", value: storyType === "text" ? "Text" : "Image" },
    { label: "Category", value: formData.category },
    { label: "Age Group", value: formData.age_group },
  ];

  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
      className="max-w-7xl mx-auto px-4 py-6 lg:py-8"
    >
      {/* Dark gradient hero bar like screenshot */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 rounded-2xl hero-bar p-[1px] shadow-soft-sm"
      >
        <div className="rounded-2xl px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-white">
              Create Your Story
            </h1>
            <p className="text-sm text-slate-200/80 mt-1 max-w-xl">
              Choose a mode, set the tone, and let the AI generate a magical
              story tailored for your audience.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {stats.map((s) => (
              <motion.div
                key={s.label}
                whileHover={{ y: -2, scale: 1.02 }}
                className="hero-pill rounded-2xl px-4 py-2 flex flex-col min-w-[90px]"
              >
                <span className="text-xs text-slate-300">{s.label}</span>
                <span className="text-sm font-semibold text-slate-50 capitalize">
                  {s.value}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Story Type Selection */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="glass-card rounded-2xl shadow-soft p-5 border border-slate-100/80"
          >
            <h3 className="text-sm font-semiboldfont-semibold text-white-800 mb-4">
              Choose Story Type
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => setStoryType("text")}
                className={`p-4 rounded-xl border-2 transition flex flex-col items-center ${
                  storyType === "text"
                    ? "border-purple-500 bg-purple-50 shadow-soft-sm"
                    : "border-slate-200 hover:border-purple-300 bg-white/80"
                }`}
              >
                <Type
                  className={`w-8 h-8 mb-2 ${
                    storyType === "text" ? "text-purple-600" : "text-slate-400"
                  }`}
                />
                <p className="font-semibold text-sm text-slate-800">
                  Text to Story
                </p>
                <p className="text-xs text-slate-500 mt-1 text-center">
                  Start from a title and category.
                </p>
              </motion.button>

              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => setStoryType("image")}
                className={`p-4 rounded-xl border-2 transition flex flex-col items-center ${
                  storyType === "image"
                    ? "border-purple-500 bg-purple-50 shadow-soft-sm"
                    : "border-slate-200 hover:border-purple-300 bg-white/80"
                }`}
              >
                <Image
                  className={`w-8 h-8 mb-2 ${
                    storyType === "image" ? "text-purple-600" : "text-slate-400"
                  }`}
                />
                <p className="font-semibold text-sm text-slate-800">
                  Image to Story
                </p>
                <p className="text-[11px] text-slate-500 mt-1">Coming soon</p>
              </motion.button>
            </div>
          </motion.div>

          {/* Story Form */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            className="glass-card rounded-2xl shadow-soft p-5 border border-slate-100/80"
          >
            {error && (
              <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700 text-xs">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              {storyType === "text" ? (
                <>
                  <div>
                    <label className="block text-white mb-1 text-xs font-medium">
                      Story Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-white text-black"
                      placeholder="The Brave Knight's Quest"
                      required
                      minLength={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white mb-1 text-xs font-medium">
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            category: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent capitalize text-sm bg-white text-black"
                        required
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat} className="capitalize">
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-white mb-1 text-xs font-medium">
                        Age Group*
                      </label>
                      <select
                        value={formData.age_group}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            age_group: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent capitalize text-sm bg-white text-black"
                        required
                      >
                        {ageGroups.map((age) => (
                          <option key={age} value={age} className="capitalize">
                            {age}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-white mb-1 text-xs font-medium">
                      Upload Image *
                    </label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-5 text-center hover:border-purple-400 transition cursor-pointer bg-white/70">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        {imagePreview ? (
                          <div className="relative inline-block">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="max-h-48 mx-auto rounded-lg object-cover"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                setImageFile(null);
                                setImagePreview(null);
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <Image className="w-10 h-10 text-black mx-auto mb-2" />
                            <p className="text-black text-sm">
                              Click to upload an image
                            </p>
                            <p className="text-xs text-black mt-1">
                              PNG, JPG up to 5MB
                            </p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white mb-1 text-xs font-medium">
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            category: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent capitalize text-sm bg-white text-black"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat} className="capitalize">
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-white mb-1 text-xs font-medium">
                        Age Group *
                      </label>
                      <select
                        value={formData.age_group}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            age_group: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent capitalize text-sm bg-white text-black"
                      >
                        {ageGroups.map((age) => (
                          <option key={age} value={age} className="capitalize">
                            {age}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}
              <button
                type="submit"
                disabled={loading || (storyType === "image" && !imageFile)}
                className="btn-glow w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 rounded-lg font-semibold hover:shadow-md transition flex items-center justify-center space-x-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating Story...</span>
                  </>
                ) : (
                  <span>Generate Story</span>
                )}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Right Column - Generated Story */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.15 }}
          className="space-y-4"
        >
          <div>
            <h2 className="text-xl font-semibold text-white">
              Generated Story
            </h2>
            <p className="text-sm text-white">
              Your AI-generated story will appear here.
            </p>
          </div>
          <div className="glass-card rounded-2xl shadow-soft p-5 min-h-[260px] border border-slate-100/80">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full space-y-3 text-center">
                <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
                <p className="text-sm text-white">
                  Creating your magical story...
                </p>
              </div>
            ) : generatedStory ? (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-xl font-semibold text-slate-900 mb-1">
                    {generatedStory.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full capitalize border border-purple-100">
                      {generatedStory.category}
                    </span>
                    <span className="bg-pink-50 text-pink-700 px-3 py-1 rounded-full capitalize border border-pink-100">
                      {generatedStory.age_group}
                    </span>
                  </div>
                </div>
                <div className="prose max-w-none text-justify text-sm text-white leading-relaxed">
                  {generatedStory.content.split("\n\n").map((p, idx) => (
                    <p key={idx} className="mb-3">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-fulltext-sm text-white text-center">
                <BookOpen className="w-12 h-12 mb-3" />
                <p>Your generated story will appear here.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ---------------------- MY STORIES PAGE ----------------------
function MyStories({ token }) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState(null);
  const [filterCategory, setFilterCategory] = useState("");

  const categories = [
    "adventure",
    "fantasy",
    "mystery",
    "comedy",
    "horror",
    "romance",
    "sci-fi",
    "fairy-tale",
  ];

  const fetchStories = useCallback(async () => {
    try {
      const url = filterCategory
        ? `${API_BASE}/story?category=${filterCategory}`
        : `${API_BASE}/story`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setStories(data);
      if (data.length && !selectedStory) {
        setSelectedStory(data[0]); // Pass the first story object
      }
    } catch (err) {
      console.error("Failed to fetch stories:", err);
    } finally {
      setLoading(false);
    }
  }, [filterCategory, token, selectedStory]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const deleteStory = async (storyId) => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;
    try {
      const response = await fetch(`${API_BASE}/story/${storyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const updated = stories.filter((s) => s.story_id !== storyId);
        setStories(updated);
        if (selectedStory?.story_id === storyId) {
          setSelectedStory(updated || null);
        }
      }
    } catch (err) {
      console.error("Failed to delete story:", err);
    }
  };

  return (
    <motion.div
      key="mystories"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
      className="max-w-7xl mx-auto px-4 py-6 lg:py-8"
    >
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-white">
            My Stories
          </h1>
          <p className="text-sm text-white mt-1">
            Browse, read, and manage the stories you've created.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <label className="text-white text-xs font-medium">
            Filter by category:
          </label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="capitalize">
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
        </div>
      ) : stories.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl shadow-soft border border-slate-100">
          <BookOpen className="w-14 h-14 text-white mx-auto mb-4" />
          <p className="text-white text-sm">
            No stories yet. Create your first story from the dashboard.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-6">
          {/* Stories List */}
          <div className="space-y-3">
            {stories.map((story) => (
              <motion.div
                key={story.story_id}
                whileHover={{ scale: 1.01, translateY: -2 }}
                className="glass-card rounded-xl shadow-soft-sm p-4 border border-slate-100 hover:border-purple-200 transition cursor-pointer"
                onClick={() => setSelectedStory(story)}
              >
                <h3 className="text-base font-semibold text-slate-900 mb-1.5">
                  {story.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mb-2 text-[11px]">
                  <span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full capitalize border border-purple-100">
                    {story.category}
                  </span>
                  <span className="bg-pink-50 text-pink-700 px-2.5 py-1 rounded-full capitalize border border-pink-100">
                    {story.age_group}
                  </span>
                </div>
                <p className="text-white text-xs line-clamp-2">
                  {story.content.substring(0, 150)}...
                </p>
                <div className="flex items-center justify-between mt-3 text-[11px]">
                  <span className="text-slate-400">
                    {new Date(story.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStory(story);
                      }}
                      className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteStory(story.story_id);
                      }}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Story Viewer */}
          <div className="sticky top-20">
            {selectedStory ? (
              <div className="glass-card rounded-2xl shadow-soft p-5 max-h-[calc(100vh-180px)] overflow-y-auto border border-slate-100">
                <div className="border-b border-slate-100 pb-3 mb-3">
                  <h2 className="text-xl font-semibold text-slate-900 mb-1.5">
                    {selectedStory.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 text-xs mb-1">
                    <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full capitalize border border-purple-100">
                      {selectedStory.category}
                    </span>
                    <span className="bg-pink-50 text-pink-700 px-3 py-1 rounded-full capitalize border border-pink-100">
                      {selectedStory.age_group}
                    </span>
                  </div>
                  <p className="text-[11px] text-white">
                    Created:{" "}
                    {new Date(selectedStory.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="prose max-w-none text-sm text-white leading-relaxed text-justify">
                  {selectedStory.content.split("\n\n").map((p, idx) => (
                    <p key={idx} className="mb-3">
                      {p}
                    </p>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => deleteStory(selectedStory.story_id)}
                    className="px-3.5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center space-x-1.5 text-xs font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Story</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-2xl shadow-soft p-6 h-64 flex flex-col items-center justify-center text-slate-400 text-sm border border-slate-100">
                <Eye className="w-12 h-12 mb-3" />
                <p>Click on a story to view it.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ---------------------- MAIN APP ----------------------
function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [showResetModal, setShowResetModal] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [pageAnimationKey, setPageAnimationKey] = useState(0);

  useEffect(() => {
    if (token) setCurrentPage("dashboard");
  }, [token]);

  const handleLogin = (newToken, loginUser) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
    setUser(loginUser || null);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setCurrentPage("login");
    setShowLogoutPopup(true);
    setToast({ message: "Logged Out Successfully", type: "success" });
    setTimeout(() => setShowLogoutPopup(false), 1500);
  };

  const showSuccessAnimation = () => {
    setPageAnimationKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen">
      {/* Top Navbar */}
      {token && (
        <nav className="bg-white/90 backdrop-blur-lg shadow-sm border-b border-slate-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-14">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/30">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  StoryTeller
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setCurrentPage("dashboard")}
                  className={`hidden sm:inline-flex px-3 py-1.5 rounded-full text-sm transition ${
                    currentPage === "dashboard"
                      ? "bg-purple-100 text-purple-700"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Create Story
                </button>
                <button
                  onClick={() => setCurrentPage("myStories")}
                  className={`hidden sm:inline-flex px-3 py-1.5 rounded-full text-sm transition ${
                    currentPage === "myStories"
                      ? "bg-purple-100 text-purple-700"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  My Stories
                </button>
                {/* Mobile buttons */}
                <div className="sm:hidden flex items-center space-x-1">
                  <button
                    onClick={() => setCurrentPage("dashboard")}
                    className={`px-2.5 py-1 rounded-full text-xs transition ${
                      currentPage === "dashboard"
                        ? "bg-purple-100 text-purple-700"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setCurrentPage("myStories")}
                    className={`px-2.5 py-1 rounded-full text-xs transition ${
                      currentPage === "myStories"
                        ? "bg-purple-100 text-purple-700"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    Library
                  </button>
                </div>
                <ProfileDropdown
                  user={user}
                  onLogoutClick={handleLogout}
                  onResetPasswordClick={() => setShowResetModal(true)}
                />
              </div>
            </div>
          </div>
        </nav>
      )}

      <AnimatePresence mode="wait">
        {!token && currentPage === "login" && (
          <LoginPage
            key="login"
            onLogin={handleLogin}
            onSwitch={() => setCurrentPage("signup")}
            showSuccessAnimation={showSuccessAnimation}
          />
        )}
        {!token && currentPage === "signup" && (
          <SignupPage key="signup" onSwitch={() => setCurrentPage("login")} />
        )}
        {token && currentPage === "dashboard" && (
          <Dashboard key={`dashboard-${pageAnimationKey}`} token={token} />
        )}
        {token && currentPage === "myStories" && (
          <MyStories key="mystories" token={token} />
        )}
      </AnimatePresence>

      <ResetPasswordModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        token={token}
        onSuccess={() =>
          setToast({
            message: "Password updated successfully!",
            type: "success",
          })
        }
      />

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, message: "" })}
      />

      {showLogoutPopup && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-slate-100 px-4 py-2 rounded-full text-xs shadow-lg shadow-black/40"
          >
            Logged out successfully
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

export default App;
