import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Inbox, 
  Copy, 
  Check, 
  LogOut, 
  Share2, 
  Activity, 
  Archive, 
  Sun, 
  Moon,
  Wifi,
  Laptop,
  ChevronDown,
  X,
  ExternalLink,
  Sparkles,
  Radio,
  Sliders
} from 'lucide-react';
import { useForensics } from '../context/ForensicContext';
import { useNavigate, useLocation } from 'react-router-dom';

export const CyberHeader = () => {
  const { 
    tasks, 
    strikes, 
    isAdminAuthenticated, 
    logoutAdmin, 
    notifications, 
    isRedLockdownActive,
    archive = [],
    theme,
    toggleTheme
  } = useForensics();
  
  const navigate = useNavigate();
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  const [copiedType, setCopiedType] = useState(null); // 'lan' | 'local' | 'test' | 'hub'
  const [networkInfo, setNetworkInfo] = useState(null);
  const [showShareDropdown, setShowShareDropdown] = useState(false);

  useEffect(() => {
    fetch('/api/network-info')
      .then(r => r.json())
      .then(d => {
        if (d?.success) setNetworkInfo(d);
      })
      .catch(() => {});
  }, []);

  const isDashboard = location.pathname === '/admin' || location.pathname === '/';
  const isSubmissions = location.pathname.startsWith('/admin/submissions') || location.pathname.startsWith('/admin/finished-tasks');
  const isAntiCheat = location.pathname.startsWith('/admin/anti-cheat') || location.pathname.startsWith('/admin/telemetry');
  const isArchive = location.pathname.startsWith('/admin/archive');

  const unreadCount = notifications.filter(n => !n.read).length;
  const completedCount = tasks.filter(t => t.status === 'SUBMITTED' || t.status === 'VERIFIED').length;

  const getCandidateTestLink = () => {
    if (networkInfo?.onlineCandidateUrl) return networkInfo.onlineCandidateUrl;
    return `${window.location.origin}/test`;
  };

  const getCandidateHubLink = () => {
    return `${window.location.origin}/candidate`;
  };

  const copyLink = (type = 'test') => {
    const url = type === 'hub' ? getCandidateHubLink() : getCandidateTestLink();
    navigator.clipboard.writeText(url);
    setCopiedType(type);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setCopiedType(null);
    }, 2400);
  };

  const handleQuickShare = () => {
    copyLink('test');
    setShowShareDropdown(prev => !prev);
  };

  const handleAdminGateClick = () => {
    navigate('/admin');
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 font-['Plus_Jakarta_Sans',sans-serif] ${
      isRedLockdownActive 
        ? 'border-b border-rose-600/60 bg-rose-950/95 shadow-[0_4px_40px_rgba(244,63,94,0.35)]' 
        : 'border-b border-white/[0.07] bg-slate-950/80 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left Section: Brand & Primary Navigation Tabs */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          
          {/* Brand Logo & Workspace */}
          <div 
            onClick={() => navigate('/admin')}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${
              isRedLockdownActive 
                ? 'bg-rose-500/20 border border-rose-500/50 text-rose-400 animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.3)]' 
                : 'bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)] group-hover:scale-105'
            }`}>
              <ShieldCheck className="w-5 h-5 stroke-[2]" />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-extrabold text-white tracking-tight">
                Sentinel<span className="text-cyan-400">.</span>Proctor
              </span>
              
              <div className={`hidden md:flex items-center space-x-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                isRedLockdownActive
                  ? 'bg-rose-950/60 text-rose-200 border-rose-500/50 animate-pulse'
                  : 'bg-white/[0.04] text-slate-300 border-white/[0.08]'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isRedLockdownActive ? 'bg-rose-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
                <span>{isRedLockdownActive ? 'RED LOCKDOWN' : 'LIVE COMMAND'}</span>
              </div>
            </div>
          </div>

          {/* PRIMARY NAVIGATION PILLS */}
          {isAdminAuthenticated && (
            <nav className="hidden lg:flex items-center space-x-1 pl-4 border-l border-white/[0.08]">
              
              {/* TAB 1: DASHBOARD */}
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isDashboard
                    ? 'bg-gradient-to-r from-cyan-500/15 to-indigo-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                <LayoutDashboard className={`w-3.5 h-3.5 ${isDashboard ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>Dashboard</span>
              </button>

              {/* TAB 2: SUBMISSIONS BOX */}
              <button
                type="button"
                onClick={() => navigate('/admin/submissions')}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSubmissions
                    ? 'bg-gradient-to-r from-cyan-500/15 to-teal-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                <Inbox className={`w-3.5 h-3.5 ${isSubmissions ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>Submissions</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black font-mono transition-all ${
                  isSubmissions
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                    : 'bg-white/[0.06] text-slate-300 border border-white/[0.06]'
                }`}>
                  {completedCount}
                </span>
              </button>

              {/* TAB 3: ANTI-CHEAT */}
              <button
                type="button"
                onClick={() => navigate('/admin/anti-cheat')}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isAntiCheat
                    ? 'bg-gradient-to-r from-teal-500/15 to-emerald-500/15 text-teal-300 border border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.15)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                <Activity className={`w-3.5 h-3.5 ${isAntiCheat ? 'text-teal-400' : 'text-slate-400'}`} />
                <span>Anti-Cheat & CCTV</span>
                {strikes > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-mono font-black animate-pulse">
                    {strikes}
                  </span>
                )}
              </button>

              {/* TAB 4: ARCHIVE */}
              <button
                type="button"
                onClick={() => navigate('/admin/archive')}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isArchive
                    ? 'bg-gradient-to-r from-indigo-500/15 to-violet-500/15 text-indigo-300 border border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                <Archive className={`w-3.5 h-3.5 ${isArchive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>Archive</span>
                {archive.length > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black ${
                    isArchive
                      ? 'bg-indigo-500 text-white'
                      : 'bg-white/[0.06] text-slate-300 border border-white/[0.06]'
                  }`}>
                    {archive.length}
                  </span>
                )}
              </button>

            </nav>
          )}

        </div>

        {/* Right Section: Theme Toggle, Quick Share Pill, Admin Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Theme Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900 shadow-sm'
                : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-slate-300'
            }`}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline text-[11px]">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline text-[11px]">Dark</span>
              </>
            )}
          </button>

          {isAdminAuthenticated ? (
            <>
              {/* Dispatch Link Share Popover */}
              <div className="relative">
                <button
                  type="button"
                  onClick={handleQuickShare}
                  className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/10 via-cyan-500/15 to-indigo-500/10 hover:from-cyan-500/20 hover:to-indigo-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                  title="Share candidate assessment link"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="hidden sm:inline">Dispatch Link</span>
                      <ChevronDown className="w-3 h-3 text-cyan-400/80" />
                    </>
                  )}
                </button>

                {/* Modern Glass Popover for Link Sharing */}
                {showShareDropdown && (
                  <div className="absolute right-0 mt-2.5 w-80 sm:w-96 rounded-3xl bg-slate-950/95 border border-white/[0.1] p-5 shadow-[0_25px_60px_rgba(0,0,0,0.85)] z-50 animate-in fade-in slide-in-from-top-2 backdrop-blur-2xl">
                    <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-3.5">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                          <Wifi className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold text-white tracking-tight">Multi-Device Assessment Links</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowShareDropdown(false)}
                        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.06] transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-3 text-left">
                      {/* Option 1: Direct Assessment Test Link */}
                      <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 space-y-2 relative overflow-hidden">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-cyan-300 flex items-center space-x-1.5">
                            <Laptop className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Direct Brother Assessment</span>
                          </span>
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold border border-cyan-500/30">
                            PRIMARY
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            readOnly
                            value={getCandidateTestLink()}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/[0.08] text-[11px] font-mono text-cyan-200 select-all focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => copyLink('test')}
                            className="px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition-all flex-shrink-0 cursor-pointer shadow-sm active:scale-95"
                          >
                            {copied && copiedType === 'test' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copied && copiedType === 'test' ? 'Done' : 'Copy'}</span>
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-tight">
                          Starts test directly with live camera feed and anti-cheat proctoring.
                        </p>
                      </div>

                      {/* Option 2: Candidate Hub (All 3 Modules) */}
                      <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-medium text-slate-300">
                            Candidate Hub (All 3 Modules)
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            readOnly
                            value={getCandidateHubLink()}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/[0.06] text-[10px] font-mono text-slate-300 select-all focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => copyLink('hub')}
                            className="px-2.5 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.12] text-slate-200 text-[11px] font-semibold flex items-center space-x-1 transition-all flex-shrink-0 cursor-pointer active:scale-95"
                          >
                            {copied && copiedType === 'hub' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copied && copiedType === 'hub' ? 'Done' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Pill & Lock Button */}
              <div className="flex items-center space-x-2 pl-2 border-l border-white/[0.08]">
                <div className="flex items-center space-x-2 px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 text-[11px] font-black">
                    A
                  </div>
                  <span className="text-xs font-semibold text-slate-200 hidden md:inline">Admin</span>
                </div>
                
                <button
                  onClick={logoutAdmin}
                  title="Lock Admin Console"
                  className="p-2 rounded-xl bg-white/[0.03] hover:bg-rose-500/15 hover:text-rose-400 text-slate-400 border border-white/[0.06] hover:border-rose-500/30 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={handleAdminGateClick}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <span>Supervisor Login</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};

export default CyberHeader;
