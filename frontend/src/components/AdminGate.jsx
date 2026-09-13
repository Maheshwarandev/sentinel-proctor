import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Lock, ArrowRight, AlertCircle, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';
import { useForensics } from '../context/ForensicContext';
import { AdminIntelligenceBoard } from './AdminIntelligenceBoard';
import { SubmissionsBoxPage } from './SubmissionsBoxPage';
import { AntiCheatPage } from './AntiCheatPage';
import { DailyArchivePage } from './DailyArchivePage';

export const AdminGate = () => {
  const { isAdminAuthenticated, loginAdmin } = useForensics();
  const location = useLocation();
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (isAdminAuthenticated) {
    if (location.pathname === '/admin/anti-cheat' || location.pathname === '/admin/telemetry') {
      return <AntiCheatPage />;
    }
    if (location.pathname === '/admin/submissions' || location.pathname === '/admin/finished-tasks') {
      return <SubmissionsBoxPage />;
    }
    if (location.pathname === '/admin/archive') {
      return <DailyArchivePage />;
    }
    return <AdminIntelligenceBoard />;
  }

  const handleAuth = (e) => {
    e.preventDefault();
    setError('');
    const success = loginAdmin(passcode);
    if (!success) {
      setError('Invalid admin passcode. Please verify your credentials.');
      setPasscode('');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800/80 rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        
        {/* Subtle top ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-80" />

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-3 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-400 text-[11px] font-medium border border-slate-700/60 mb-2">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Admin Workspace</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Welcome back
          </h1>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Enter your security passcode to review brother submissions, manage tasks, and inspect compliance telemetry.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Admin Passcode
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                autoFocus
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter security passcode..."
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none pr-10 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:scale-[0.99] text-slate-950 font-semibold text-xs tracking-wide flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
          >
            <span>Sign In to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-500">
            Default Admin Passcode: <code className="text-cyan-400 font-semibold px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800">admin123</code>
          </p>
        </div>

      </div>
    </div>
  );
};

export default AdminGate;
