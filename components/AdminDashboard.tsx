import React, { useState, useEffect } from 'react';
import { getDb, saveDb, Database } from '../App';
import { translations } from '../constants/translations';
import { LanguageSwitcher } from './LanguageSwitcher';

interface AdminDashboardProps {
  adminUser: string;
  onLogout: () => void;
  language: 'kh' | 'en';
  onLanguageChange: (lang: 'kh' | 'en') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ adminUser, onLogout, language, onLanguageChange }) => {
  const [db, setDb] = useState<Database>(getDb());
  const [newUsername, setNewUsername] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; content: string } | null>(null);

  useEffect(() => {
    // Re-sync with DB on mount in case it was modified elsewhere
    setDb(getDb());
  }, []);

  const t = translations[language];

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) return;

    const currentDb = getDb();
    const trimmedUsername = newUsername.trim().toLowerCase();

    if (currentDb.users[trimmedUsername]) {
      setMessage({ type: 'error', content: t.userExistsError(trimmedUsername) });
    } else {
      currentDb.users[trimmedUsername] = { stamps: 0, language: 'kh' };
      saveDb(currentDb);
      setDb({ ...currentDb }); // Update state to re-render
      setMessage({ type: 'success', content: t.userCreatedSuccess(trimmedUsername) });
      setNewUsername(''); // Clear input
    }
    
    // Clear message after a few seconds
    setTimeout(() => setMessage(null), 3000);
  };
  
  const handleStampChange = (username: string, amount: number) => {
    const currentDb = getDb();
    const user = currentDb.users[username];
    if (user) {
        const newStamps = Math.max(0, Math.min(15, user.stamps + amount));
        user.stamps = newStamps;
        saveDb(currentDb);
        setDb({ ...currentDb }); // Re-render
    }
  };

  const handleResetUser = (username: string) => {
      if (window.confirm(t.resetUserConfirmation(username))) {
          const currentDb = getDb();
          if (currentDb.users[username]) {
              currentDb.users[username].stamps = 0;
              saveDb(currentDb);
              setDb({ ...currentDb });
          }
      }
  };

  const handleRemoveUser = (username: string) => {
    if (window.confirm(t.removeUserConfirmation(username))) {
      const currentDb = getDb();
      if (currentDb.users[username]) {
        delete currentDb.users[username];
        saveDb(currentDb);
        setDb({ ...currentDb }); // Re-render the component
      }
    }
  };

  const users = Object.entries(db.users);

  const toggleLanguage = () => {
    onLanguageChange(language === 'kh' ? 'en' : 'kh');
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <header className="flex flex-col sm:flex-row justify-between items-center w-full mb-6 gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-brand-green-900">{t.adminDashboardTitle}</h1>
        <div className="flex items-center gap-2 sm:gap-3 text-sm">
          <span className="text-brand-green-800 font-semibold">{t.welcomeMessage(adminUser)}</span>
          <LanguageSwitcher currentLanguage={language} onToggle={toggleLanguage} />
          <button
            onClick={onLogout}
            className="px-3 py-2 font-semibold bg-white text-brand-green-700 rounded-lg shadow-sm hover:bg-brand-green-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-500"
            aria-label={t.logoutButton}
          >
            {t.logoutButton}
          </button>
        </div>
      </header>

      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        {/* Create User Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-brand-green-800 mb-2">{t.createUserTitle}</h2>
          <p className="text-brand-green-600 mb-4">{t.createUserInstructions}</p>
          <form onSubmit={handleCreateUser} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder={t.usernamePlaceholder}
              className="flex-grow px-4 py-3 border border-brand-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green-500"
              aria-label={t.usernamePlaceholder}
              required
            />
            <button
              type="submit"
              className="px-6 py-3 font-bold rounded-xl text-white bg-brand-green-800 hover:bg-brand-green-900 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-brand-green-300"
            >
              {t.createUserButton}
            </button>
          </form>
          {message && <p className={`mt-3 text-sm text-center sm:text-left ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>{message.content}</p>}
        </section>

        {/* Existing Users Section */}
        <section>
          <h2 className="text-xl font-bold text-brand-green-800 mb-4">{t.existingUsersTitle}</h2>
          {users.length > 0 ? (
            <div className="max-h-96 overflow-y-auto bg-brand-green-50 p-3 sm:p-4 rounded-xl space-y-3">
              {users.map(([username, data]) => (
                <div key={username} className="flex flex-col sm:flex-row justify-between items-center bg-white p-3 rounded-lg shadow-sm gap-3">
                  <div className="flex-1 text-center sm:text-left">
                    <span className="font-semibold text-brand-green-900">{username}</span>
                    <span className="block text-sm sm:inline sm:ml-3 text-white bg-brand-green-700 px-3 py-1 rounded-full">{`${data.stamps} / 15`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                      <button 
                          onClick={() => handleStampChange(username, -1)} 
                          disabled={data.stamps === 0}
                          className="w-8 h-8 font-bold text-lg bg-brand-green-100 text-brand-green-800 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-green-200 transition-colors"
                          aria-label={`Remove stamp from ${username}`}
                      >
                          -
                      </button>
                      <button 
                          onClick={() => handleStampChange(username, 1)} 
                          disabled={data.stamps >= 15}
                          className="w-8 h-8 font-bold text-lg bg-brand-green-100 text-brand-green-800 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-green-200 transition-colors"
                          aria-label={`Add stamp to ${username}`}
                      >
                          +
                      </button>
                      <button 
                          onClick={() => handleResetUser(username)}
                          className="px-3 py-1 text-xs font-semibold text-amber-700 bg-amber-100 rounded-md hover:bg-amber-200 transition-colors"
                      >
                          {t.resetUserStampsButton}
                      </button>
                      <button
                        onClick={() => handleRemoveUser(username)}
                        className="px-3 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
                      >
                        {t.removeUserButton}
                      </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-brand-green-600 text-center sm:text-left">No users created yet.</p>
          )}
        </section>
      </div>
    </div>
  );
};