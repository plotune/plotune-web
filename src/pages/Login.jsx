import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  // Extract token from URL (OAuth callback)
  const extractTokenFromLocation = () => {
    // 1) Normal query string: ?token=...
    const queryParams = new URLSearchParams(window.location.search);
    let token = queryParams.get('token');
    if (token) {
      // Remove token from URL
      const clean = window.location.origin + window.location.pathname + window.location.hash.split('?')[0];
      window.history.replaceState({}, document.title, clean);
      return token;
    }

    // 2) HashRouter case
    const hash = window.location.hash || '';
    const qIdx = hash.indexOf('?');
    if (qIdx !== -1) {
      const qs = hash.slice(qIdx + 1);
      const params = new URLSearchParams(qs);
      token = params.get('token');
      if (token) {
        const cleanHash = hash.slice(0, qIdx);
        const clean = window.location.origin + window.location.pathname + cleanHash;
        window.history.replaceState({}, document.title, clean);
        return token;
      }
    }

    return null;
  };

  useEffect(() => {
    const token = extractTokenFromLocation();
    if (token) handleOAuthLogin(token);
  }, [location.key]);

  // OAuth login with token
  const handleOAuthLogin = async (rawToken) => {
    setIsSubmitting(true);
    try {
      // Normalize token format
      const bearer = rawToken.startsWith('Bearer ') ? rawToken : `Bearer ${rawToken}`;

      const userResponse = await api.post('/auth/validate', {}, {
        headers: { Authorization: bearer }
      });
      const user = userResponse.data;

      // Use AuthContext login (will handle cookie storage)
      login(bearer, user, rememberMe);

      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('OAuth login failed:', err);
      toast.error(humanLoginError(err));
      setIsSubmitting(false);
    }
  };

  // Postel/Tesler: never show raw backend detail to users — map the known cases to
  // human copy and keep the raw payload in the console for diagnostics.
  const humanLoginError = (err) => {
    const detail = err?.response?.data?.detail;
    const raw = typeof detail === 'string' ? detail.toLowerCase() : '';
    if (
      raw.includes('incorrect') || raw.includes('invalid') ||
      raw.includes('credential') || raw.includes('password') ||
      raw.includes('not found') || raw.includes('user')
    ) {
      return 'Incorrect username or password. Please try again.';
    }
    return "We couldn't log you in right now. Please try again in a moment.";
  };

  // Form validation: a login form checks that fields are filled — the server
  // decides whether the credentials are correct (a length rule here would block
  // users with legacy passwords and make them doubt their own input).
  const validateField = (name) => {
    const newErrors = { ...errors };
    if (name === 'usernameOrEmail') {
      if (!usernameOrEmail) {
        newErrors.usernameOrEmail = 'Username or email is required';
      } else if (usernameOrEmail.includes('@') && !usernameOrEmail.match(/^\S+@\S+\.\S+$/)) {
        newErrors.usernameOrEmail = 'That email address looks incomplete';
      } else {
        delete newErrors.usernameOrEmail;
      }
    }
    if (name === 'password') {
      if (!password) {
        newErrors.password = 'Password is required';
      } else {
        delete newErrors.password;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validate = () => {
    const newErrors = {};
    if (!usernameOrEmail) {
      newErrors.usernameOrEmail = 'Username or email is required';
    } else if (usernameOrEmail.includes('@') && !usernameOrEmail.match(/^\S+@\S+\.\S+$/)) {
      newErrors.usernameOrEmail = 'That email address looks incomplete';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Normal form login
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await api.post('/login', {
        username_or_email: usernameOrEmail,
        password,
      });
      const { access_token, token_type } = response.data;
      const newToken = `${token_type} ${access_token}`;

      const userResponse = await api.post('/auth/validate', {}, {
        headers: { Authorization: newToken },
      });
      const newUser = userResponse.data;

      // Use AuthContext login (will handle cookie storage)
      login(newToken, newUser, rememberMe);

      toast.success('Login successful');
      navigate('/dashboard');
    } catch (err) {
      console.error('Error response:', err.response?.data);
      toast.error(humanLoginError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // GitHub OAuth
  const startGitHubLogin = async () => {
    try {
      const res = await api.get('/login/github');
      window.location.href = res.data.auth_url;
    } catch (err) {
      toast.error('GitHub login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-gray-900 flex items-center justify-center py-8 px-4">
      <div className="bg-dark-card rounded-2xl p-8 border border-white/10 shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-light-text mb-2 text-center">Login to Plotune</h1>
        <p className="text-gray-text text-center mb-8">Access your account to continue</p>

        {/* Zeigarnik/Jakob: explain why the user landed here after a session expiry
            instead of teleporting them to an unexplained blank form. */}
        {new URLSearchParams(window.location.search).get('expired') && (
          <div
            className="mb-6 rounded-lg border border-primary/30 bg-primary/10 p-4 text-sm text-dark-text"
            role="status"
          >
            Your session has expired. Please log in again to continue.
          </div>
        )}

        {/* Loading State (OAuth) */}
        {isSubmitting && (
          <div className="flex justify-center mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Normal Form */}
        {!isSubmitting && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-username" className="block text-gray-text mb-2 text-sm font-medium">Username or Email</label>
              <input
                id="login-username"
                type="text"
                autoComplete="username"
                value={usernameOrEmail}
                onChange={(e) => {
                  setUsernameOrEmail(e.target.value);
                  if (errors.usernameOrEmail) {
                    setErrors({ ...errors, usernameOrEmail: '' });
                  }
                }}
                onBlur={() => validateField('usernameOrEmail')}
                className={`w-full p-3 bg-dark-surface backdrop-blur-xl rounded-lg border text-light-text focus:ring-2 focus:ring-primary/20 transition ${
                  errors.usernameOrEmail ? 'border-red-500' : 'border-white/10 focus:border-primary'
                }`}
                placeholder="Enter your username or email"
              />
              {errors.usernameOrEmail && (
                <p className="text-red-400 text-xs mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.usernameOrEmail}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="login-password" className="block text-gray-text mb-2 text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors({ ...errors, password: '' });
                    }
                  }}
                  onBlur={() => validateField('password')}
                  className={`w-full p-3 bg-dark-surface backdrop-blur-xl rounded-lg border text-light-text focus:ring-2 focus:ring-primary/20 transition pr-10 ${
                    errors.password ? 'border-red-500' : 'border-white/10 focus:border-primary'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center w-11 text-gray-text hover:text-light-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between mb-6">
              <label className="flex min-h-[44px] items-center py-2 text-gray-text text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/30"
                />
                <span className="ml-2">Remember me</span>
              </label>
              <Link to="/reset-password" className="text-primary hover:underline text-sm">Forgot password?</Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all duration-300 font-medium flex items-center justify-center disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>
        )}

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="mx-4 text-gray-text text-sm">Or continue with</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            disabled
            className="py-2.5 px-4 bg-dark-surface backdrop-blur-xl border border-white/10 rounded-lg text-light-text opacity-50 cursor-not-allowed flex items-center justify-center"
            title="Google login is not available yet"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              {/* Google SVG icon */}
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
            <span className="ml-1.5 rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-text">Soon</span>
          </button>

          <button
            onClick={startGitHubLogin}
            disabled={isSubmitting}
            className="py-2.5 px-4 bg-dark-surface backdrop-blur-xl border border-white/10 rounded-lg text-light-text hover:bg-white/5 transition flex items-center justify-center disabled:opacity-70"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </button>
        </div>

        <p className="mt-6 text-center text-gray-text text-sm">
          Don't have an account? <Link to="/register" className="text-primary hover:underline font-medium">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;