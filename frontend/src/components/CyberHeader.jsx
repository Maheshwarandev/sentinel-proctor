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
  ChevronUp,
  X,
  ExternalLink
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
  const [copiedType, setCopiedType] = useState(null); // 'lan' | 'local'
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
    // Default to copying the candidate test link directly for Brother!
    copyLink('test');
    setShowShareDropdown(prev => !prev);
  };

  const handleAdminGateClick = () => {
    navigate('/admin');
  };

  return (
    <header className={`sticky top-0 z-50 border-b transition-colors duration-300 font-['Plus_Jakarta_Sans',sans-serif] ${
      isRedLockdownActive 
        ? 'border-rose-900/80 bg-rose-950/95 shadow-[0_4px_30px_rgba(244,63,94,0.3)]' 
        : 'border-slate-800/80 bg-slate-950/90 backdrop-blur-xl'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left Section: Brand & Primary 3-Tab Navigation Bar */}
        <div className="flex items-center space-x-4">
          
          {/* Brand Logo & Workspace */}
          <div className="flex items-center space-x-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm ${
              isRedLockdownActive 
                ? 'bg-rose-500/20 border border-rose-500/50 text-rose-400 animate-pulse' 
                : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
            }`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-white tracking-tight">
                Sentinel
              </span>
              <span className="text-slate-600 hidden sm:inline">/</span>
              <div className={`hidden sm:flex items-center space-x-1.5 text-xs font-medium px-2 py-1 rounded-md border ${
                isRedLockdownActive
                  ? 'bg-rose-900/40 text-rose-200 border-rose-700/60 animate-pulse'
                  : 'bg-slate-900 text-slate-300 border-slate-800'
              }`}>
                <span>Brother Discipline</span>
                <span className={`w-1.5 h-1.5 rounded-full ${isRedLockdownActive ? 'bg-rose-400 animate-ping' : 'bg-emerald-400'}`} />
              </div>
              {isRedLockdownActive && (
                <span className="text-[10px] font-black bg-rose-500 text-slate-950 px-2 py-0.5 rounded-full animate-bounce">
                  🚨 LOCKDOWN ON
                </span>
              )}
            </div>
          </div>

          {/* PRIMARY NAVIGATION BAR: DASHBOARD | SUBMISSIONS BOX | ANTI-CHEAT */}
          {isAdminAuthenticated && (
            <nav className="flex items-center space-x-1 pl-3 sm:pl-4 border-l border-slate-800">
              
              {/* TAB 1: DASHBOARD */}
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isDashboard
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700/80'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
                <span>Dashboard</span>
              </button>

              {/* TAB 2: SUBMISSIONS BOX */}
              <button
                type="button"
                onClick={() => navigate('/admin/submissions')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSubmissions
                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Inbox className="w-3.5 h-3.5 text-cyan-400" />
                <span>Submissions Box</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                  isSubmissions
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-slate-800 text-slate-300'
                }`}>
                  {completedCount}
                </span>
              </button>

              {/* TAB 3: ANTI-CHEAT */}
              <button
                type="button"
                onClick={() => navigate('/admin/anti-cheat')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isAntiCheat
                    ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-teal-400" />
                <span>Anti-Cheat</span>
                {strikes > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-extrabold">
                    {strikes}
                  </span>
                )}
              </button>

              {/* TAB 4: DAILY ARCHIVE */}
              <button
                type="button"
                onClick={() => navigate('/admin/archive')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isArchive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Archive className="w-3.5 h-3.5 text-emerald-400" />
                <span>Archive</span>
                {archive.length > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                    isArchive
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {archive.length}
                  </span>
                )}
              </button>

            </nav>
          )}

        </div>

        {/* Right Section: Theme Switcher, Share Link, and User Profile */}
        <div className="flex items-center space-x-2.5">
          
          {/* Aesthetic Theme Switcher Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              theme === 'light'
                ? 'bg-amber-50 hover:bg-amber-100/90 border-amber-200 text-amber-900 shadow-sm'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
            }`}
            title={theme === 'light' ? 'Switch to Cyber Dark Mode' : 'Switch to Aesthetic Light Mode'}
          >
            {theme === 'light' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          {isAdminAuthenticated ? (
            <>
              {/* Multi-Device Share Brother Link Popover */}
              <div className="relative">
                <button
                  type="button"
                  onClick={handleQuickShare}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-medium transition-all cursor-pointer shadow-sm"
                  title="Share assessment link across multiple laptops or devices on same Wi-Fi"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">
                        {copiedType === 'lan' ? 'Copied Wi-Fi Link!' : 'Copied!'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="hidden sm:inline">Share Brother Link</span>
                      <ChevronDown className="w-3 h-3 text-cyan-400/80 ml-0.5" />
                    </>
                  )}
                </button>

                {/* Dropdown Modal for Multi-Laptop Link Sharing */}
                {showShareDropdown && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-950 border border-cyan-500/30 p-4 shadow-[0_15px_40px_rgba(0,0,0,0.85)] z-50 animate-in fade-in slide-in-from-top-2 backdrop-blur-xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
                      <div className="flex items-center space-x-1.5">
                        <Wifi className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-bold text-white">Multi-Device Link Sharing</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowShareDropdown(false)}
                        className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-3 text-left">
                      {/* Option 1: Direct Assessment Test Link */}
                      <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-cyan-300 flex items-center space-x-1.5">
                            <Laptop className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Brother Test Link (English Assessment)</span>
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                            RECOMMENDED
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            readOnly
                            value={getCandidateTestLink()}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-[11px] font-mono text-slate-200 select-all focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => copyLink('test')}
                            className="px-2.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-1 transition-all flex-shrink-0 cursor-pointer"
                          >
                            {copied && copiedType === 'test' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copied && copiedType === 'test' ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-tight">
                          Give this link to your brother. The test starts directly with camera and anti-cheat proctoring.
                        </p>
                      </div>

                      {/* Option 2: Candidate Hub (All 3 Modules) */}
                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
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
                            className="w-full px-2 py-1 rounded-md bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400 select-all focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => copyLink('hub')}
                            className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold flex items-center space-x-1 transition-all flex-shrink-0 cursor-pointer"
                          >
                            {copied && copiedType === 'hub' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copied && copiedType === 'hub' ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-tight">
                          Includes Typing Speed, English Assessment, and Handwritten Task modules.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar & Logout */}
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
                <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs font-semibold">
                  A
                </div>
                <button
                  onClick={logoutAdmin}
                  title="Lock Admin Session"
                  className="p-1.5 rounded-lg hover:bg-rose-500/10 hover:text-rose-400 text-slate-400 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleAdminGateClick}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium transition-all"
              >
                <span>Admin Login</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </header>
  );
};

export default CyberHeader;
