
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

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
    if (!dbPromise) {
        dbPromise = new Promise((resolve, reject) => {
            // Check for IndexedDB support
            if (!('indexedDB' in window)) {
                console.error("This browser doesn't support IndexedDB.");
                return reject("IndexedDB not supported");
            }

            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => {
                console.error('Database error:', request.error);
                dbPromise = null; // Allow retrying
                reject('Error opening database');
            };

            request.onblocked = () => {
                console.warn('Database open request is blocked.');
                // This can happen if another tab is upgrading the DB.
                alert("The application can't start because it's already open in another tab that needs to be updated. Please close all other tabs with this app open and reload.");
                reject('Database is blocked');
            };

            request.onsuccess = () => {
                const db = request.result;
                // Handle version changes from other tabs
                db.onversionchange = () => {
                    db.close();
                    dbPromise = null; // Force re-open on next call
                    alert("A new version of the application is available. The page will now reload.");
                    window.location.reload();
                };
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
    return dbPromise;
}


/**
 * A utility to promisify IndexedDB requests.
 */
function promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}


// User Functions
export async function getAllUsers(): Promise<User[]> {
  const db = await openDb();
  const transaction = db.transaction(USERS_STORE, 'readonly');
  const store = transaction.objectStore(USERS_STORE);
  return promisifyRequest(store.getAll());
}

export async function getUser(username: string): Promise<User | undefined> {
  const db = await openDb();
  const transaction = db.transaction(USERS_STORE, 'readonly');
  const store = transaction.objectStore(USERS_STORE);
  return promisifyRequest(store.get(username));
}

export async function upsertUser(user: User): Promise<void> {
    const db = await openDb();
    const transaction = db.transaction(USERS_STORE, 'readwrite');
    const store = transaction.objectStore(USERS_STORE);
    await promisifyRequest(store.put(user));
}

export async function deleteUser(username: string): Promise<void> {
  const db = await openDb();
  const transaction = db.transaction(USERS_STORE, 'readwrite');
  const store = transaction.objectStore(USERS_STORE);
  await promisifyRequest(store.delete(username));
}

export async function clearUsers(): Promise<void> {
  const db = await openDb();
  const transaction = db.transaction(USERS_STORE, 'readwrite');
  const store = transaction.objectStore(USERS_STORE);
  await promisifyRequest(store.clear());
}

// Session Functions
export async function getSession(): Promise<Session> {
  const db = await openDb();
  const transaction = db.transaction(SESSION_STORE, 'readonly');
  const store = transaction.objectStore(SESSION_STORE);
  const session = await promisifyRequest(store.get('current'));
  return session || { id: 'current', user: null, admin: null };
}

export async function setSession(sessionData: Omit<Session, 'id'>): Promise<void> {
  const db = await openDb();
  const transaction = db.transaction(SESSION_STORE, 'readwrite');
  const store = transaction.objectStore(SESSION_STORE);
  await promisifyRequest(store.put({ id: 'current', ...sessionData }));
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
      try {
        const currentSession = await getSession();

        if (currentSession.user || currentSession.admin) {
          setSession({ user: currentSession.user, admin: currentSession.admin });
        } else {
          const path = window.location.pathname;
          // Match /username/profile or /username/profile/
          const match = path.match(/^\/([^/]+)\/profile\/?$/);
          const userFromUrl = match ? decodeURIComponent(match[1]) : null;

          if (userFromUrl) {
            // Fire and forget login attempt
            handleUserLogin(userFromUrl.trim()).then(() => {
              // Always clean up URL to base path after deep link attempt
              window.history.replaceState({}, document.title, '/');
            });
          }
        }
      } catch (error) {
          console.error("Failed to initialize app:", error);
          // Here you could show an error message to the user
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

  const handleUserLogin = async (username: string): Promise<{ success: boolean; error?: string }> => {
    const lowerCaseUsername = username.toLowerCase();
    const user = await getUser(lowerCaseUsername);
    if (user) {
      await setSession({ user: lowerCaseUsername, admin: null });
      setSession({ user: lowerCaseUsername, admin: null });
      return { success: true };
    }
    return { success: false, error: 'user_not_found' };
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
