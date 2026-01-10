// App.js
import React, { useState, useEffect } from 'react';
import Login from './Accountcomponents/login';
import Signup from './Accountcomponents/signup';
import Menu from './Menucomponents/menu';
import Dashboard from './Menucomponents/dashboard';
import Analytics from './Menucomponents/analytics';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on component mount
    const token = localStorage.getItem('finshield_token');
    const user = localStorage.getItem('finshield_user');
    
    if (token && user) {
      // User is logged in, redirect to menu
      setCurrentPage('menu');
    } else {
      // User is not logged in, stay on login page
      setCurrentPage('login');
    }
    
    setIsLoading(false);
  }, []);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {currentPage === 'login' && <Login setCurrentPage={setCurrentPage} />}
      {currentPage === 'signup' && <Signup setCurrentPage={setCurrentPage} />}
      {currentPage === 'menu' && <Menu setCurrentPage={setCurrentPage} />}
      {currentPage === 'dashboard' && <Dashboard setCurrentPage={setCurrentPage} />}
      {currentPage === 'analytics' && <Analytics setCurrentPage={setCurrentPage} />}
    </div>
  );
}

export default App;