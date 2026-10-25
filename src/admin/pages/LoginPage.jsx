import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context";
import "./LoginPage.css";

export function LoginPage() {
  const [secretKey, setSecretKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");

  const { login, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/admin";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!secretKey.trim()) {
      setLocalError("Please enter your Master Secret Key.");
      return;
    }

    setSubmitting(true);
    try {
      await login(secretKey.trim(), rememberMe);
      navigate(from, { replace: true });
    } catch (err) {
      setLocalError(err.message || "Invalid Secret Key.");
    } finally {
      setSubmitting(false);
    }
  };

  const displayedError = localError || authError;

  return (
    <div className="admin-login">
      <div className="admin-login__container">
        <header className="admin-login__header">
          <div className="admin-login__badge">
            <span className="admin-login__badge-dot" /> PRIVATE ADMIN
          </div>
          <h1 className="admin-login__title">Admin Control</h1>
          <p className="admin-login__subtitle">Enter your Master Secret Key to manage your portfolio</p>
        </header>

        {displayedError && (
          <div className="admin-login__alert admin-login__alert--error" role="alert">
            <span>⚠️</span>
            <span>{displayedError}</span>
          </div>
        )}

        <form className="admin-login__form" onSubmit={handleSubmit}>
          <div className="admin-login__field">
            <div className="admin-login__field-header">
              <label htmlFor="master-key">Master Secret Key</label>
              <button
                type="button"
                className="admin-login__toggle-vis"
                onClick={() => setShowKey(!showKey)}
                tabIndex={-1}
              >
                {showKey ? "Hide" : "Show"}
              </button>
            </div>
            <div className="admin-login__input-wrap">
              <input
                id="master-key"
                type={showKey ? "text" : "password"}
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="Enter secret passphrase…"
                required
                autoComplete="current-password"
                autoFocus
              />
            </div>
          </div>

          <div className="admin-login__options">
            <label className="admin-login__checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember session on this device</span>
            </label>
          </div>

          <button type="submit" className="admin-login__button" disabled={submitting}>
            {submitting ? "Verifying Key…" : "Unlock Dashboard →"}
          </button>
        </form>

        <footer className="admin-login__footer">
          <Link to="/">← Return to Public Portfolio</Link>
        </footer>
      </div>
    </div>
  );
}
