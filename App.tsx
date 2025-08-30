
import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Rewards } from './components/Rewards';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { LoginSelector } from './components/LoginSelector';
import { translations } from './constants/translations';

// --- IndexedDB Database ---

export interface User {
  username: string;
  stamps: number;
  language: 'kh' | 'en';
}

export interface Session {
  id: 'current';
  user: string | null;
  admin: string | null;
}

const DB_NAME = 'CoffeeRewardsDB';
const DB_VERSION = 1;
const USERS_STORE = 'users';
const SESSION_STORE = 'session';

let db: IDBDatabase;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Database error:', request.error);
      reject('Error opening database');
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      if (!dbInstance.objectStoreNames.contains(USERS_STORE)) {
        dbInstance.createObjectStore(USERS_STORE, { keyPath: 'username' });
      }
      if (!dbInstance.objectStoreNames.contains(SESSION_STORE)) {
        dbInstance.createObjectStore(SESSION_STORE, { keyPath: 'id' });
      }
    };
  });
}

// User Functions
export async function getAllUsers(): Promise<User[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(USERS_STORE, 'readonly');
    const store = transaction.objectStore(USERS_STORE);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getUser(username: string): Promise<User | undefined> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(USERS_STORE, 'readonly');
    const store = transaction.objectStore(USERS_STORE);
    const request = store.get(username);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function upsertUser(user: User): Promise<void> {
    const db = await openDb();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(USERS_STORE, 'readwrite');
        const store = transaction.objectStore(USERS_STORE);
        const request = store.put(user);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export async function deleteUser(username: string): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(USERS_STORE, 'readwrite');
    const store = transaction.objectStore(USERS_STORE);
    const request = store.delete(username);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Session Functions
export async function getSession(): Promise<Session> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(SESSION_STORE, 'readonly');
    const store = transaction.objectStore(SESSION_STORE);
    const request = store.get('current');

    request.onsuccess = () => {
      resolve(request.result || { id: 'current', user: null, admin: null });
    };
    request.onerror = () => reject(request.error);
  });
}

export async function setSession(sessionData: Omit<Session, 'id'>): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(SESSION_STORE, 'readwrite');
    const store = transaction.objectStore(SESSION_STORE);
    const request = store.put({ id: 'current', ...sessionData });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// --- End IndexedDB ---

type View = 'selector' | 'userLogin' | 'adminLogin' | 'rewards' | 'adminDashboard' | 'adminViewingUserCard';

const App: React.FC = () => {
  const [session, setSession] = useState<{ user: string | null, admin: string | null }>({ user: null, admin: null });
  const [language, setLanguage] = useState<'kh' | 'en'>('kh');
  const [adminViewingUser, setAdminViewingUser] = useState<string | null>(null);
  const [view, setView] = useState<View>('selector');
  const [isLoading, setIsLoading] = useState(true);

  // Load initial session and handle deep linking
  useEffect(() => {
    const initialize = async () => {
      const currentSession = await getSession();

      if (currentSession.user || currentSession.admin) {
        setSession({ user: currentSession.user, admin: currentSession.admin });
      } else {
        const urlParams = new URLSearchParams(window.location.search);
        const userFromUrl = urlParams.get('user');
        if (userFromUrl) {
          // Fire and forget login attempt
          handleUserLogin(userFromUrl.trim()).then(loginSuccess => {
              if (loginSuccess) {
                window.history.replaceState({}, document.title, window.location.pathname);
              }
          });
        }
      }
      setIsLoading(false);
    };
    initialize();
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
            const user = await getUser(session.user);
            setLanguage(user?.language || 'kh');
        } else {
            setLanguage('kh');
        }
    };
    syncLanguage();
  }, [session.user]);

  const handleUserLogin = async (username: string): Promise<boolean> => {
    const lowerCaseUsername = username.toLowerCase();
    const user = await getUser(lowerCaseUsername);
    if (user) {
      await setSession({ user: lowerCaseUsername, admin: null });
      setSession({ user: lowerCaseUsername, admin: null });
      return true;
    }
    return false;
  };
  
  const handleAdminLogin = async (username: string) => {
    await setSession({ user: null, admin: username });
    setSession({ user: null, admin: username });
  };

  const handleLogout = async () => {
    await setSession({ user: null, admin: null });
    setSession({ user: null, admin: null });
    setAdminViewingUser(null);
  };

  const handleLanguageChange = async (lang: 'kh' | 'en') => {
    setLanguage(lang);
    if (session.user) {
      const user = await getUser(session.user);
      if (user) {
        await upsertUser({ ...user, language: lang });
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
            {/* Loading state can have a spinner later */}
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
