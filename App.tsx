
import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Rewards } from './components/Rewards';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { LoginSelector } from './components/LoginSelector';
import { translations } from './constants/translations';

// --- Mock Database (using localStorage) ---
export const DB_KEY = 'coffeeAppDB';

interface UserData {
  stamps: number;
  language: 'kh' | 'en';
}

export interface Database {
  currentUser: string | null;
  currentAdmin: string | null;
  users: Record<string, UserData>;
}

export const getDb = (): Database => {
  try {
    const dbString = localStorage.getItem(DB_KEY);
    if (dbString) {
      return JSON.parse(dbString);
    }
  } catch (error) {
    console.error("Failed to parse DB from localStorage", error);
  }
  return { currentUser: null, currentAdmin: null, users: {} };
};

export const saveDb = (db: Database) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};
// --- End Mock Database ---

type View = 'selector' | 'userLogin' | 'adminLogin' | 'rewards' | 'adminDashboard';

const App: React.FC = () => {
  const [session, setSession] = useState<{ user: string | null, admin: string | null }>(() => {
    const db = getDb();
    return { user: db.currentUser, admin: db.currentAdmin };
  });
  const [language, setLanguage] = useState<'kh' | 'en'>('kh');

  // Determine the current view based on session state
  const getView = (): View => {
    if (session.admin) return 'adminDashboard';
    if (session.user) return 'rewards';
    return 'selector'; // Default view
  };
  
  const [view, setView] = useState<View>(getView());
  
  useEffect(() => {
    // Sync language from DB when a user logs in
    if (session.user) {
      const db = getDb();
      setLanguage(db.users[session.user]?.language || 'kh');
    } else {
        setLanguage('kh');
    }
  }, [session.user]);

  const handleUserLogin = (username: string) => {
    const db = getDb();
    if (!db.users[username]) {
      db.users[username] = { stamps: 0, language: 'kh' };
    }
    db.currentUser = username;
    saveDb(db);
    setSession({ user: username, admin: null });
    setView('rewards');
  };
  
  const handleAdminLogin = (username: string) => {
    const db = getDb();
    db.currentAdmin = username;
    saveDb(db);
    setSession({ user: null, admin: username });
    setView('adminDashboard');
  };

  const handleLogout = () => {
    const db = getDb();
    db.currentUser = null;
    db.currentAdmin = null;
    saveDb(db);
    setSession({ user: null, admin: null });
    setView('selector');
  };

  const handleLanguageChange = (lang: 'kh' | 'en') => {
    setLanguage(lang);
    if (session.user) {
      const db = getDb();
      if (db.users[session.user]) {
        db.users[session.user].language = lang;
        saveDb(db);
      }
    }
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
            />
        ) : null;
      case 'selector':
      default:
        return <LoginSelector t={t} onSelectUser={() => setView('userLogin')} onSelectAdmin={() => setView('adminLogin')} />;
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b from-[#264a3e] to-[#eee4c9] flex flex-col items-center justify-center p-4 transition-all duration-300 ${language === 'kh' ? 'font-kantumruy' : 'font-sans'}`}>
      {renderView()}
    </div>
  );
};

export default App;