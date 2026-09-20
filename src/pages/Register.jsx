import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    sector: '',
    country: '',
    company: '',
    fullName: '',
  });
  const [newsletter, setNewsletter] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const passwordStrength = () => {
    if (password.length === 0) return { strength: 'None', score: 0 };
    if (password.length < 8) return { strength: 'Weak', score: 1 };
    
    let score = 0;
    // Length contributes to score
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Check for uppercase letters
    if (/[A-Z]/.test(password)) score++;
    
    // Check for numbers
    if (/[0-9]/.test(password)) score++;
    
    // Check for special characters
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    let strength = 'Weak';
    if (score >= 4) strength = 'Strong';
    else if (score >= 3) strength = 'Medium';
    
    return { strength, score };
  };

  const getPasswordStrengthColor = () => {
    const { score } = passwordStrength();
    if (score <= 2) return 'bg-red-500';
    if (score === 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email.match(/^\S+@\S+\.\S+$/)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.sector) {
      newErrors.sector = 'Sector is required';
    }
    
    if (!formData.country) {
      newErrors.country = 'Country is required';
    }
    
    if (!termsAgreed) {
      newErrors.terms = 'You must agree to the terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate a single field (used on blur) so untouched fields are not flagged
  const validateField = (name) => {
    let error = '';
    switch (name) {
      case 'email':
        if (!formData.email.match(/^\S+@\S+\.\S+$/)) {
          error = 'Invalid email format';
        }
        break;
      case 'username':
        if (formData.username.length < 3) {
          error = 'Username must be at least 3 characters';
        }
        break;
      case 'password':
        if (formData.password.length < 8) {
          error = 'Password must be at least 8 characters';
        }
        break;
      case 'confirmPassword':
        if (formData.password !== formData.confirmPassword) {
          error = 'Passwords do not match';
        }
        break;
      case 'sector':
        if (!formData.sector) {
          error = 'Sector is required';
        }
        break;
      case 'country':
        if (!formData.country) {
          error = 'Country is required';
        }
        break;
      default:
        break;
    }
    setErrors((prev) => {
      const next = { ...prev };
      if (error) {
        next[name] = error;
      } else {
        delete next[name];
      }
      return next;
    });
    return !error;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await api.post('/register', {
        full_name: formData.fullName, // Rename fullName to full_name
        email: formData.email,
        username: formData.username,
        password: formData.password,
        confirm_password: formData.confirmPassword, // Rename confirmPassword to confirm_password
        sector: formData.sector,
        country: formData.country,
        company: formData.company,
        newsletter_subscribed: newsletter, // Rename newsletter to newsletter_subscribed
        agreed_to_terms: termsAgreed, // Include termsAgreed
        mac_address: null // Optional: Include mac_address if needed
      });
      toast.success('Registration successful. Please verify your email.');
      navigate('/verify-email', { state: { email: formData.email } });
    } catch (err) {
      const detail = err.response?.data?.detail;
      console.error('Registration failed:', err);
      if (detail && typeof detail === 'object') {
        // FastAPI field-error payload (dict, or array of {loc, msg} entries):
        // map entries whose key matches a form field into field errors
        const entries = Array.isArray(detail)
          ? detail
              .map((item) => [item?.loc?.[item.loc.length - 1], item?.msg])
              .filter(([key]) => key)
          : Object.entries(detail);
        const fieldKeyMap = { confirm_password: 'confirmPassword', full_name: 'fullName' };
        const fieldErrors = {};
        entries.forEach(([key, value]) => {
          const fieldName = fieldKeyMap[key] || key;
          if (fieldName in formData) {
            fieldErrors[fieldName] = Array.isArray(value) ? value.join(', ') : String(value);
          }
        });
        if (Object.keys(fieldErrors).length > 0) {
          setErrors((prev) => ({ ...prev, ...fieldErrors }));
        } else {
          toast.error('Registration failed. Please try again.');
        }
      } else if (typeof detail === 'string' && detail.trim()) {
        toast.error(detail);
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const { email, username, password, confirmPassword, sector, country, company, fullName } = formData;
  const { strength } = passwordStrength();

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-br from-dark-bg to-gray-900 flex items-center justify-center py-8 px-4">
      <div className="bg-dark-card rounded-2xl p-8 border border-white/10 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-light-text mb-2">Create Account</h1>
          <p className="text-gray-text">Join Plotune to access exclusive features</p>
          <div className="mt-3 flex items-center justify-center gap-2 text-xs">
            <span className="text-primary font-semibold">1. Create account</span>
            <span className="text-gray-text" aria-hidden="true">→</span>
            <span className="text-gray-text">2. Verify email</span>
            <span className="text-gray-text" aria-hidden="true">→</span>
            <span className="text-gray-text">3. Sign in</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-text mb-2 text-sm font-medium">Full Name (Optional)</label>
            <input
              type="text"
              name="fullName"
              value={fullName}
              onChange={handleInputChange}
              className="w-full p-3 bg-dark-surface backdrop-blur-xl rounded-lg border border-white/10 text-light-text focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <label className="block text-gray-text mb-2 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleInputChange}
              onBlur={() => validateField('email')}
              autoComplete="email"
              className={`w-full p-3 bg-dark-surface backdrop-blur-xl rounded-lg border text-light-text focus:ring-2 focus:ring-primary/20 transition ${
                errors.email ? 'border-red-500' : 'border-white/10 focus:border-primary'
              }`}
              placeholder="your.email@example.com"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.email}
            </p>}
          </div>
          
          <div>
            <label className="block text-gray-text mb-2 text-sm font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={handleInputChange}
              onBlur={() => validateField('username')}
              autoComplete="username"
              className={`w-full p-3 bg-dark-surface backdrop-blur-xl rounded-lg border text-light-text focus:ring-2 focus:ring-primary/20 transition ${
                errors.username ? 'border-red-500' : 'border-white/10 focus:border-primary'
              }`}
              placeholder="Choose a username"
            />
            {errors.username && <p className="text-red-400 text-xs mt-1 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.username}
            </p>}
          </div>
          
          <div>
            <label className="block text-gray-text mb-2 text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleInputChange}
                onBlur={() => validateField('password')}
                autoComplete="new-password"
                className={`w-full p-3 bg-dark-surface backdrop-blur-xl rounded-lg border text-light-text focus:ring-2 focus:ring-primary/20 transition pr-10 ${
                  errors.password ? 'border-red-500' : 'border-white/10 focus:border-primary'
                }`}
                placeholder="Create a strong password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-text hover:text-light-text"
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
            {errors.password && <p className="text-red-400 text-xs mt-1 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.password}
            </p>}
            
            {password.length > 0 && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-text mb-1">
                  <span>Password strength: {strength}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${getPasswordStrengthColor()}`}
                    style={{ width: `${(passwordStrength().score / 5) * 100}%` }}
                  ></div>
                </div>
                <ul className="text-xs text-gray-text mt-2 space-y-1">
                  <li className={password.length >= 8 ? 'text-green-400' : ''}>
                    {password.length >= 8 ? '✓' : '•'} At least 8 characters
                  </li>
                  <li className={/[A-Z]/.test(password) ? 'text-green-400' : ''}>
                    {/[A-Z]/.test(password) ? '✓' : '•'} Uppercase letter (optional)
                  </li>
                  <li className={/[0-9]/.test(password) ? 'text-green-400' : ''}>
                    {/[0-9]/.test(password) ? '✓' : '•'} Number (optional)
                  </li>
                  <li className={/[^A-Za-z0-9]/.test(password) ? 'text-green-400' : ''}>
                    {/[^A-Za-z0-9]/.test(password) ? '✓' : '•'} Special character (optional)
                  </li>
                </ul>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-gray-text mb-2 text-sm font-medium">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleInputChange}
                onBlur={() => validateField('confirmPassword')}
                autoComplete="new-password"
                className={`w-full p-3 bg-dark-surface backdrop-blur-xl rounded-lg border text-light-text focus:ring-2 focus:ring-primary/20 transition pr-10 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-white/10 focus:border-primary'
                }`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-text hover:text-light-text"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
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
            {errors.confirmPassword && <p className="text-red-400 text-xs mt-1 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.confirmPassword}
            </p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-text mb-2 text-sm font-medium">Sector</label>
              <select
                name="sector"
                value={sector}
                onChange={handleInputChange}
                onBlur={() => validateField('sector')}
                className={`w-full p-3 bg-dark-surface backdrop-blur-xl rounded-lg border text-light-text focus:ring-2 focus:ring-primary/20 transition ${
                  errors.sector ? 'border-red-500' : 'border-white/10 focus:border-primary'
                }`}
              >
                <option value="">Select sector</option>
                <option value="engineering">Engineering</option>
                <option value="research">Research</option>
                <option value="data-analysis">Data Analysis</option>
                <option value="design">Design</option>
                <option value="education">Education</option>
                <option value="finance">Finance</option>
                <option value="healthcare">Healthcare</option>
                <option value="technology">Technology</option>
              </select>
              {errors.sector && <p className="text-red-400 text-xs mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.sector}
              </p>}
            </div>
            
            <div>
              <label className="block text-gray-text mb-2 text-sm font-medium">Country</label>
              <select
                name="country"
                value={country}
                onChange={handleInputChange}
                onBlur={() => validateField('country')}
                className={`w-full p-3 bg-dark-surface backdrop-blur-xl rounded-lg border text-light-text focus:ring-2 focus:ring-primary/20 transition ${
                  errors.country ? 'border-red-500' : 'border-white/10 focus:border-primary'
                }`}
              >
                <option value="">Select country</option>
                <option value="turkey">Turkey</option>
                <option value="usa">United States</option>
                <option value="uk">United Kingdom</option>
                <option value="germany">Germany</option>
                <option value="france">France</option>
                <option value="canada">Canada</option>
                <option value="australia">Australia</option>
                <option value="japan">Japan</option>
                <option value="other">Other</option>
              </select>
              {errors.country && <p className="text-red-400 text-xs mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.country}
              </p>}
            </div>
          </div>
          
          <div>
            <label className="block text-gray-text mb-2 text-sm font-medium">Company (Optional)</label>
            <input
              type="text"
              name="company"
              value={company}
              onChange={handleInputChange}
              className="w-full p-3 bg-dark-surface backdrop-blur-xl rounded-lg border border-white/10 text-light-text focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              placeholder="Your company name"
            />
          </div>
          
          <label htmlFor="newsletter" className="flex items-start gap-3 py-2 cursor-pointer">
            <input
              id="newsletter"
              type="checkbox"
              checked={newsletter}
              onChange={(e) => setNewsletter(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/30"
            />
            <span className="text-sm text-gray-text">
              Subscribe to our newsletter for updates and offers (optional)
            </span>
          </label>
          
          <label htmlFor="terms" className="flex items-start gap-3 py-2 cursor-pointer">
            <input
              id="terms"
              type="checkbox"
              checked={termsAgreed}
              onChange={(e) => setTermsAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/30"
            />
            <span className="text-sm text-gray-text">
              I agree to the <Link to="/legal" className="text-primary hover:underline font-medium">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline font-medium">Privacy Policy</Link> (GDPR/KVKK compliant)
            </span>
          </label>
          {errors.terms && <p className="text-red-400 text-xs mt-1 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.terms}
          </p>}
          
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
                Processing...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
        
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="mx-4 text-gray-text text-sm">Or continue with</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <button disabled className="py-2.5 px-4 bg-dark-surface backdrop-blur-xl border border-white/10 rounded-lg text-light-text opacity-50 cursor-not-allowed flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button
            onClick={async () => {
              try {
                const res = await api.get('/login/github');
                window.location.href = res.data.auth_url;
              } catch (err) {
                toast.error('GitHub login failed');
              }
            }}
            className="py-2.5 px-4 bg-dark-surface backdrop-blur-xl border border-white/10 rounded-lg text-light-text hover:bg-white/5 transition flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </button>
        </div>
        
        <p className="mt-8 text-center text-gray-text text-sm">
          Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;