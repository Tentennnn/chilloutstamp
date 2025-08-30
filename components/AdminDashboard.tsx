
import React, { useState, useEffect } from 'react';
import { User, getAllUsers, getUser, upsertUser, deleteUser } from '../App';
import { translations } from '../constants/translations';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ShareProfileModal } from './ShareProfileModal';

interface AdminDashboardProps {
  adminUser: string;
  onLogout: () => void;
  language: 'kh' | 'en';
  onLanguageChange: (lang: 'kh' | 'en') => void;
  onViewUser: (username: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ adminUser, onLogout, language, onLanguageChange, onViewUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUsername, setNewUsername] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; content: string } | null>(null);
  const [shareModalUser, setShareModalUser] = useState<string | null>(null);

  const fetchUsers = async () => {
    const allUsers = await getAllUsers();
    setUsers(allUsers.sort((a, b) => a.username.localeCompare(b.username)));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const t = translations[language];

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) return;

    const trimmedUsername = newUsername.trim().toLowerCase();
    const existingUser = await getUser(trimmedUsername);

    if (existingUser) {
      setMessage({ type: 'error', content: t.userExistsError(trimmedUsername) });
    } else {
      await upsertUser({ username: trimmedUsername, stamps: 0, language: 'kh' });
      setMessage({ type: 'success', content: t.userCreatedSuccess(trimmedUsername) });
      setNewUsername('');
      fetchUsers(); // Refresh list
    }
    
    setTimeout(() => setMessage(null), 3000);
  };
  
  const handleStampChange = async (username: string, amount: number) => {
    const user = await getUser(username);
    if (user) {
        const newStamps = Math.max(0, Math.min(15, user.stamps + amount));
        await upsertUser({ ...user, stamps: newStamps });
        fetchUsers(); // Refresh list
    }
  };

  const handleResetUser = async (username: string) => {
      if (window.confirm(t.resetUserConfirmation(username))) {
          const user = await getUser(username);
          if (user) {
              await upsertUser({ ...user, stamps: 0 });
              fetchUsers();
          }
      }
  };

  const handleRemoveUser = async (username: string) => {
    if (window.confirm(t.removeUserConfirmation(username))) {
      await deleteUser(username);
      fetchUsers();
    }
  };

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
              {users.map((user) => (
                <div key={user.username} className="flex flex-col sm:flex-row justify-between items-center bg-white p-3 rounded-lg shadow-sm gap-3">
                  <div className="flex-1 text-center sm:text-left">
                    <button 
                      onClick={() => onViewUser(user.username)}
                      className="font-semibold text-brand-green-900 hover:text-brand-green-600 hover:underline focus:outline-none transition-colors"
                      aria-label={`View ${user.username}'s card`}
                    >
                      {user.username}
                    </button>
                    <span className="block text-sm sm:inline sm:ml-3 text-white bg-brand-green-700 px-3 py-1 rounded-full">{`${user.stamps} / 15`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                      <button 
                          onClick={() => handleStampChange(user.username, -1)} 
                          disabled={user.stamps === 0}
                          className="w-8 h-8 font-bold text-lg bg-brand-green-100 text-brand-green-800 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-green-200 transition-colors"
                          aria-label={`Remove stamp from ${user.username}`}
                      >
                          -
                      </button>
                      <button 
                          onClick={() => handleStampChange(user.username, 1)} 
                          disabled={user.stamps >= 15}
                          className="w-8 h-8 font-bold text-lg bg-brand-green-100 text-brand-green-800 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-green-200 transition-colors"
                          aria-label={`Add stamp to ${user.username}`}
                      >
                          +
                      </button>
                      <button
                        onClick={() => setShareModalUser(user.username)}
                        className="p-2 text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
                        aria-label={t.shareUserButtonLabel(user.username)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button 
                          onClick={() => handleResetUser(user.username)}
                          className="px-3 py-1 text-xs font-semibold text-amber-700 bg-amber-100 rounded-md hover:bg-amber-200 transition-colors"
                      >
                          {t.resetUserStampsButton}
                      </button>
                      <button
                        onClick={() => handleRemoveUser(user.username)}
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
      {shareModalUser && (
        <ShareProfileModal 
          isOpen={!!shareModalUser}
          onClose={() => setShareModalUser(null)}
          username={shareModalUser}
          t={t}
        />
      )}
    </div>
  );
};
