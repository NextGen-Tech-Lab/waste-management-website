import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/useAuth.js';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [activeForm, setActiveForm] = useState('citizen');
  const [citizenData, setCitizenData] = useState({ email: '', password: '' });
  const [adminData, setAdminData] = useState({ email: '', password: '' });
  const [citizenError, setCitizenError] = useState('');
  const [adminError, setAdminError] = useState('');
  const [loadingRole, setLoadingRole] = useState('');

  const setLoading = (role, value) => {
    setLoadingRole(value ? role : '');
  };

  const handleCitizenChange = (e) => {
    const { name, value } = e.target;
    setCitizenData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCitizenLogin = async (e) => {
    e.preventDefault();
    setCitizenError('');
    setAdminError('');
    setLoading('citizen', true);

    try {
      await login(citizenData.email, citizenData.password);
      navigate('/user/dashboard');
    } catch (err) {
      setCitizenError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading('citizen', false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setCitizenError('');
    setAdminError('');
    setLoading('admin', true);

    try {
      const authResult = await login(adminData.email, adminData.password);
      const isAdmin = authResult?.user?.role === 'admin';
      if (!isAdmin) {
        setAdminError('This account does not have admin access.');
        return;
      }
      navigate('/admin/dashboard');
    } catch (err) {
      setAdminError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading('admin', false);
    }
  };

  const loginError = activeForm === 'citizen' ? citizenError : adminError;
  const isLoading = loadingRole === activeForm;

  return (
    <div className="login-page">
      <header className="login-header">
        <div className="brand">
          <span className="material-symbols-outlined" style={{ color: '#1b5e20', fontSize: '30px' }}>
            public
          </span>
          <div>
            <div className="brand-title">EcoManage India</div>
            <div className="brand-subtitle">Public Waste Management Portal</div>
          </div>
        </div>
        <nav className="top-nav-links">
          <a href="#">Schemes</a>
          <a href="#">Impact</a>
          <a href="#">Resources</a>
          <button type="button">Sign Up</button>
        </nav>
      </header>

      <main className="login-main">
        <section className="hero">
          <h1>
            Cleaner Cities, <br />
            <span>Sustainable Tomorrow.</span>
          </h1>
          <p>
            Supporting local bodies and citizens for cleaner cities through technology-driven waste monitoring and
            policy frameworks.
          </p>
        </section>

        <section className="single-login-shell">
          <div className="toggle-bar">
            <button
              type="button"
              className={activeForm === 'citizen' ? 'toggle-btn active' : 'toggle-btn'}
              onClick={() => {
                setActiveForm('citizen');
                setCitizenError('');
                setAdminError('');
              }}
            >
              Citizen
            </button>
            <button
              type="button"
              className={activeForm === 'admin' ? 'toggle-btn active' : 'toggle-btn'}
              onClick={() => {
                setActiveForm('admin');
                setCitizenError('');
                setAdminError('');
              }}
            >
              Admin
            </button>
          </div>

          {activeForm === 'citizen' ? (
            <form className="single-form" onSubmit={handleCitizenLogin}>
              <div className="form-group">
                <label htmlFor="citizenEmail">Email Address</label>
                <input
                  id="citizenEmail"
                  name="email"
                  type="email"
                  value={citizenData.email}
                  onChange={handleCitizenChange}
                  placeholder="citizen@example.com"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="citizenPass">Password</label>
                <input
                  id="citizenPass"
                  name="password"
                  type="password"
                  value={citizenData.password}
                  onChange={handleCitizenChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              {loginError && <div className="error-box">{loginError}</div>}

              <button className="login-btn citizen" type="submit" disabled={isLoading}>
                {isLoading ? 'Authenticating...' : 'Sign In'}
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  arrow_forward
                </span>
              </button>

              <div className="inline-action-row">
                <a
                  className="register-link"
                  href="/register"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/register');
                  }}
                >
                  New citizen? Register here
                </a>
              </div>
            </form>
          ) : (
            <form className="single-form" onSubmit={handleAdminLogin}>
              <div className="form-group">
                <label htmlFor="adminEmail">Official Email</label>
                <input
                  id="adminEmail"
                  name="email"
                  type="email"
                  value={adminData.email}
                  onChange={handleAdminChange}
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="adminPass">Security Code</label>
                <input
                  id="adminPass"
                  name="password"
                  type="password"
                  value={adminData.password}
                  onChange={handleAdminChange}
                  placeholder="••••"
                  required
                />
              </div>

              {loginError && <div className="error-box">{loginError}</div>}

              <button className="login-btn admin" type="submit" disabled={isLoading}>
                {isLoading ? 'Authenticating...' : 'Secure Access'}
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  lock
                </span>
              </button>

              <div className="inline-action-row">
                <a className="register-link muted" href="#" onClick={(e) => e.preventDefault()}>
                  Forgot security credentials?
                </a>
              </div>
            </form>
          )}
        </section>
      </main>

      <footer className="login-footer">
        <div className="footer-inner">
          <div>
            <div className="footer-brand">EcoManage India</div>
            <p className="footer-copy">
              © 2026 EcoManage India. A Ministry of Housing and Urban Affairs Initiative.
            </p>
          </div>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Accessibility</a>
            <a href="#">Sitemap</a>
            <a href="#">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
