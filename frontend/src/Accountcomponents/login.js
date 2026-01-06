// Login.js - Fixed OAuth Configuration
import { useState, useEffect } from "react";

//const API_URL = 'http://localhost:5000/api';
const API_URL = 'http://localhost:8000/api';

// ==================== OAUTH CONFIGURATION ====================
// Replace these with your actual OAuth credentials
const OAUTH_CONFIG = {
  // Google OAuth - Get from: https://console.cloud.google.com/
  GOOGLE_CLIENT_ID: '690088442110-jr21uvljkid15s3tjfqqlk572p4r9g22.apps.googleusercontent.com',
  
  // Facebook OAuth - Get from: https://developers.facebook.com/
  FACEBOOK_APP_ID: '1234567890123456',
  
  // Apple OAuth - Get from: https://developer.apple.com/
  APPLE_CLIENT_ID: 'com.finshield.web'
};

// Check if OAuth is properly configured
const isOAuthConfigured = () => {
  const googleValid = OAUTH_CONFIG.GOOGLE_CLIENT_ID && 
                     !OAUTH_CONFIG.GOOGLE_CLIENT_ID.includes('1234567890');
  const facebookValid = OAUTH_CONFIG.FACEBOOK_APP_ID && 
                       !OAUTH_CONFIG.FACEBOOK_APP_ID.includes('1234567890');
  return { googleValid, facebookValid };
};

// ==================== SDK LOADERS ====================

const loadGoogleScript = () => {
  return new Promise((resolve, reject) => {
    if (window.google) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google SDK'));
    document.body.appendChild(script);
  });
};

const loadFacebookSDK = () => {
  return new Promise((resolve) => {
    if (window.FB) {
      resolve();
      return;
    }
    
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: OAUTH_CONFIG.FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });
      resolve();
    };

    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  });
};

export default function Login({ setCurrentPage }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [oauthReady, setOauthReady] = useState({
    google: false,
    facebook: false
  });

  useEffect(() => {
    const initOAuth = async () => {
      const config = isOAuthConfigured();
      
      // Load Google if configured
      if (config.googleValid) {
        try {
          await loadGoogleScript();
          
          if (window.google) {
            window.google.accounts.id.initialize({
              client_id: OAUTH_CONFIG.GOOGLE_CLIENT_ID,
              callback: handleGoogleResponse,
              auto_select: false
            });
            setOauthReady(prev => ({ ...prev, google: true }));
            console.log('✅ Google OAuth initialized');
          }
        } catch (error) {
          console.error('❌ Google OAuth initialization failed:', error);
        }
      } else {
        console.warn('⚠️ Google OAuth not configured. Add your Client ID to OAUTH_CONFIG.');
      }

      // Load Facebook if configured
      if (config.facebookValid) {
        try {
          await loadFacebookSDK();
          setOauthReady(prev => ({ ...prev, facebook: true }));
          console.log('✅ Facebook OAuth initialized');
        } catch (error) {
          console.error('❌ Facebook OAuth initialization failed:', error);
        }
      } else {
        console.warn('⚠️ Facebook OAuth not configured. Add your App ID to OAUTH_CONFIG.');
      }
    };

    initOAuth();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        localStorage.setItem('finshield_token', data.data.token);
        localStorage.setItem('finshield_user', JSON.stringify(data.data.user));
        alert('Login successful! 🎉');
        // Redirect or update UI
        setCurrentPage('menu')
      } else {
        setIsSubmitting(false);
        alert(`Login failed: ${data.message}`);
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error('Login error:', error);
      alert('Failed to connect to server.');
    }
  };

  // ==================== OAUTH HANDLERS ====================

  const handleGoogleResponse = async (response) => {
    try {
      const result = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential })
      });

      const data = await result.json();

      if (data.status === 'success') {
        localStorage.setItem('finshield_token', data.data.token);
        localStorage.setItem('finshield_user', JSON.stringify(data.data.user));
        alert('Google login successful! 🎉');
        console.log('User:', data.data.user);
      } else {
        alert(`Google login failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Google login error:', error);
      alert('Google login failed. Check console for details.');
    }
  };

  const handleGoogleLogin = () => {
    if (!oauthReady.google) {
      alert('⚠️ Google Sign-In not configured.\n\n1. Get your Client ID from Google Cloud Console\n2. Update OAUTH_CONFIG.GOOGLE_CLIENT_ID in Login.js\n3. Refresh the page');
      return;
    }

    if (window.google) {
      window.google.accounts.id.prompt();
    } else {
      alert('Google Sign-In is still loading. Please try again in a moment.');
    }
  };

  const handleFacebookLogin = () => {
    if (!oauthReady.facebook) {
      alert('⚠️ Facebook Login not configured.\n\n1. Get your App ID from Facebook Developers\n2. Update OAUTH_CONFIG.FACEBOOK_APP_ID in Login.js\n3. Refresh the page');
      return;
    }

    if (!window.FB) {
      alert('Facebook SDK is still loading. Please try again in a moment.');
      return;
    }

    window.FB.login(async (response) => {
      if (response.authResponse) {
        try {
          const result = await fetch(`${API_URL}/auth/facebook`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              accessToken: response.authResponse.accessToken 
            })
          });

          const data = await result.json();

          if (data.status === 'success') {
            localStorage.setItem('finshield_token', data.data.token);
            localStorage.setItem('finshield_user', JSON.stringify(data.data.user));
            alert('Facebook login successful! 🎉');
            console.log('User:', data.data.user);
          } else {
            alert(`Facebook login failed: ${data.message}`);
          }
        } catch (error) {
          console.error('Facebook login error:', error);
          alert('Facebook login failed. Check console for details.');
        }
      } else {
        console.log('Facebook login cancelled');
      }
    }, { scope: 'public_profile,email' });
  };

  const handleAppleLogin = () => {
    alert('🍎 Apple Sign In Setup Required:\n\n1. Enroll in Apple Developer Program ($99/year)\n2. Create Services ID\n3. Configure Sign in with Apple\n4. Update OAUTH_CONFIG.APPLE_CLIENT_ID\n\nSee setup guide for detailed instructions.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col lg:flex-row">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 lg:p-16 order-2 lg:order-1">
        {/* Logo */}
        <div className="w-full max-w-md mb-8 lg:mb-0 lg:absolute lg:top-8 lg:left-8 flex items-center justify-center lg:justify-start gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          </div>
          <span className="text-xl sm:text-2xl font-bold text-gray-900">
            FIN<span className="font-normal text-gray-700">SHIELD</span>
          </span>
        </div>

        {/* Login Form Container */}
        <div className="w-full max-w-md mt-8 lg:mt-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-3">Log In</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Welcome back!</p>

          {/* Email Field */}
          <div className="mb-4 sm:mb-5">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              E-mail
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.email 
                  ? 'border-red-500 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1.5 sm:mb-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Password
              </label>
              <button 
                onClick={() => alert('Password reset functionality coming soon!')}
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 transition-all pr-10 sm:pr-12 ${
                  errors.password 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                }`}
                placeholder="Enter your password"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
                type="button"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center mb-5 sm:mb-6">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 border-gray-300 rounded cursor-pointer"
              id="rememberMe"
            />
            <label htmlFor="rememberMe" className="ml-2 text-xs sm:text-sm text-gray-700 cursor-pointer">
              Remember me
            </label>
          </div>

          {/* Login Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-2.5 sm:py-3 text-sm sm:text-base rounded-full font-semibold transition-all duration-200 mb-5 sm:mb-6 ${
              isSubmitting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            }`}
          >
            {isSubmitting ? 'Logging in...' : 'LOG IN'}
          </button>

          {/* Divider */}
          <div className="relative mb-5 sm:mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-3 sm:px-4 bg-gray-50 text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* OAuth Configuration Notice */}
          {(!oauthReady.google && !oauthReady.facebook) && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-xs flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>OAuth not configured. Update credentials in Login.js to enable social login.</span>
              </p>
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="space-y-2.5 sm:space-y-3 mb-5 sm:mb-6">
            {/* Apple Login */}
            <button
              onClick={handleAppleLogin}
              className="w-full flex items-center justify-center gap-2 sm:gap-3 py-2.5 sm:py-3 px-3 sm:px-4 text-sm sm:text-base bg-gray-900 hover:bg-gray-800 text-white rounded-full font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"></path>
              </svg>
              <span>Log in with Apple</span>
            </button>

            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              disabled={!oauthReady.google}
              className={`w-full flex items-center justify-center gap-2 sm:gap-3 py-2.5 sm:py-3 px-3 sm:px-4 text-sm sm:text-base rounded-full font-medium transition-all duration-200 shadow-md hover:shadow-lg border border-gray-300 ${
                oauthReady.google 
                  ? 'bg-white hover:bg-gray-50 text-gray-700' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path>
              </svg>
              <span>{oauthReady.google ? 'Log in with Google' : 'Google (Not Configured)'}</span>
            </button>

            {/* Facebook Login */}
            <button
              onClick={handleFacebookLogin}
              disabled={!oauthReady.facebook}
              className={`w-full flex items-center justify-center gap-2 sm:gap-3 py-2.5 sm:py-3 px-3 sm:px-4 text-sm sm:text-base rounded-full font-medium transition-all duration-200 shadow-md hover:shadow-lg ${
                oauthReady.facebook 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
              </svg>
              <span>{oauthReady.facebook ? 'Log in with Facebook' : 'Facebook (Not Configured)'}</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-xs sm:text-sm text-gray-600">
            Don't have an account?{" "}
            <button 
              onClick={() => setCurrentPage('signup')}
              className="text-blue-600 font-medium hover:text-blue-700 hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6 sm:p-8 md:p-12 lg:p-16 relative overflow-hidden order-1 lg:order-2 min-h-[300px] sm:min-h-[400px] lg:min-h-screen">
        <div className="absolute top-10 sm:top-20 right-10 sm:right-20 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-blue-200 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute bottom-10 sm:bottom-20 left-10 sm:left-20 w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 bg-indigo-200 rounded-full opacity-50 blur-3xl"></div>
        
        <div className="relative z-10 text-center max-w-lg">
          <div className="mb-6 sm:mb-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl flex items-center justify-center mb-4 sm:mb-6 transform rotate-12 hover:rotate-0 transition-transform duration-300">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
            Protect Your Finances
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 sm:mb-8 px-4">
            Secure financial management with FinShield
          </p>
        </div>
      </div>
    </div>
  );
}