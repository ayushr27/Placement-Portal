import React, { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { API_URL } from "../../env-config";

/**
 * Three-step password reset modal, matching the backend flow:
 *   1. POST /api/auth/forgot-password/request  { email }        -> emails a 6-digit OTP
 *   2. POST /api/auth/forgot-password/verify   { email, otp }   -> { reset_token }
 *   3. POST /api/auth/forgot-password/reset    { token, new_password }
 *
 * The "Forgot Password?" text on both login pages was previously a plain <p>
 * with no handler, so this flow had no entry point at all.
 */
const STEPS = { EMAIL: 1, OTP: 2, PASSWORD: 3 };

export default function ForgotPassword({ open, onClose }) {
  const [step, setStep] = useState(STEPS.EMAIL);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const reset = () => {
    setStep(STEPS.EMAIL);
    setEmail("");
    setOtp("");
    setResetToken("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setLoading(false);
  };

  const close = () => {
    reset();
    onClose();
  };

  /** POST JSON and surface the API's `detail` message on failure. */
  const post = async (path, body) => {
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    let data = null;
    try {
      data = await res.json();
    } catch {
      // Non-JSON error page (gateway timeout, etc.)
    }

    if (!res.ok) {
      const detail = data?.detail;
      throw new Error(
        typeof detail === "string"
          ? detail
          : "Something went wrong. Please try again.",
      );
    }
    return data;
  };

  const submitEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await post("/api/auth/forgot-password/request", {
        email: email.trim().toLowerCase(),
      });
      toast.success("If that account exists, a code has been sent.");
      setStep(STEPS.OTP);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await post("/api/auth/forgot-password/verify", {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      });
      setResetToken(data.reset_token);
      toast.success("Code verified.");
      setStep(STEPS.PASSWORD);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await post("/api/auth/forgot-password/reset", {
        token: resetToken,
        new_password: newPassword,
      });
      toast.success("Password updated. You can sign in now.");
      close();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-black";
  const buttonClass =
    "w-full text-white py-2.5 rounded-lg transition-all duration-300 " +
    (loading ? "bg-gray-500 cursor-not-allowed" : "bg-[#181204] hover:bg-black");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="forgot-password-title"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-4 top-4 text-gray-400 hover:text-black"
        >
          <X size={20} />
        </button>

        <h2 id="forgot-password-title" className="mb-1 text-xl font-semibold">
          Reset your password
        </h2>
        <p className="mb-5 text-sm text-gray-500">Step {step} of 3</p>

        {step === STEPS.EMAIL && (
          <form onSubmit={submitEmail} className="flex flex-col gap-4">
            <label className="text-sm text-gray-700">
              Registered email
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`mt-1 ${inputClass}`}
              />
            </label>
            <button type="submit" disabled={loading} className={buttonClass}>
              {loading ? "Sending..." : "Send code"}
            </button>
          </form>
        )}

        {step === STEPS.OTP && (
          <form onSubmit={submitOtp} className="flex flex-col gap-4">
            <p className="text-sm text-gray-600">
              Enter the 6-digit code sent to <strong>{email}</strong>. It expires
              in 10 minutes.
            </p>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              autoFocus
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              className={`${inputClass} tracking-[0.4em] text-center text-lg`}
            />
            <button type="submit" disabled={loading} className={buttonClass}>
              {loading ? "Verifying..." : "Verify code"}
            </button>
            <button
              type="button"
              onClick={() => setStep(STEPS.EMAIL)}
              className="text-sm text-gray-500 hover:text-black"
            >
              Use a different email
            </button>
          </form>
        )}

        {step === STEPS.PASSWORD && (
          <form onSubmit={submitPassword} className="flex flex-col gap-4">
            <label className="text-sm text-gray-700">
              New password
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoFocus
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-2 text-gray-500 hover:text-black"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </label>
            <label className="text-sm text-gray-700">
              Confirm new password
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`mt-1 ${inputClass}`}
              />
            </label>
            <button type="submit" disabled={loading} className={buttonClass}>
              {loading ? "Updating..." : "Update password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
