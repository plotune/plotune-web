import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const ForgotPassword = () => {
  const [step, setStep] = useState('email'); // 'email', 'code', 'reset'
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();

  // Countdown timer
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && step === 'code') {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, step]);

  // Password strength checker
  const passwordStrength = () => {
    let score = 0;
    const requirements = {
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      special: /[^A-Za-z0-9]/.test(newPassword),
    };

    Object.values(requirements).forEach(met => {
      if (met) score++;
    });

    let strength = 'Very Weak';
    if (score >= 4) strength = 'Strong';
    else if (score >= 3) strength = 'Good';
    else if (score >= 2) strength = 'Weak';

    return { score, strength, requirements };
  };

  const getPasswordStrengthColor = () => {
    const { score } = passwordStrength();
    if (score >= 4) return 'bg-green-500';
    if (score >= 3) return 'bg-yellow-500';
    if (score >= 2) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Validation functions
  const validateEmail = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!email.match(/^\S+@\S+\.\S+$/)) {
      newErrors.email = 'Invalid email format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCode = () => {
    const newErrors = {};
    if (!code) {
      newErrors.code = 'Verification code is required';
    } else if (!code.match(/^\d{9}$/)) {
      newErrors.code = 'Code must be 9 digits';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    const { score } = passwordStrength();

    if (!newPassword) {
      newErrors.newPassword = 'Password is required';
    } else if (score < 3) {
      newErrors.newPassword = 'Password is too weak';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 1: Request password reset code
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setIsSubmitting(true);
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('Reset code sent to your email');
      setStep('code');
      setCountdown(600); // 10 minutes
      setCanResend(false);
    } catch (err) {
      // Don't reveal if email exists or not
      toast.success('If the email exists, a reset code has been sent');
      setStep('code');
      setCountdown(600);
      setCanResend(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Verify code
  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    if (!validateCode()) return;

    setIsSubmitting(true);
    try {
      await api.post('/auth/verify-reset-code', { email, code });
      setStep('reset');
      toast.success('Code verified successfully');
    } catch (err) {
      toast.error(getCodeErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 3: Reset password
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setIsSubmitting(true);
    try {
      await api.post('/auth/reset-password', {
        email,
        code,
        new_password: newPassword,
      });
      toast.success('Password reset successfully');
      navigate('/login');
    } catch (err) {
      toast.error(getCodeErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend code
  const handleResendCode = async () => {
    if (!canResend) return;

    setIsSubmitting(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setCountdown(600);
      setCanResend(false);
      toast.success('New code sent to your email');
    } catch (err) {
      toast.success('If the email exists, a new code has been sent');
      setCountdown(600);
      setCanResend(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Map backend errors to human-friendly messages; never render raw backend strings
  const getCodeErrorMessage = (err) => {
    console.error('Password reset step failed:', err);
    const detail = err?.response?.data?.detail;
    const text = typeof detail === 'string' ? detail.toLowerCase() : '';
    if (text.includes('expired')) {
      return 'This code has expired. Request a new one and try again.';
    }
    if (text.includes('invalid') || text.includes('incorrect')) {
      return "That code doesn't match. Check the code in your email and try again.";
    }
    return "We couldn't reset your password right now. Please try again.";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-gray-900 flex items-center justify-center py-8 px-4">
      <div className="bg-dark-card rounded-2xl p-8 border border-white/10 shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-primary/20">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-light-text mb-2">
            {step === 'email' && 'Reset Password'}
            {step === 'code' && 'Enter Verification Code'}
            {step === 'reset' && 'Create New Password'}
          </h1>
          
          <p className="text-gray-text">
            {step === 'email' && 'Enter your email to receive a reset code'}
            {step === 'code' && 'Enter the 9-digit code sent to your email'}
            {step === 'reset' && 'Create a new strong password for your account'}
          </p>

          <div className="mt-3 flex items-center justify-center gap-2 text-xs">
            <span className={step === 'email' ? 'text-primary font-semibold' : 'text-gray-text'}>1. Email</span>
            <span className="text-gray-text" aria-hidden="true">→</span>
            <span className={step === 'code' ? 'text-primary font-semibold' : 'text-gray-text'}>2. Code</span>
            <span className="text-gray-text" aria-hidden="true">→</span>
            <span className={step === 'reset' ? 'text-primary font-semibold' : 'text-gray-text'}>3. New password</span>
          </div>
        </div>

        {/* Step 1: Email Input */}
        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-text mb-2 text-sm font-medium">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors({ ...errors, email: '' });
                  }
                }}
                onBlur={validateEmail}
                className={`w-full p-3 bg-dark-surface backdrop-blur-xl rounded-lg border text-light-text focus:ring-2 focus:ring-primary/20 transition ${
                  errors.email ? 'border-red-500' : 'border-white/10 focus:border-primary'
                }`}
                placeholder="Enter your email address"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </p>
              )}
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
                  Sending Code...
                </>
              ) : (
                'Send Reset Code'
              )}
            </button>

            <div className="text-center">
              <Link to="/login" className="text-primary hover:underline text-sm">
                Back to Login
              </Link>
            </div>
          </form>
        )}

        {/* Step 2: Code Verification */}
        {step === 'code' && (
          <form onSubmit={handleCodeSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-text mb-2 text-sm font-medium">Verification Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  // Only allow numbers and limit to 9 digits
                  const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                  setCode(value);
                  if (errors.code) {
                    setErrors({ ...errors, code: '' });
                  }
                }}
                onBlur={validateCode}
                className={`w-full p-3 bg-dark-surface backdrop-blur-xl rounded-lg border text-light-text focus:ring-2 focus:ring-primary/20 transition text-center text-xl tracking-widest ${
                  errors.code ? 'border-red-500' : 'border-white/10 focus:border-primary'
                }`}
                placeholder="000000000"
                maxLength={9}
                autoComplete="one-time-code"
              />
              {errors.code && (
                <p className="text-red-400 text-xs mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.code}
                </p>
              )}
            </div>

            <div className="text-center">
              <p className="text-gray-text text-sm">
                Code expires in: <span className={countdown < 60 ? 'text-red-400 font-medium' : 'text-yellow-400'}>{formatTime(countdown)}</span>
              </p>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={!canResend || isSubmitting}
                className="inline-flex min-h-[44px] items-center text-primary hover:underline text-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isSubmitting ? 'Sending...' : 'Resend Code'}
              </button>
              {!canResend && countdown > 0 && (
                <p className="text-gray-text text-xs mt-1">
                  You can resend in {formatTime(countdown)}.
                </p>
              )}
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
                  Verifying...
                </>
              ) : (
                'Verify Code'
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep('email')}
                className="text-primary hover:underline text-sm"
              >
                Use different email
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Password Reset */}
        {step === 'reset' && (
          <form onSubmit={handlePasswordReset} className="space-y-5">
            <div>
              <label className="block text-gray-text mb-2 text-sm font-medium">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (errors.newPassword) {
                      setErrors({ ...errors, newPassword: '' });
                    }
                  }}
                  onBlur={validatePassword}
                  className={`w-full p-3 bg-dark-surface backdrop-blur-xl rounded-lg border text-light-text focus:ring-2 focus:ring-primary/20 transition pr-10 ${
                    errors.newPassword ? 'border-red-500' : 'border-white/10 focus:border-primary'
                  }`}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
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
              {errors.newPassword && (
                <p className="text-red-400 text-xs mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.newPassword}
                </p>
              )}
              
              {newPassword.length > 0 && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-text mb-1">
                    <span>Password strength: {passwordStrength().strength}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${getPasswordStrengthColor()}`}
                      style={{ width: `${(passwordStrength().score / 5) * 100}%` }}
                    ></div>
                  </div>
                  <ul className="text-xs text-gray-text mt-2 space-y-1">
                    <li className={passwordStrength().requirements.length ? 'text-green-400' : ''}>
                      {passwordStrength().requirements.length ? '✓' : '•'} At least 8 characters
                    </li>
                    <li className={passwordStrength().requirements.uppercase ? 'text-green-400' : ''}>
                      {passwordStrength().requirements.uppercase ? '✓' : '•'} Uppercase letter
                    </li>
                    <li className={passwordStrength().requirements.lowercase ? 'text-green-400' : ''}>
                      {passwordStrength().requirements.lowercase ? '✓' : '•'} Lowercase letter
                    </li>
                    <li className={passwordStrength().requirements.number ? 'text-green-400' : ''}>
                      {passwordStrength().requirements.number ? '✓' : '•'} Number
                    </li>
                    <li className={passwordStrength().requirements.special ? 'text-green-400' : ''}>
                      {passwordStrength().requirements.special ? '✓' : '•'} Special character
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-text mb-2 text-sm font-medium">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) {
                      setErrors({ ...errors, confirmPassword: '' });
                    }
                  }}
                  onBlur={validatePassword}
                  className={`w-full p-3 bg-dark-surface backdrop-blur-xl rounded-lg border text-light-text focus:ring-2 focus:ring-primary/20 transition pr-10 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-white/10 focus:border-primary'
                  }`}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
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
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.confirmPassword}
                </p>
              )}
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
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </button>

            <div className="text-center">
              <Link to="/login" className="text-primary hover:underline text-sm">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;