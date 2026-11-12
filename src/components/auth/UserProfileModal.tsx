import React, { useState, useEffect } from 'react';
import { Database, LogOut, CheckCircle2, X } from 'lucide-react';
import { useAuth } from '@/src/lib/supabase/AuthContext';

export const UserProfileModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { user, profile, isConfigured, updateProfile, signOut } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFullName(profile?.full_name || user?.email?.split('@')[0] || 'Farmer');
      setStatusMessage('');
    }
  }, [isOpen, profile, user]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    setStatusMessage('');

    try {
      const { error } = await updateProfile({ full_name: fullName.trim() || 'Farmer' });
      if (error) {
        setStatusMessage(error);
      } else {
        setStatusMessage('Profile updated successfully!');
        setTimeout(() => setStatusMessage(''), 2500);
      }
    } catch (err: any) {
      setStatusMessage(err?.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#F8F7F0] border border-[#DCE2D8] rounded-2xl shadow-2xl p-6 sm:p-7 text-[#243428]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#DCE2D8] mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#193D25] text-white flex items-center justify-center font-bold text-sm">
              {profile?.full_name?.charAt(0).toUpperCase() ||
                user?.email?.charAt(0).toUpperCase() ||
                'F'}
            </div>
            <div>
              <h3 className="font-semibold text-base sm:text-lg text-[#193D25]">
                {profile?.full_name || 'Farmer Account'}
              </h3>
              <p className="text-xs text-[#697568]">{user?.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#697568] hover:text-[#193D25] rounded-full hover:bg-[#DDE8D8]/60 transition-colors cursor-pointer"
            aria-label="Close profile dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sync Status */}
        <div className="mb-5 p-3 rounded-xl bg-[#EDF1EA] border border-[#DCE2D8] text-xs text-[#193D25] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#285C35]" />
            <span className="font-medium">
              {isConfigured ? 'Supabase Cloud Sync Active' : 'Built-In Account Sync Active'}
            </span>
          </div>
          <span className="text-[11px] text-[#697568] font-mono">Verified</span>
        </div>

        {statusMessage && (
          <div className="mb-4 p-2.5 rounded-xl bg-[#DDE8D8] text-[#193D25] text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#36764A] shrink-0" />
            <span className="font-medium">{statusMessage}</span>
          </div>
        )}

        {/* Profile Edit Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#243428] mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#DCE2D8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#285C35] text-[#243428]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#243428] mb-1.5">
              Email Address
            </label>
            <input
              type="text"
              readOnly
              value={user?.email || ''}
              className="w-full px-3.5 py-2 text-xs font-mono bg-[#EDF1EA] border border-[#DCE2D8] rounded-xl text-[#697568] select-all"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-2.5 px-4 bg-[#193D25] hover:bg-[#285C35] text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Profile Changes'}
            </button>
            <button
              type="button"
              onClick={async () => {
                await signOut();
                onClose();
              }}
              className="py-2.5 px-3.5 bg-white hover:bg-[#F2F1E8] border border-[#DCE2D8] text-[#243428] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-[#B94B43]" />
              <span>Sign Out</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
