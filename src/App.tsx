import React, { useState, useEffect } from 'react';
import { LoginForm } from './components/LoginForm';
import { RegistrationForm } from './components/RegistrationForm';
import { AdminDashboard } from './components/AdminDashboard';
import { UserDashboard } from './components/UserDashboard';
import { authService, User } from './utils/auth';
import { Toaster } from './components/ui/sonner';
import './styles/globals.css';

// Import ethers for Web3 functionality
import { ethers } from 'ethers';

// Ensure ethers is available globally for Web3 components
if (typeof window !== 'undefined') {
  (window as any).ethers = ethers;
  
  // Set up environment variables for Web3 (configure these in your deployment platform)
  (window as any).ENV = {
    // Replace these with your actual values - use the public RPC for now
    NEXT_PUBLIC_CONTRACT_ADDRESS: 'YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE', // Replace with your deployed contract address
    NEXT_PUBLIC_RPC_URL: 'https://rpc.sepolia.org', // Free public Sepolia RPC - no authentication needed
    
    // These can be overridden by deployment platform environment variables
    ...(window as any).ENV
  };
  
  console.log('Web3 Environment initialized:', {
    CONTRACT_ADDRESS: (window as any).ENV.NEXT_PUBLIC_CONTRACT_ADDRESS,
    RPC_URL: (window as any).ENV.NEXT_PUBLIC_RPC_URL
  });
}

type ViewState = 'login' | 'register' | 'dashboard';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('login');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setCurrentView('dashboard');
    }
    setLoading(false);

    // Subscribe to auth changes
    const unsubscribe = authService.subscribe((user) => {
      setUser(user);
      if (user) {
        setCurrentView('dashboard');
      } else {
        setCurrentView('login');
      }
    });

    return unsubscribe;
  }, []);

  const handleLoginSuccess = () => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setCurrentView('login');
  };

  const handleRegisterClick = () => {
    setCurrentView('register');
  };

  const handleBackToLogin = () => {
    setCurrentView('login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading BlueMercantile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {currentView === 'login' && (
        <LoginForm 
          onLoginSuccess={handleLoginSuccess}
          onRegisterClick={handleRegisterClick}
        />
      )}
      
      {currentView === 'register' && (
        <RegistrationForm 
          onBackToLogin={handleBackToLogin}
        />
      )}
      
      {currentView === 'dashboard' && user && (
        <>
          {user.userType === 'admin' ? (
            <AdminDashboard onLogout={handleLogout} />
          ) : (
            <UserDashboard user={user} onLogout={handleLogout} />
          )}
        </>
      )}
      
      <Toaster />
    </div>
  );
}