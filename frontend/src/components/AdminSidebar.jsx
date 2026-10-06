import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Inbox,
  Activity,
  Archive,
  ShieldCheck,
  LogOut,
  Radio,
  X,
  Terminal,
  Zap,
  Edit3,
  Cpu
} from 'lucide-react';
import { useForensics } from '../context/ForensicContext';

const NAV_ITEMS = [
  {
    group: 'Monitor',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    ]
  },
  {
    group: 'Module Controls',
    items: [
      { label: 'Module 1: Keyboard', icon: Terminal, path: '/admin/module-1' },
      { label: 'Module 2: English Quest', icon: Zap, path: '/admin/module-2' },
      { label: 'Module 3: Handwriting', icon: Edit3, path: '/admin/module-3' },
      { label: 'Module 4: Developer & OS', icon: Cpu, path: '/admin/module-4' },
    ]
  },
  {
    group: 'Review',
    items: [
      { label: 'Archive', icon: Archive, path: '/admin/archive', badgeKey: 'archive' },
    ]
  },
];

export const AdminSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { strikes, tasks, archive = [], logoutAdmin, isRedLockdownActive } = useForensics();

  const pendingCount = tasks.filter(t => t.status === 'SUBMITTED' && !t.auditorVerdict).length;

  const getBadge = (key) => {
    if (key === 'pending' && pendingCount > 0) return pendingCount;
    if (key === 'strikes' && strikes > 0) return strikes;
    if (key === 'archive' && archive.length > 0) return archive.length;
    return null;
  };

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin' || location.pathname === '/';
    if (path === '/admin/anti-cheat') return location.pathname.startsWith('/admin/anti-cheat') || location.pathname.startsWith('/admin/telemetry');
    return location.pathname.startsWith(path);
  };

  const handleNav = (path) => {
    navigate(path);
    onClose?.();
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`admin-sidebar ${isOpen ? 'open' : ''} flex flex-col bg-surface-raised border-r border-surface-border`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-surface-border shrink-0">
          <button
            onClick={() => handleNav('/admin')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all ${
              isRedLockdownActive
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                : 'bg-accent/10 border-accent/25 text-accent group-hover:bg-accent/20'
            }`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-content-primary">
                Sentinel<span className="text-accent">.</span>Proctor
              </span>
              <div className={`text-[10px] font-medium leading-none mt-0.5 ${
                isRedLockdownActive ? 'text-rose-400' : 'text-content-muted'
              }`}>
                {isRedLockdownActive ? 'LOCKDOWN ACTIVE' : 'Supervisor Console'}
              </div>
            </div>
          </button>

          {/* Close on mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-content-muted hover:text-content-primary hover:bg-surface-base transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {NAV_ITEMS.map(({ group, items }) => (
            <div key={group}>
              <p className="text-[10px] font-semibold text-content-muted uppercase tracking-widest px-2 mb-1.5">
                {group}
              </p>
              <div className="space-y-0.5">
                {items.map(({ label, icon: Icon, path, badgeKey }) => {
                  const active = isActive(path);
                  const badge = badgeKey ? getBadge(badgeKey) : null;
                  const isDanger = badgeKey === 'strikes' && badge > 0;

                  return (
                    <button
                      key={`${path}-${label}`}
                      onClick={() => handleNav(path)}
                      className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                        active
                          ? 'bg-accent/10 text-accent'
                          : 'text-content-muted hover:text-content-primary hover:bg-surface-elevated'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-accent' : 'text-content-muted'}`} />
                        {label}
                      </span>
                      {badge !== null && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${
                          isDanger
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-accent/15 text-accent border border-accent/25'
                        }`}>
                          {badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer: user + logout */}
        <div className="shrink-0 px-3 py-4 border-t border-surface-border">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-surface-base border border-surface-border">
            <div className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/25 flex items-center justify-center text-accent text-[11px] font-bold shrink-0">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-content-primary">Admin</p>
              <p className="text-[10px] text-content-muted truncate">Supervisor</p>
            </div>
            <button
              onClick={logoutAdmin}
              title="Lock Admin Console"
              className="p-1.5 rounded-lg text-content-muted hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
