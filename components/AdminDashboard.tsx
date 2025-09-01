
import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { User } from '../App';
import { getAllUsers, getUser, upsertUser, deleteUser, clearUsers } from '../services/api';
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
  const [openMenuUser, setOpenMenuUser] = useState<string | null>(null);
  const [importData, setImportData] = useState<User[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('username-asc');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
        const allUsers = await getAllUsers();
        setUsers(allUsers);
    } catch (e) {
        setError(t.usersLoadError);
        console.error(e);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (openMenuUser && menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setOpenMenuUser(null);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuUser]);


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

    try {
        const existingUser = await getUser(trimmedUsername);

        if (existingUser) {
          setToast({ type: 'error', content: t.userExistsError(trimmedUsername) });
        } else {
          await upsertUser({ username: trimmedUsername, stamps: 0, language: 'kh' });
          setToast({ type: 'success', content: t.userCreatedSuccess(trimmedUsername) });
          setNewUsername('');
          fetchUsers(); // Refresh list
        }
    } catch (err) {
        console.error("Failed to create user:", err);
        setToast({ type: 'error', content: t.genericApiError });
    }
  };
  
  const handleStampChange = async (username: string, amount: number) => {
    try {
        const user = await getUser(username);
        if (user) {
            const newStamps = Math.max(0, Math.min(15, user.stamps + amount));
            await upsertUser({ ...user, stamps: newStamps });
            
            // Optimistic UI update
            setUsers(currentUsers => currentUsers.map(u => u.username === username ? {...u, stamps: newStamps} : u));
        }
    } catch (err) {
        console.error("Failed to change stamp:", err);
        setToast({ type: 'error', content: t.genericApiError });
        fetchUsers(); // Re-fetch to correct state on error
    }
  };

  const handleResetUser = async (username: string) => {
    try {
        const user = await getUser(username);
        if (user) {
            await upsertUser({ ...user, stamps: 0 });
            fetchUsers();
        }
    } catch (err) {
        console.error("Failed to reset user:", err);
        setToast({ type: 'error', content: t.genericApiError });
    } finally {
        setConfirmation(null);
    }
  };

  const handleRemoveUser = async (username: string) => {
    try {
        await deleteUser(username);
        fetchUsers();
    } catch (err) {
        console.error("Failed to remove user:", err);
        setToast({ type: 'error', content: t.genericApiError });
    } finally {
        setConfirmation(null);
    }
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
      try {
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
      } catch (err) {
        console.error("Failed to export data:", err);
        setToast({ type: 'error', content: t.genericApiError });
      }
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
      event.target.value = '';
  };
  
  const handleImportConfirm = async (mode: 'merge' | 'replace') => {
    if (!importData) return;

    try {
        if (mode === 'replace') {
            await clearUsers();
        }

        for (const user of importData) {
            if(user.username && typeof user.stamps === 'number') {
               await upsertUser({
                   username: user.username.toLowerCase(),
                   stamps: Math.max(0, Math.min(15, user.stamps)),
                   language: user.language || 'kh'
               });
            }
        }
        
        setToast({ type: 'success', content: t.importSuccessMessage(importData.length) });
        setImportData(null);
        fetchUsers();
    } catch (err) {
        console.error("Failed to import data:", err);
        setToast({ type: 'error', content: t.genericApiError });
        setImportData(null);
    }
  };


  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6">
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
      
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">{t.adminDashboardTitle}</h1>
          <p className="text-brand-green-200">{t.welcomeGreeting} {adminUser}</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 text-sm self-end sm:self-center">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <aside className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-brand-green-800 mb-2">{t.createUserTitle}</h2>
                <p className="text-brand-green-600 mb-4 text-sm">{t.createUserInstructions}</p>
                <form onSubmit={handleCreateUser} className="flex flex-col gap-3">
                    <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder={t.usernamePlaceholder}
                        className="w-full px-4 py-3 border border-brand-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green-500"
                        aria-label={t.usernamePlaceholder}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full px-6 py-3 font-bold rounded-xl text-white bg-brand-green-800 hover:bg-brand-green-900 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-brand-green-300"
                    >
                        {t.createUserButton}
                    </button>
                </form>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-brand-green-800 mb-4">Data | ទិន្នន័យ</h2>
                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleTriggerImport}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 font-semibold bg-green-100 text-green-800 rounded-xl shadow-sm hover:bg-green-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        aria-label={t.importButton}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        <span>{t.importButton}</span>
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 font-semibold bg-blue-100 text-blue-800 rounded-xl shadow-sm hover:bg-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        aria-label={t.exportButton}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                        <span>{t.exportButton}</span>
                    </button>
                </div>
            </div>
        </aside>

        <main className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-brand-green-800 mb-4">{t.existingUsersTitle}</h2>
            {users.length > 0 && !isLoading && !error && (
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="relative flex-grow">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </span>
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t.searchUsersPlaceholder} className="w-full pl-10 pr-4 py-2 border border-brand-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green-500" />
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <label htmlFor="sort-select" className="text-sm font-medium text-brand-green-700">{t.sortByLabel}</label>
                        <select id="sort-select" value={sortOption} onChange={(e) => setSortOption(e.target.value as SortOption)} className="px-3 py-2 border border-brand-green-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500">
                            <option value="username-asc">{t.sortUsernameAZ}</option>
                            <option value="username-desc">{t.sortUsernameZA}</option>
                            <option value="stamps-asc">{t.sortStampsLowHigh}</option>
                            <option value="stamps-desc">{t.sortStampsHighLow}</option>
                        </select>
                    </div>
                </div>
            )}
            {isLoading ? (
                <div className="text-center py-8">
                    <svg className="animate-spin mx-auto h-8 w-8 text-brand-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                </div>
            ) : error ? (
                <div className="text-center py-8 text-red-600 bg-red-50 p-4 rounded-lg"><p>{error}</p></div>
            ) : users.length > 0 ? (
                <div className="space-y-3">
                    {displayedUsers.length > 0 ? (
                        displayedUsers.map((user) => (
                        <div key={user.username} className="bg-brand-green-50 p-4 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex-grow w-full sm:w-auto">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-lg text-brand-green-900">{user.username}</span>
                                        <span className="sm:hidden font-semibold text-brand-green-700">{`${user.stamps} / 15`}</span>
                                    </div>
                                    <div className="mt-2 flex items-center gap-3">
                                        <div className="w-full bg-brand-green-200 rounded-full h-2.5">
                                            <div className="bg-brand-green-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${(user.stamps / 15) * 100}%` }}></div>
                                        </div>
                                        <span className="hidden sm:block font-semibold text-brand-green-700 w-16 text-right">{`${user.stamps} / 15`}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 self-end sm:self-center">
                                    <button onClick={() => handleStampChange(user.username, -1)} disabled={user.stamps === 0} className="w-10 h-10 font-bold text-xl bg-white border border-brand-green-200 text-brand-green-800 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-green-100 transition-colors" aria-label={`Remove stamp from ${user.username}`}>-</button>
                                    <button onClick={() => handleStampChange(user.username, 1)} disabled={user.stamps >= 15} className="w-10 h-10 font-bold text-xl bg-white border border-brand-green-200 text-brand-green-800 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-green-100 transition-colors" aria-label={`Add stamp to ${user.username}`}>+</button>
                                    <div className="relative">
                                        <button onClick={() => setOpenMenuUser(openMenuUser === user.username ? null : user.username)} className="w-10 h-10 flex items-center justify-center bg-white border border-brand-green-200 text-brand-green-800 rounded-full hover:bg-brand-green-100 transition-colors" aria-label={`More options for ${user.username}`}>
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>
                                        </button>
                                        {openMenuUser === user.username && (
                                        <div ref={menuRef} className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 origin-top-right ring-1 ring-black ring-opacity-5 focus:outline-none animate-scale-in">
                                            <div className="py-1" role="menu" aria-orientation="vertical">
                                                <a href="#" onClick={(e) => { e.preventDefault(); onViewUser(user.username); setOpenMenuUser(null); }} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                                    <span>{t.viewCardButton}</span>
                                                </a>
                                                <a href="#" onClick={(e) => { e.preventDefault(); setShareModalUser(user.username); setOpenMenuUser(null); }} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                                                   <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path></svg>
                                                    <span>{t.shareButton}</span>
                                                </a>
                                                <a href="#" onClick={(e) => { e.preventDefault(); setConfirmation({ action: 'reset', username: user.username }); setOpenMenuUser(null); }} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                                                   <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5M20 20v-5h-5M4 4l5 5M20 20l-5-5"></path></svg>
                                                    <span>{t.resetUserStampsButton}</span>
                                                </a>
                                                <a href="#" onClick={(e) => { e.preventDefault(); setConfirmation({ action: 'remove', username: user.username }); setOpenMenuUser(null); }} className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50" role="menuitem">
                                                   <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                    <span>{t.removeUserButton}</span>
                                                </a>
                                            </div>
                                        </div>
                                        )}
                                    </div>
                                </div>
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
        </main>
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
        @keyframes scale-in {
            0% { opacity: 0; transform: scale(0.95) translateY(-5px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-scale-in { animation: scale-in 0.1s ease-out forwards; }
      `}</style>
    </div>
  );
};
