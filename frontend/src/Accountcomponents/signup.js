// Signup.js - Save as src/Signup.js
import { useState, useEffect } from "react";

//const API_URL = 'http://localhost:5000/api';
const API_URL = 'http://localhost:8000/api';

export default function Signup({ setCurrentPage }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    repeatEmail: "",
    password: "",
    updates: false,
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      const response = await fetch(`${API_URL}/health`);
      if (response.ok) {
        setApiStatus('connected');
      } else {
        setApiStatus('error');
      }
    } catch (error) {
      console.error('API Health Check Failed:', error);
      setApiStatus('offline');
    }
  };

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
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.repeatEmail.trim()) {
      newErrors.repeatEmail = 'Please confirm your email';
    } else if (formData.email !== formData.repeatEmail) {
      newErrors.repeatEmail = 'Emails do not match';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!formData.terms) {
      newErrors.terms = 'You must agree to the Terms of Service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (apiStatus === 'offline') {
      alert('Cannot connect to server. Please make sure the backend is running');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          updates: formData.updates,
          terms: formData.terms
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        console.log('User registered successfully:', data.data);
        
        if (data.data.token) {
          localStorage.setItem('finshield_token', data.data.token);
        }
        
        setIsSubmitting(false);
        setSubmitSuccess(true);
        alert('Account created successfully! 🎉');

        // Redirect to login after 2 seconds
        setTimeout(() => {
          setCurrentPage('login');
        }, 2000);
      } else {
        setIsSubmitting(false);
        if (data.message === 'Email already registered') {
          setErrors({ email: 'This email is already registered' });
        } else {
          alert(`Registration failed: ${data.message}`);
        }
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error('Registration error:', error);
      alert('Failed to connect to server. Please ensure the backend is running.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center py-4 sm:py-6 md:py-8 px-4">
      {/* API Status Banner */}
      {apiStatus === 'offline' && (
        <div className="w-full max-w-md mb-3 sm:mb-4 p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-xs sm:text-sm flex items-center gap-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-xs sm:text-sm">
              <strong>Server Offline:</strong> <span className="hidden sm:inline">Start backend with: <code className="bg-red-100 px-1.5 py-0.5 rounded text-xs">npm start</code></span>
            </span>
          </p>
        </div>
      )}

      {/* Success Banner */}
      {submitSuccess && (
        <div className="w-full max-w-md mb-3 sm:mb-4 p-2.5 sm:p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-xs sm:text-sm flex items-center gap-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Account created successfully! Redirecting to login...
          </p>
        </div>
      )}

      {/* Logo */}
      <div className="w-full max-w-md mb-4 sm:mb-6 md:mb-8 flex items-center justify-center sm:justify-start gap-2">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
        </div>
        <span className="text-xl sm:text-2xl font-bold text-gray-900">
          FIN<span className="font-normal text-gray-700">SHIELD</span>
        </span>
      </div>

      {/* API Status Indicator */}
      <div className="w-full max-w-md flex justify-end mb-3 sm:mb-4">
        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
          apiStatus === 'connected' ? 'bg-green-100 text-green-700' :
          apiStatus === 'checking' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          <span className={`w-2 h-2 rounded-full ${
            apiStatus === 'connected' ? 'bg-green-500' :
            apiStatus === 'checking' ? 'bg-yellow-500' :
            'bg-red-500'
          }`}></span>
          {apiStatus === 'connected' ? 'Connected' :
           apiStatus === 'checking' ? 'Checking...' :
           'Offline'}
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">Sign Up</h1>
      <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 md:mb-12 text-center px-4">
        Create your FinShield account
      </p>

      {/* Form */}
      <div className="w-full max-w-md space-y-4 sm:space-y-5">
        {/* Name */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/2">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
              First Name
            </label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 ${
                errors.firstName 
                  ? 'border-red-500 focus:ring-red-200' 
                  : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
              }`}
              placeholder="John"
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>
          <div className="w-full sm:w-1/2">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
              Last Name
            </label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 ${
                errors.lastName 
                  ? 'border-red-500 focus:ring-red-200' 
                  : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
              }`}
              placeholder="Doe"
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
            E-mail
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full border rounded-lg px-3 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 ${
              errors.email 
                ? 'border-red-500 focus:ring-red-200' 
                : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
            }`}
            placeholder="john.doe@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Repeat Email */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
            Repeat E-mail
          </label>
          <input
            type="email"
            name="repeatEmail"
            value={formData.repeatEmail}
            onChange={handleChange}
            className={`w-full border rounded-lg px-3 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 ${
              errors.repeatEmail 
                ? 'border-red-500 focus:ring-red-200' 
                : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
            }`}
            placeholder="john.doe@example.com"
          />
          {errors.repeatEmail && (
            <p className="text-red-500 text-xs mt-1">{errors.repeatEmail}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full border rounded-lg px-3 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 ${
              errors.password 
                ? 'border-red-500 focus:ring-red-200' 
                : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
            }`}
            placeholder="Min 8 characters"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
          
          {/* Password Strength */}
          {formData.password && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                <div className={`h-1 flex-1 rounded ${formData.password.length >= 2 ? 'bg-red-500' : 'bg-gray-200'}`}></div>
                <div className={`h-1 flex-1 rounded ${formData.password.length >= 5 ? 'bg-yellow-500' : 'bg-gray-200'}`}></div>
                <div className={`h-1 flex-1 rounded ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
              </div>
              <p className="text-xs text-gray-500">
                {formData.password.length < 5 && 'Weak password'}
                {formData.password.length >= 5 && formData.password.length < 8 && 'Medium password'}
                {formData.password.length >= 8 && 'Strong password'}
              </p>
            </div>
          )}
        </div>

        {/* Checkboxes */}
        <div className="space-y-3 pt-3 sm:pt-4 border-t border-gray-200">
          <label className="flex items-start gap-2 sm:gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="updates"
              checked={formData.updates}
              onChange={handleChange}
              className="mt-0.5 sm:mt-1 w-4 h-4 sm:w-5 sm:h-5 text-blue-600 rounded cursor-pointer flex-shrink-0"
            />
            <p className="text-xs sm:text-sm text-gray-700">
              Send me regular updates about my finances and FinShield.
            </p>
          </label>

          <label className="flex items-start gap-2 sm:gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
              className="mt-0.5 sm:mt-1 w-4 h-4 sm:w-5 sm:h-5 text-blue-600 rounded cursor-pointer flex-shrink-0"
            />
            <p className="text-xs sm:text-sm text-gray-700">
              I agree with the FinShield{" "}
              <span className="text-blue-600 font-medium hover:underline cursor-pointer">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-blue-600 font-medium hover:underline cursor-pointer">
                Privacy Policy
              </span>
              .
            </p>
          </label>
          {errors.terms && (
            <p className="text-red-500 text-xs ml-6 sm:ml-8">{errors.terms}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || apiStatus === 'offline'}
          className={`w-full mt-5 sm:mt-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-full font-semibold transition-all duration-200 ${
            isSubmitting || apiStatus === 'offline'
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-xs sm:text-base">Creating Account...</span>
            </span>
          ) : (
            'SIGN UP'
          )}
        </button>

        <p className="text-center text-xs sm:text-sm text-gray-600 mt-4 sm:mt-6 pb-4">
          Already have an account?{" "}
          <button 
            onClick={() => setCurrentPage('login')}
            className="text-blue-600 font-medium hover:text-blue-700 hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}