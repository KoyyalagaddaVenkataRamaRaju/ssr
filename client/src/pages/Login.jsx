import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const response = await login(formData.email, formData.password);

      if (response.success && response.user) {
        navigate(`/${response.user.role}/dashboard`);
      }
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* ===========================
          ⭐ NEW 5-STAR UI STYLING
      ============================ */}
      <style>{`
        body {
          background: #ffffff;
        }

        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 50px 20px;
          background: #ffffff;
        }

        .login-container {
          width: 100%;
          max-width: 480px;
          background: #ffffff;
          border-radius: 18px;
          padding: 40px 35px;
          box-shadow: 
            0 4px 10px rgba(0,0,0,0.08),
            0 10px 25px rgba(122,84,177,0.18);
          animation: popIn 0.6s ease;
          border: 1px solid #f1e9ff;
        }

        @keyframes popIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .login-header {
          text-align: center;
          margin-bottom: 25px;
        }

        .logo-icon {
          color: #7A54B1;
        }

        .login-title {
          font-size: 28px;
          font-weight: 700;
          color: #333;
          margin-top: 12px;
        }

        .login-tagline {
          font-size: 14px;
          color: #666;
        }

        .form-label {
          font-weight: 600;
          margin-bottom: 6px;
          color: #444;
        }

        .form-input {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #ccc;
          transition: 0.3s ease;
          background: #fafafa;
        }

        .form-input:focus {
          border-color: #7A54B1;
          background: #fff;
          box-shadow: 0 0 6px rgba(122,84,177,0.3);
        }

        .form-input.error {
          border-color: #ff5b5b;
        }

        .error-message {
          color: #ff4c4c;
          font-size: 14px;
          margin-top: -5px;
          margin-bottom: 10px;
        }

        .remember-me label {
          color: #444;
        }

        .forgot-password {
          font-size: 14px;
          color: #7A54B1;
          text-decoration: none;
        }
        .forgot-password:hover {
          text-decoration: underline;
        }

        .login-button {
          width: 100%;
          padding: 12px;
          margin-top: 15px;
          border-radius: 8px;
          background: #7A54B1;
          border: none;
          color: white;
          font-size: 16px;
          font-weight: 600;
          transition: 0.3s;
        }

        .login-button:hover {
          background: #643e94;
        }

        .btn-loading {
          opacity: 0.8;
          cursor: wait;
        }

        .password-toggle {
          color: #7A54B1;
        }

        @media(max-width: 480px) {
          .login-container {
            padding: 30px 25px;
          }
          .login-title {
            font-size: 24px;
          }
        }
      `}</style>

      {/* ===================
          LOGIN UI
      =================== */}
      <div className="login-page">
        <div className="login-container">
          <div className="login-header">
            <GraduationCap className="logo-icon" size={60} />
            <h1 className="login-title">College Management Portal</h1>
            <p className="login-tagline">
              Secure access for Students, Teachers, and Staff.
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div className="form-group mb-3">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`form-input ${error ? "error" : ""}`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* PASSWORD */}
            <div className="form-group mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className={`form-input ${error ? "error" : ""}`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="password-toggle"
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <p className="error-message">{error}</p>}

            {/* REMEMBER + FORGOT */}
            <div className="form-footer d-flex justify-content-between mb-2">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember">Remember Me</label>
              </div>

              <a href="/forgot-password" className="forgot-password">
                Forgot Password?
              </a>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className={`login-button ${loading ? "btn-loading" : ""}`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Login;
