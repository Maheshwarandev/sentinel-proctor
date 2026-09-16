import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Lock, ArrowRight, AlertCircle, Eye, EyeOff, ShieldCheck, Sparkles, KeyRound, Cpu, ShieldAlert } from 'lucide-react';
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
    e?.preventDefault();
    setError('');
    const success = loginAdmin(passcode);
    if (!success) {
      setError('Invalid passcode. Clearance denied.');
      setPasscode('');
    }
  };

  const handleQuickFill = () => {
    setPasscode('admin123');
    loginAdmin('admin123');
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center p-4 relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/70 border border-white/[0.09] rounded-3xl p-8 sm:p-9 shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl relative overflow-hidden">
        
        {/* Top Accent Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />

        <div className="text-center mb-7">
          {/* Hexagonal / Radial Shield Icon with Pulsing Beacon */}
          <div className="relative inline-block mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-slate-800 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.25)]">
              <ShieldCheck className="w-8 h-8 stroke-[1.75]" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-900" />
            </span>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/[0.04] text-cyan-300 text-[11px] font-semibold border border-white/[0.08] mb-3">
            <Cpu className="w-3 h-3 text-cyan-400" />
            <span>SENTINEL COMMAND CLEARANCE</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Supervisor Gateway
          </h1>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-xs mx-auto">
            Restricted access terminal for reviewing candidate submissions, proctor CCTV, and compliance telemetry.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                <span>Security Passcode</span>
              </label>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline font-medium transition-colors"
              >
                Auto-fill (admin123)
              </button>
            </div>
            
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                autoFocus
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter security key..."
                className="w-full bg-slate-950/70 border border-white/[0.1] focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none pr-10 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center space-x-2 shadow-[0_0_25px_rgba(6,182,212,0.35)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Authorize Command Access</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>AES-256 GCM</span>
          </span>
          <span>DEFAULT: <code className="text-cyan-400 font-mono font-bold bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.06]">admin123</code></span>
        </div>

      </div>
    </div>
  );
};

export default AdminGate;
