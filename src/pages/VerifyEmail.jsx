import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationStatus, setVerificationStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [failureReason, setFailureReason] = useState('');
  const token = searchParams.get('token');
  const email = location.state?.email;

  // Peak-End: success is the peak moment — show a visible countdown the user can
  // read (and a button), instead of yanking them away mid-read with a silent timer.
  useEffect(() => {
    if (verificationStatus !== 'success') return undefined;
    if (countdown <= 0) {
      navigate('/login');
      return undefined;
    }
    const timer = window.setTimeout(() => setCountdown((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [verificationStatus, countdown, navigate]);

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setVerificationStatus('error');
      toast.error('Invalid verification link');
    }
  }, [token]);

  const verifyEmail = async () => {
    setIsSubmitting(true);
    try {
      const response = await api.get(`/auth/verify-email?token=${token}`);
      
      if (response.status === 200) {
        setVerificationStatus('success');
        toast.success('Email verified successfully!');
      }
    } catch (err) {
      console.error('Verification error:', err.response?.data);
      const detail = typeof err.response?.data?.detail === 'string' ? err.response.data.detail.toLowerCase() : '';
      if (detail.includes('expired')) {
        setFailureReason('This verification link has expired.');
      } else if (detail.includes('invalid') || detail.includes('not found')) {
        setFailureReason('This verification link is invalid or has already been used.');
      } else {
        setFailureReason('We couldn\u2019t verify your email address right now.');
      }
      setVerificationStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-gray-900 flex items-center justify-center py-8 px-4">
      <div className="bg-dark-card rounded-2xl p-8 border border-white/10 shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            verificationStatus === 'loading' ? 'bg-blue-500/20' :
            verificationStatus === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}>
            {verificationStatus === 'loading' && (
              <svg className="w-8 h-8 text-blue-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4m0 12v4m8-10h-4M6 12H2m16.364-6.364l-2.828 2.828M7.464 17.536l-2.828 2.828m0-11.312l2.828 2.828m9.072 9.072l2.828 2.828" />
              </svg>
            )}
            {verificationStatus === 'success' && (
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {verificationStatus === 'error' && (
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-light-text mb-2">
            {verificationStatus === 'loading' && 'Verifying Email'}
            {verificationStatus === 'success' && 'Email Verified!'}
            {verificationStatus === 'error' && 'Verification Failed'}
          </h1>
          
          <p className="text-gray-text">
            {verificationStatus === 'loading' && 'Please wait while we verify your email address...'}
            {verificationStatus === 'success' && 'Your email has been successfully verified.'}
            {verificationStatus === 'error' && 'We could not verify your email address.'}
          </p>
        </div>

        {verificationStatus === 'loading' && (
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying your email...
            </div>
          </div>
        )}

        {verificationStatus === 'success' && (
          <div className="space-y-6">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-400 text-sm font-medium">
                  Your email has been successfully verified. Redirecting you to login in {countdown}…
                </span>
              </div>
            </div>
            
            <div className="flex flex-col space-y-3">
              <Link
                to="/login"
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all duration-300 font-medium text-center"
              >
                Go to Login
              </Link>
              <Link
                to="/"
                className="w-full py-3 bg-dark-surface backdrop-blur-xl text-gray-text border border-white/10 rounded-lg hover:border-primary/30 transition-all duration-300 font-medium text-center"
              >
                Back to Home
              </Link>
            </div>
          </div>
        )}

        {verificationStatus === 'error' && (
          <div className="space-y-6">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-400 text-sm font-medium">
                  {failureReason || 'The verification link is invalid or has expired.'}
                  {email && ` We sent the original link to ${email}.`}
                </span>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              {/* Postel (truthful controls): there is no resend endpoint wired up, so the
                  recovery action is an honest prefilled support email — not a button
                  that pretends to resend. */}
              <a
                href={`mailto:support@plotune.net?subject=${encodeURIComponent('Resend verification email')}${email ? `&body=${encodeURIComponent(`Please resend the verification link for: ${email}`)}` : ''}`}
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all duration-300 font-medium text-center"
              >
                Email us to resend the link
              </a>

              <Link
                to="/login"
                className="w-full py-3 bg-dark-surface backdrop-blur-xl text-gray-text border border-white/10 rounded-lg hover:border-primary/30 transition-all duration-300 font-medium text-center"
              >
                Back to Login
              </Link>
            </div>
          </div>
        )}

        {/* Additional help section */}
        {(verificationStatus === 'error') && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-gray-text text-sm text-center">
              Need help?{' '}
              <a href="mailto:support@plotune.net" className="text-primary hover:underline">
                Contact Support
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;