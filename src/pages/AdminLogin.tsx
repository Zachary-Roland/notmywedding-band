import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useAuthContext } from "../context/AuthContext";

export default function AdminLogin() {
  const { login, user } = useAuthContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/admin", { replace: true });
    } catch {
      setError("Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-bold font-heading">admin login</h1>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div>
          <label htmlFor="email" className="block text-sm text-ink-muted mb-1">email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-transparent border border-ink-faint rounded px-3 py-2 text-ink focus:outline-none focus:border-ink"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm text-ink-muted mb-1">password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-transparent border border-ink-faint rounded px-3 py-2 text-ink focus:outline-none focus:border-ink"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full border border-ink text-ink py-2 rounded hover:bg-ink hover:text-cream transition-colors disabled:opacity-50"
        >
          {submitting ? "logging in..." : "login"}
        </button>

        {message && <p className="text-accent-sage text-sm">{message}</p>}

        <button
          type="button"
          onClick={async () => {
            if (!email) { setError("Enter your email first."); return; }
            if (!auth) return;
            setError("");
            setMessage("");
            try {
              await sendPasswordResetEmail(auth, email);
              setMessage("Password reset email sent.");
            } catch {
              setError("Failed to send reset email.");
            }
          }}
          className="text-sm text-ink-muted hover:text-ink transition-colors"
        >
          forgot password?
        </button>
      </form>
    </div>
  );
}
