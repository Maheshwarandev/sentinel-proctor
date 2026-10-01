import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ForensicProvider } from './context/ForensicContext';
import { AdminLayout } from './components/AdminLayout';
import { SubjectHub } from './components/SubjectHub';
import { AdminGate } from './components/AdminGate';
import { EnglishQuizModal } from './components/EnglishQuizModal';

function AppLayout() {
  const location = useLocation();

  // Candidate routes — distraction-free, no admin chrome
  const candidateRoutes = ['/candidate', '/test', '/brother', '/quiz', '/exercise', '/subject'];
  const isCandidateRoute = candidateRoutes.some(path =>
    location.pathname === path || location.pathname.startsWith(`${path}/`)
  );

  if (isCandidateRoute) {
    // Candidate: clean dark shell, no sidebar or admin chrome
    return (
      <div className="h-screen max-h-screen overflow-hidden flex flex-col font-['Plus_Jakarta_Sans',sans-serif] bg-[#080c14] text-slate-100">
        <Routes>
          <Route path="/test" element={<SubjectHub />} />
          <Route path="/candidate" element={<SubjectHub />} />
          <Route path="/brother" element={<SubjectHub />} />
          <Route path="/subject" element={<SubjectHub />} />
          <Route path="/exercise" element={<SubjectHub />} />
          <Route path="/exercise/english" element={<EnglishQuizModal isOpen={true} onClose={() => window.location.href = '/test'} />} />
          <Route path="/quiz" element={<EnglishQuizModal isOpen={true} onClose={() => window.location.href = '/test'} />} />
        </Routes>
      </div>
    );
  }

  // Admin routes — wrapped in AdminLayout (sidebar + lockdown banner + mobile bar)
  return (
    <AdminLayout>
      <Routes>
        {/* Default root (/) is Admin Gate */}
        <Route path="/" element={<AdminGate />} />
        <Route path="/admin" element={<AdminGate />} />
        <Route path="/admin/submissions" element={<AdminGate />} />
        <Route path="/admin/finished-tasks" element={<AdminGate />} />
        <Route path="/admin/anti-cheat" element={<AdminGate />} />
        <Route path="/admin/telemetry" element={<AdminGate />} />
        <Route path="/admin/archive" element={<AdminGate />} />
        <Route path="/admin/module-1" element={<AdminGate />} />
        <Route path="/admin/module-2" element={<AdminGate />} />
        <Route path="/admin/module-3" element={<AdminGate />} />
        <Route path="/admin/module-4" element={<AdminGate />} />
        {/* Fallback redirect to admin gate */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AdminLayout>
  );
}

export function App() {
  return (
    <ForensicProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppLayout />
      </BrowserRouter>
    </ForensicProvider>
  );
}

export default App;
