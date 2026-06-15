import { useState } from 'react';
import { User, Lock, Cloud, CheckCircle, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { MotionButton } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { userAPI } from '@/api/services';
import { isBackendOnline } from '@/services/backendStatus';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user } = useAuth();
  const [name, setName]   = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd]         = useState('');
  const [savingPwd, setSavingPwd]   = useState(false);

  const backendOnline = isBackendOnline();

  const saveProfile = async () => {
    setSavingProfile(true);
    try {
      const fd = new FormData();
      fd.append('name', name);
      fd.append('phone', phone);
      await userAPI.updateProfile(fd);
      toast.success('Profile updated');
    } catch {
      toast.error(backendOnline ? 'Failed to update profile' : 'Profile changes require a live backend (demo mode)');
    } finally { setSavingProfile(false); }
  };

  const savePassword = async () => {
    if (!currentPwd || newPwd.length < 6) { toast.error('Enter current password and a new password (6+ chars)'); return; }
    setSavingPwd(true);
    try {
      await userAPI.changePassword({ currentPassword: currentPwd, newPassword: newPwd });
      toast.success('Password changed');
      setCurrentPwd(''); setNewPwd('');
    } catch {
      toast.error(backendOnline ? 'Failed to change password' : 'Password changes require a live backend (demo mode)');
    } finally { setSavingPwd(false); }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-serif text-2xl text-espresso">Settings</h1>

      {!backendOnline && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="font-sans text-xs text-amber-700">You're in Demo Mode — profile and password changes won't persist without a live backend.</p>
        </div>
      )}

      {/* Profile */}
      <div className="card-premium p-6 space-y-4">
        <h2 className="font-display text-sm text-espresso flex items-center gap-2"><User size={15} /> Profile</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} />
          <Input label="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
        </div>
        <Input label="Email" value={user?.email ?? ''} disabled />
        <MotionButton onClick={saveProfile} disabled={savingProfile} className="btn-primary text-sm">
          {savingProfile ? 'Saving…' : 'Save Profile'}
        </MotionButton>
      </div>

      {/* Password */}
      <div className="card-premium p-6 space-y-4">
        <h2 className="font-display text-sm text-espresso flex items-center gap-2"><Lock size={15} /> Change Password</h2>
        <Input label="Current Password" type="password" value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} />
        <Input label="New Password" type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} />
        <MotionButton onClick={savePassword} disabled={savingPwd} className="btn-primary text-sm">
          {savingPwd ? 'Updating…' : 'Update Password'}
        </MotionButton>
      </div>

      {/* System status */}
      <div className="card-premium p-6 space-y-3">
        <h2 className="font-display text-sm text-espresso flex items-center gap-2"><Cloud size={15} /> System Status</h2>
        <div className="flex items-center justify-between py-2 border-b border-beige/30">
          <span className="font-sans text-sm text-ink-2">Backend Connection</span>
          {backendOnline ? (
            <span className="flex items-center gap-1.5 font-display text-xs text-emerald-600"><CheckCircle size={13} /> Live</span>
          ) : (
            <span className="flex items-center gap-1.5 font-display text-xs text-amber-600"><XCircle size={13} /> Demo Mode</span>
          )}
        </div>
        <p className="font-sans text-xs text-ink-3">
          Payment processing (Stripe), image uploads (Cloudinary), and Google Sign-In are configured via backend environment variables and are managed by your system administrator — not from this panel.
        </p>
      </div>
    </div>
  );
}
