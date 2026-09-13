import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ForensicProvider, useForensics } from './context/ForensicContext';
import { CyberHeader } from './components/CyberHeader';
import { RedLockdownBanner } from './components/RedLockdownBanner';
import { SubjectHub } from './components/SubjectHub';
import { AdminGate } from './components/AdminGate';
import { EnglishQuizModal } from './components/EnglishQuizModal';

function AppLayout() {
  const location = useLocation();
  const { isRedLockdownActive, theme } = useForensics();
  // Candidate routes are strictly isolated for Brother - distraction-free, zero upper navbar
  const candidateRoutes = ['/candidate', '/test', '/brother', '/quiz', '/exercise', '/subject'];
  const isCandidateRoute = candidateRoutes.some(path => 
    location.pathname === path || location.pathname.startsWith(`${path}/`)
  );
  // Default root '/' and any /admin routes are dedicated to the Admin Supervisor
  const isAdminRoute = !isCandidateRoute;

  return (
    <div className={`${!isAdminRoute ? 'h-screen max-h-screen overflow-hidden' : 'min-h-screen'} flex flex-col font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-500 relative ${
      isAdminRoute && isRedLockdownActive
        ? 'bg-[#150205] text-rose-100 selection:bg-rose-600 selection:text-white'
        : theme === 'light'
        ? 'bg-[#f6f8fb] text-slate-800 selection:bg-cyan-600 selection:text-white'
        : 'bg-[#080c14] text-slate-100 selection:bg-cyan-500 selection:text-black'
    }`}>
      {/* Ominous Flashing Red Border & Siren Ambient Glow across Admin Dashboard */}
      {isAdminRoute && isRedLockdownActive && (
        <div className="fixed inset-0 pointer-events-none z-40 border-[5px] border-rose-600/70 shadow-[inset_0_0_120px_rgba(244,63,94,0.4)] animate-pulse" />
      )}

      {/* Red Lockdown Emergency Banner with PHYSICAL DISARM BUTTON */}
      {isAdminRoute && <RedLockdownBanner />}

      {/* Upper navbar only renders in Admin Enclave; completely removed for Brother */}
      {isAdminRoute && <CyberHeader />}

      <main className={`flex-1 flex flex-col min-h-0 ${!isAdminRoute ? 'overflow-hidden' : ''}`}>
        <Routes>
          {/* Candidate Direct Links - Dedicated links supervisor gives to Brother */}
          <Route path="/test" element={<SubjectHub />} />
          <Route path="/candidate" element={<SubjectHub />} />
          <Route path="/brother" element={<SubjectHub />} />
          <Route path="/subject" element={<SubjectHub />} />
          <Route path="/exercise" element={<SubjectHub />} />
          <Route path="/exercise/english" element={<EnglishQuizModal isOpen={true} onClose={() => window.location.href = '/test'} />} />
          <Route path="/quiz" element={<EnglishQuizModal isOpen={true} onClose={() => window.location.href = '/test'} />} />

          {/* Admin Protected Gate - DEFAULT Render root (/) is Admin */}
          <Route path="/" element={<AdminGate />} />
          <Route path="/admin" element={<AdminGate />} />
          <Route path="/admin/submissions" element={<AdminGate />} />
          <Route path="/admin/finished-tasks" element={<AdminGate />} />
          <Route path="/admin/anti-cheat" element={<AdminGate />} />
          <Route path="/admin/telemetry" element={<AdminGate />} />
          <Route path="/admin/archive" element={<AdminGate />} />

          {/* Any other link redirects directly to default Admin Gate */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export function App() {
  return (
    <ForensicProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </ForensicProvider>
  );
}

export default App;
