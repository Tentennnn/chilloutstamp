
import type { Translations } from '../constants/translations';
import React, { useState } from 'react';

interface ShareProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  t: Translations;
}

export const ShareProfileModal: React.FC<ShareProfileModalProps> = ({ isOpen, onClose, username, t }) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const profileUrl = `${window.location.origin}/${encodeURIComponent(username)}/profile`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(profileUrl)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center relative transform transition-all opacity-0 animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'fadeInScale 0.3s forwards' }}
      >
         <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-green-500"
          aria-label={t.closeButton}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <h3 id="share-modal-title" className="text-2xl font-bold text-brand-green-900 mb-2">{t.shareProfileTitle(username)}</h3>
        <p className="text-brand-green-700 mb-6">{t.shareProfileInstructions}</p>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <img src={qrCodeUrl} alt={`QR Code for ${username}`} className="mx-auto rounded-md" width="200" height="200" />
        </div>

        <div className="flex flex-col gap-3">
            <input
                type="text"
                value={profileUrl}
                readOnly
                className="w-full text-sm px-3 py-2 border bg-gray-50 border-brand-green-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-green-500"
                aria-label="Profile URL"
                onFocus={(e) => e.target.select()}
            />
            <button
                onClick={handleCopy}
                className={`w-full py-3 px-5 text-lg font-bold rounded-xl transition-colors focus:outline-none focus:ring-4 focus:ring-brand-green-300 ${
                    copied ? 'bg-green-600 text-white cursor-default' : 'bg-brand-green-800 text-white hover:bg-brand-green-900'
                }`}
                disabled={copied}
            >
                {copied ? t.copiedButton : t.copyLinkButton}
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
