import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Decode a JWT payload without verifying it.
 *
 * The signature is verified server-side on every request; this only reads the
 * `exp` claim so the UI can redirect to login instead of mounting a dashboard
 * whose API calls will all 401.
 */
const readTokenPayload = (token) => {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
};

const isExpired = (token) => {
  const payload = readTokenPayload(token);
  // `exp` is epoch seconds. Treat an unreadable token as expired.
  if (!payload || typeof payload.exp !== "number") return true;
  return payload.exp <= Date.now() / 1000;
};

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const loginPath = allowedRole === "admin" ? "/admin/login" : "/student/login";

  if (!token || isExpired(token)) {
    // Clear the stale session so the login page starts clean.
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    return <Navigate to={loginPath} replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
