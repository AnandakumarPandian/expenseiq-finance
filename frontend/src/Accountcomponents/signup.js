import { useState, useEffect } from "react";

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
  const [showPassword, setShowPassword] = useState(false);

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
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
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
    if (!validateForm()) return;

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
        if (data.data.token) {
          localStorage.setItem('expenseiq_token', data.data.token);
        }
        
        setIsSubmitting(false);
        setSubmitSuccess(true);

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
      alert('Failed to connect to server. Please ensure the backend is running.');
    }
  };

  const getPasswordStrength = () => {
    const length = formData.password.length;
    if (length === 0) return { strength: 0, text: '', color: '' };
    if (length < 5) return { strength: 1, text: 'Weak', color: 'bg-red-500' };
    if (length < 8) return { strength: 2, text: 'Fair', color: 'bg-yellow-500' };
    return { strength: 3, text: 'Strong', color: 'bg-emerald-500' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Side - Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-800 to-slate-900 p-12 items-center justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-lg">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-6">
            Join Thousands of Users Managing Their Finances
          </h2>
          
          <p className="text-lg text-slate-300 mb-8">
            Start your journey to financial freedom. Track, analyze, and optimize your spending with ExpenseIQ.
          </p>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
              <div className="text-3xl font-bold text-white mb-1">50K+</div>
              <div className="text-slate-300 text-sm">Active Users</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
              <div className="text-3xl font-bold text-white mb-1">₹10M+</div>
              <div className="text-slate-300 text-sm">Tracked Monthly</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
              <div className="text-3xl font-bold text-white mb-1">4.9★</div>
              <div className="text-slate-300 text-sm">User Rating</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
              <div className="text-3xl font-bold text-white mb-1">99.9%</div>
              <div className="text-slate-300 text-sm">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-12">
        {/* API Status Banner */}
        {apiStatus === 'offline' && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold text-red-900">Server Offline</p>
                <p className="text-sm text-red-700">Start backend with: <code className="bg-red-100 px-2 py-0.5 rounded">npm start</code></p>
              </div>
            </div>
          </div>
        )}

        {/* Success Banner */}
        {submitSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold text-emerald-900">Account Created!</p>
                <p className="text-sm text-emerald-700">Redirecting to login...</p>
              </div>
            </div>
          </div>
        )}

        {/* Logo (Mobile) */}
        <div className="lg:hidden flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          </div>
          <span className="text-2xl font-bold text-slate-900">ExpenseIQ</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Create your account</h1>
          <p className="text-lg text-slate-600">Start managing your finances today</p>
        </div>

        {/* Form */}
        <div className="space-y-5 max-w-md">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                First Name
              </label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.firstName 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-slate-300 focus:border-slate-900 focus:ring-slate-200'
                }`}
                placeholder="John"
              />
              {errors.firstName && (
                <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Last Name
              </label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.lastName 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-slate-300 focus:border-slate-900 focus:ring-slate-200'
                }`}
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.email 
                  ? 'border-red-500 focus:ring-red-200' 
                  : 'border-slate-300 focus:border-slate-900 focus:ring-slate-200'
              }`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Repeat Email */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Confirm Email
            </label>
            <input
              type="email"
              name="repeatEmail"
              value={formData.repeatEmail}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.repeatEmail 
                  ? 'border-red-500 focus:ring-red-200' 
                  : 'border-slate-300 focus:border-slate-900 focus:ring-slate-200'
              }`}
              placeholder="you@example.com"
            />
            {errors.repeatEmail && (
              <p className="text-red-600 text-sm mt-1">{errors.repeatEmail}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all pr-12 ${
                  errors.password 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-slate-300 focus:border-slate-900 focus:ring-slate-200'
                }`}
                placeholder="Minimum 8 characters"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                type="button"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
            
            {/* Password Strength */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded ${
                        level <= passwordStrength.strength ? passwordStrength.color : 'bg-slate-200'
                      }`}
                    ></div>
                  ))}
                </div>
                <p className="text-xs text-slate-600">{passwordStrength.text} password</p>
              </div>
            )}
          </div>

          {/* Checkboxes */}
          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="updates"
                checked={formData.updates}
                onChange={handleChange}
                className="mt-1 w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-slate-900"
              />
              <span className="text-sm text-slate-700">
                Send me updates about my finances and ExpenseIQ features
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                className="mt-1 w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-slate-900"
              />
              <span className="text-sm text-slate-700">
                I agree to the{" "}
                <button className="font-semibold text-slate-900 hover:text-slate-700">
                  Terms of Service
                </button>{" "}
                and{" "}
                <button className="font-semibold text-slate-900 hover:text-slate-700">
                  Privacy Policy
                </button>
              </span>
            </label>
            {errors.terms && (
              <p className="text-red-600 text-sm ml-7">{errors.terms}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || apiStatus === 'offline'}
            className={`w-full py-3 rounded-lg font-semibold transition-all mt-2 ${
              isSubmitting || apiStatus === 'offline'
                ? 'bg-slate-400 text-slate-200 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>

          {/* Sign In Link */}
          <p className="text-center text-sm text-slate-600 mt-4">
            Already have an account?{" "}
            <button 
              onClick={() => setCurrentPage('login')}
              className="font-semibold text-slate-900 hover:text-slate-700"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}