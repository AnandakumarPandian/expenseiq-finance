import React, { useState, useEffect } from 'react';
import Login from './Accountcomponents/login';
import Signup from './Accountcomponents/signup';
import Menu from './Menucomponents/menu';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('expenseiq_token');
    const user = localStorage.getItem('expenseiq_user');
    setCurrentPage(token && user ? 'menu' : 'login');
    setIsLoading(false);
  }, []);

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
      {currentPage === 'login'  && <Login setCurrentPage={setCurrentPage} />}
      {currentPage === 'signup' && <Signup setCurrentPage={setCurrentPage} />}
      {currentPage === 'menu'   && <Menu setCurrentPage={setCurrentPage} />}
    </div>
  );
}

export default App;