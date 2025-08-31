
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { User, getAllUsers, getUser, upsertUser, deleteUser, clearUsers } from '../App';
import { translations, Translations } from '../constants/translations';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ShareProfileModal } from './ShareProfileModal';

interface AdminDashboardProps {
  adminUser: string;
  onLogout: () => void;
  language: 'kh' | 'en';
  onLanguageChange: (lang: 'kh' | 'en') => void;
  onViewUser: (username: string) => void;
}

// --- Local Components for Modals and Toasts ---

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onDismiss: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(onDismiss, 3000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

    return (
        <div className="fixed top-5 right-5 z-50 animate-slide-in">
            <div className={`flex items-center p-4 text-white rounded-lg shadow-lg ${bgColor}`}>
                <p>{message}</p>
                <button onClick={onDismiss} className="ml-4 text-xl font-bold">&times;</button>
            </div>
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .animate-slide-in { animation: slideIn 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    children: React.ReactNode;
    t: Translations;
    variant?: 'danger' | 'default';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, children, t, variant = 'default' }) => {
    if (!isOpen) return null;
    
    const confirmButtonColor = variant === 'danger'
        ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        : 'bg-brand-green-800 hover:bg-brand-green-900 focus:ring-brand-green-300';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center relative transform transition-all opacity-0 animate-fade-in-scale"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-xl font-bold text-brand-green-900 mb-2">{title}</h3>
                <div className="text-brand-green-700 mb-6">{children}</div>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={onClose}
                        className="w-full py-2 px-4 text-lg font-bold bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors focus:outline-none focus:ring-4 focus:ring-gray-300"
                    >
                        {t.cancelButton}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`w-full py-2 px-4 text-lg font-bold text-white rounded-xl transition-colors focus:outline-none focus:ring-4 ${confirmButtonColor}`}
                    >
                        {t.confirmButton}
                    </button>
                </div>
            </div>
             <style>{`
                @keyframes fadeInScale {
                  from { transform: scale(0.95); opacity: 0; }
                  to { transform: scale(1); opacity: 1; }
                }
                .animate-fade-in-scale {
                    animation: fadeInScale 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
                }
            `}</style>
        </div>
    );
};

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (mode: 'merge' | 'replace') => void;
    t: Translations;
}

const ImportConfirmationModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onConfirm, t }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center relative transform transition-all opacity-0 animate-fade-in-scale"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-xl font-bold text-brand-green-900 mb-2">{t.importModalTitle}</h3>
                <p className="text-brand-green-700 mb-6">{t.importModalMessage}</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button
                        onClick={() => onConfirm('merge')}
                        className="w-full py-3 px-4 text-lg font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300"
                    >
                        {t.mergeButton}
                    </button>
                    <button
                        onClick={() => onConfirm('replace')}
                        className="w-full py-3 px-4 text-lg font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors focus:outline-none focus:ring-4 focus:ring-red-400"
                    >
                        {t.replaceButton}
                    </button>
                </div>
                 <button
                    onClick={onClose}
                    className="w-full sm:w-auto mt-4 py-2 px-4 text-sm font-semibold text-gray-600 hover:underline"
                >
                    {t.cancelButton}
                </button>
            </div>
            <style>{`
                @keyframes fadeInScale {
                  from { transform: scale(0.95); opacity: 0; }
                  to { transform: scale(1); opacity: 1; }
                }
                .animate-fade-in-scale {
                    animation: fadeInScale 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
                }
            `}</style>
        </div>
    )
}

type SortOption = 'username-asc' | 'username-desc' | 'stamps-asc' | 'stamps-desc';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ adminUser, onLogout, language, onLanguageChange, onViewUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUsername, setNewUsername] = useState('');
  const [shareModalUser, setShareModalUser] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; content: string } | null>(null);
  const [confirmation, setConfirmation] = useState<{
      action: 'reset' | 'remove';
      username: string;
  } | null>(null);
  const [updatedStamp, setUpdatedStamp] = useState<{ username: string; change: 'add' | 'remove' } | null>(null);
  const [importData, setImportData] = useState<User[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('username-asc');


  const fetchUsers = async () => {
    const allUsers = await getAllUsers();
    setUsers(allUsers);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const t = translations[language];

  const displayedUsers = useMemo(() => {
    return users
      .filter(user => user.username.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        switch (sortOption) {
          case 'username-asc':
            return a.username.localeCompare(b.username);
          case 'username-desc':
            return b.username.localeCompare(a.username);
          case 'stamps-asc':
            return a.stamps - b.stamps;
          case 'stamps-desc':
            return b.stamps - a.stamps;
          default:
            return 0;
        }
      });
  }, [users, searchQuery, sortOption]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) return;

    const trimmedUsername = newUsername.trim().toLowerCase();
    const existingUser = await getUser(trimmedUsername);

    if (existingUser) {
      setToast({ type: 'error', content: t.userExistsError(trimmedUsername) });
    } else {
      await upsertUser({ username: trimmedUsername, stamps: 0, language: 'kh' });
      setToast({ type: 'success', content: t.userCreatedSuccess(trimmedUsername) });
      setNewUsername('');
      fetchUsers(); // Refresh list
    }
  };
  
  const handleStampChange = async (username: string, amount: number) => {
    const user = await getUser(username);
    if (user) {
        const newStamps = Math.max(0, Math.min(15, user.stamps + amount));
        await upsertUser({ ...user, stamps: newStamps });
        fetchUsers();
        
        setUpdatedStamp({ username, change: amount > 0 ? 'add' : 'remove' });
        setTimeout(() => setUpdatedStamp(null), 500);
    }
  };

  const handleResetUser = async (username: string) => {
    const user = await getUser(username);
    if (user) {
        await upsertUser({ ...user, stamps: 0 });
        fetchUsers();
    }
    setConfirmation(null);
  };

  const handleRemoveUser = async (username: string) => {
    await deleteUser(username);
    fetchUsers();
    setConfirmation(null);
  };

  const handleConfirmation = () => {
      if (!confirmation) return;
      if (confirmation.action === 'reset') {
          handleResetUser(confirmation.username);
      } else if (confirmation.action === 'remove') {
          handleRemoveUser(confirmation.username);
      }
  };

  const toggleLanguage = () => {
    onLanguageChange(language === 'kh' ? 'en' : 'kh');
  };

  const handleExport = async () => {
      const allUsers = await getAllUsers();
      const dataStr = JSON.stringify(allUsers, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'coffee-rewards-backup.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
  };

  const handleTriggerImport = () => {
      fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
          try {
              const text = e.target?.result;
              if (typeof text !== 'string') throw new Error("File is not text");
              const data = JSON.parse(text);

              // Basic validation
              if (Array.isArray(data) && (data.length === 0 || (data[0].username && typeof data[0].stamps === 'number'))) {
                  setImportData(data);
              } else {
                  throw new Error("Invalid data format");
              }
          } catch (error) {
              setToast({ type: 'error', content: t.importErrorMessage });
              console.error("Import error:", error);
          }
      };
      reader.readAsText(file);
      // Reset file input to allow re-uploading the same file
      event.target.value = '';
  };
  
  const handleImportConfirm = async (mode: 'merge' | 'replace') => {
    if (!importData) return;

    if (mode === 'replace') {
        await clearUsers();
    }

    for (const user of importData) {
        // Ensure data integrity before upserting
        if(user.username && typeof user.stamps === 'number') {
           await upsertUser({
               username: user.username.toLowerCase(),
               stamps: Math.max(0, Math.min(15, user.stamps)), // Clamp stamps
               language: user.language || 'kh'
           });
        }
    }
    
    setToast({ type: 'success', content: t.importSuccessMessage(importData.length) });
    setImportData(null);
    fetchUsers();
  };


  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      {toast && <Toast message={toast.content} type={toast.type} onDismiss={() => setToast(null)} />}
      <ConfirmationModal
          isOpen={!!confirmation}
          onClose={() => setConfirmation(null)}
          onConfirm={handleConfirmation}
          title={confirmation?.action === 'reset' ? t.resetUserModalTitle : t.removeUserModalTitle}
          t={t}
          variant={confirmation?.action === 'remove' ? 'danger' : 'default'}
      >
          {confirmation && <p>
              {confirmation.action === 'reset' 
                  ? t.resetUserModalMessage(confirmation.username) 
                  : t.removeUserModalMessage(confirmation.username)}
          </p>}
      </ConfirmationModal>

      <ImportConfirmationModal
        isOpen={!!importData}
        onClose={() => setImportData(null)}
        onConfirm={handleImportConfirm}
        t={t}
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".json,application/json"
        style={{ display: 'none' }}
      />

      <header className="flex flex-col sm:flex-row justify-between items-center w-full mb-6 gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-brand-green-900">{t.adminDashboardTitle}</h1>
        <div className="flex items-center gap-2 sm:gap-3 text-sm">
          <span className="text-brand-green-800 font-semibold">{t.welcomeMessage(adminUser)}</span>
          <LanguageSwitcher currentLanguage={language} onToggle={toggleLanguage} />
          <button
              onClick={handleExport}
              className="px-3 py-2 font-semibold bg-blue-100 text-blue-800 rounded-lg shadow-sm hover:bg-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label={t.exportButton}
          >{t.exportButton}</button>
          <button
              onClick={handleTriggerImport}
              className="px-3 py-2 font-semibold bg-green-100 text-green-800 rounded-lg shadow-sm hover:bg-green-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              aria-label={t.importButton}
          >{t.importButton}</button>
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
        </section>

        {/* Existing Users Section */}
        <section>
          <h2 className="text-xl font-bold text-brand-green-800 mb-4">{t.existingUsersTitle}</h2>
          
          {users.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-grow">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchUsersPlaceholder}
                  className="w-full pl-10 pr-4 py-2 border border-brand-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green-500"
                />
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <label htmlFor="sort-select" className="text-sm font-medium text-brand-green-700">{t.sortByLabel}</label>
                <select
                  id="sort-select"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="px-3 py-2 border border-brand-green-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500"
                >
                  <option value="username-asc">{t.sortUsernameAZ}</option>
                  <option value="username-desc">{t.sortUsernameZA}</option>
                  <option value="stamps-asc">{t.sortStampsLowHigh}</option>
                  <option value="stamps-desc">{t.sortStampsHighLow}</option>
                </select>
              </div>
            </div>
          )}

          {users.length > 0 ? (
            <div className="max-h-96 overflow-y-auto bg-brand-green-50 p-3 sm:p-4 rounded-xl space-y-3">
              {displayedUsers.length > 0 ? (
                displayedUsers.map((user) => (
                  <div key={user.username} className="flex flex-col sm:flex-row justify-between items-center bg-white p-3 rounded-lg shadow-sm gap-3">
                    <div className="flex-1 text-center sm:text-left">
                      <span className="font-semibold text-brand-green-900">
                        {user.username}
                      </span>
                      <span className={`inline-block text-sm sm:inline sm:ml-3 text-white bg-brand-green-700 px-3 py-1 rounded-full ${
                        updatedStamp?.username === user.username ? `stamp-${updatedStamp.change}` : ''
                      }`}>
                        {`${user.stamps} / 15`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
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
                          onClick={() => onViewUser(user.username)}
                          className="px-3 py-1 text-xs font-semibold text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200 transition-colors"
                          aria-label={`View card for ${user.username}`}
                        >
                          {t.viewCardButton}
                        </button>
                        <button
                          onClick={() => setShareModalUser(user.username)}
                          className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
                          aria-label={t.shareUserButtonLabel(user.username)}
                        >
                          {t.shareButton}
                        </button>
                        <button 
                            onClick={() => setConfirmation({ action: 'reset', username: user.username })}
                            className="px-3 py-1 text-xs font-semibold text-amber-700 bg-amber-100 rounded-md hover:bg-amber-200 transition-colors"
                        >
                            {t.resetUserStampsButton}
                        </button>
                        <button
                          onClick={() => setConfirmation({ action: 'remove', username: user.username })}
                          className="px-3 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
                        >
                          {t.removeUserButton}
                        </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-brand-green-600 text-center py-4">No users found matching your search.</p>
              )}
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
       <style>{`
          @keyframes stamp-add-anim {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); background-color: #47826e; } /* brand-green-600 */
            100% { transform: scale(1); }
          }
          .stamp-add {
            animation: stamp-add-anim 0.5s ease-in-out;
          }

          @keyframes stamp-remove-anim {
            0% { transform: scale(1); }
            50% { transform: scale(0.9); background-color: #264a3e; } /* brand-green-800 */
            100% { transform: scale(1); }
          }
          .stamp-remove {
            animation: stamp-remove-anim 0.5s ease-in-out;
          }
      `}</style>
    </div>
  );
};
