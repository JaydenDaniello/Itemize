"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/auth/client";

type RegisterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
};

export default function RegisterModal({
  isOpen,
  onClose,
  onSwitchToLogin,
}: RegisterModalProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setShowPassword(false);
      setShowConfirmPassword(false);
      setError("");
      setLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> =
    async (e) => {
      e.preventDefault();
      setError("");

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      setLoading(true);

      try {
        await registerUser({ email, password });

        onClose();
        router.push("/home");
        router.refresh();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Registration failed"
        );
      } finally {
        setLoading(false);
      }
    };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Get Started
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Create your Itemize account.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close registration modal"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="register-email"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-emerald-500"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="register-password"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <div className="flex gap-2">
              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div>
            <label
              htmlFor="register-confirm-password"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Confirm password
            </label>
            <div className="flex gap-2">
              <input
                id="register-confirm-password"
                type={
                  showConfirmPassword ? "text" : "password"
                }
                autoComplete="new-password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword((prev) => !prev)
                }
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Error */}
          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Get Started"}
          </button>

          {/* Switch to login */}
          {onSwitchToLogin ? (
            <p className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="font-medium text-emerald-600 hover:underline"
              >
                Sign in
              </button>
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}