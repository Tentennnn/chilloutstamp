
import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Rewards } from './components/Rewards';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { LoginSelector } from './components/LoginSelector';
import { translations } from './constants/translations';
import { initializeData, getUser, upsertUser } from './services/api';

export interface User {
  username: string;
  stamps: number;
  language: 'kh' | 'en';
}

export interface Session {
  user: string | null;
  admin: string | null;
}

type View = 'selector' | 'userLogin' | 'adminLogin' | 'rewards' | 'adminDashboard' | 'adminViewingUserCard';

const App: React.FC = () => {
  const [session, setSession] = useState<Session>({ user: null, admin: null });
  const [language, setLanguage] = useState<'kh' | 'en'>('kh');
  const [adminViewingUser, setAdminViewingUser] = useState<string | null>(null);
  const [view, setView] = useState<View>('selector');
  const [isLoading, setIsLoading] = useState(true);

  // Handle data loading and deep linking on initial load
  useEffect(() => {
    const performInitialization = async () => {
      await initializeData();
      
      const searchParams = new URLSearchParams(window.location.search);
      const userFromUrl = searchParams.get('user');

      if (userFromUrl) {
        await handleUserLogin(userFromUrl.trim());
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      setIsLoading(false);
    };
    performInitialization();
  }, []);

  // Update view based on session
  useEffect(() => {
    if (adminViewingUser) {
        setView('adminViewingUserCard');
    } else if (session.admin) {
        setView('adminDashboard');
    } else if (session.user) {
        setView('rewards');
    } else {
        setView('selector');
    }
  }, [session, adminViewingUser]);
  
  // Sync language from DB when user changes
  useEffect(() => {
    const syncLanguage = async () => {
        if (session.user) {
            try {
                const user = await getUser(session.user);
                setLanguage(user?.language || 'kh');
            } catch (error) {
                console.error("Failed to sync language on user change:", error);
                setLanguage('kh'); // Default on error
            }
        } else {
            setLanguage('kh');
        }
    };
    syncLanguage();
  }, [session.user]);

  const handleUserLogin = async (username: string): Promise<{ success: boolean; error?: string }> => {
    try {
        const lowerCaseUsername = username.toLowerCase();
        const user = await getUser(lowerCaseUsername);
        if (user) {
          setSession({ user: lowerCaseUsername, admin: null });
          return { success: true };
        }
        return { success: false, error: 'user_not_found' };
    } catch (error) {
        console.error("Login failed:", error);
        return { success: false, error: 'network_error' };
    }
  };
  
  const handleAdminLogin = async (username: string) => {
    setSession({ user: null, admin: username });
  };

  const handleLogout = async () => {
    setSession({ user: null, admin: null });
    setAdminViewingUser(null);
  };

  const handleLanguageChange = async (lang: 'kh' | 'en') => {
    setLanguage(lang);
    if (session.user) {
      try {
        const user = await getUser(session.user);
        if (user) {
          await upsertUser({ ...user, language: lang });
        }
      } catch (error) {
        console.error("Failed to sync language preference:", error);
        // Silently fail, as this is a non-critical background update.
      }
    }
  };

  const handleViewUser = (username: string) => {
    setAdminViewingUser(username);
  };

  const handleBackToAdmin = () => {
    setAdminViewingUser(null);
  };

  const t = translations[language];
  
  const renderView = () => {
    switch(view) {
      case 'userLogin':
        return <Login onLogin={handleUserLogin} t={t} onBack={() => setView('selector')} />;
      case 'adminLogin':
        return <AdminLogin onLogin={handleAdminLogin} t={t} onBack={() => setView('selector')} />;
      case 'rewards':
        return session.user ? (
          <Rewards 
            user={session.user} 
            onLogout={handleLogout} 
            initialLanguage={language}
            onLanguageChange={handleLanguageChange}
          />
        ) : null;
      case 'adminDashboard':
        return session.admin ? (
            <AdminDashboard 
              adminUser={session.admin}
              onLogout={handleLogout}
              language={language}
              onLanguageChange={(lang) => setLanguage(lang)}
              onViewUser={handleViewUser}
            />
        ) : null;
       case 'adminViewingUserCard':
        return adminViewingUser ? (
            <Rewards
                user={adminViewingUser}
                onBack={handleBackToAdmin}
                initialLanguage={language}
                onLanguageChange={handleLanguageChange}
            />
        ) : null;
      case 'selector':
      default:
        return <LoginSelector t={t} onSelectUser={() => setView('userLogin')} onSelectAdmin={() => setView('adminLogin')} />;
    }
  }

  if (isLoading) {
      return (
         <div className="min-h-screen bg-gradient-to-b from-[#264a3e] to-[#eee4c9] flex flex-col items-center justify-center p-4">
            <div className="flex items-center justify-center text-white">
                <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-lg">Loading...</span>
            </div>
         </div>
      )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b from-[#264a3e] to-[#eee4c9] flex flex-col items-center justify-center p-4 transition-all duration-300 ${language === 'kh' ? 'font-kantumruy' : 'font-sans'}`}>
      {renderView()}
    </div>
  );
};

export default App;
