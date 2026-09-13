import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ArrowRight, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { useForensics } from '../context/ForensicContext';

export const CyberNotificationPopup = () => {
  const navigate = useNavigate();
  const { 
    activePopupNotification, 
    dismissPopupNotification, 
    checkTaskFromNotification 
  } = useForensics();

  useEffect(() => {
    if (activePopupNotification) {
      const timer = setTimeout(() => {
        dismissPopupNotification();
      }, 12000);
      return () => clearTimeout(timer);
    }
  }, [activePopupNotification, dismissPopupNotification]);

  if (!activePopupNotification) return null;

  const { taskId, taskTitle, snippet, timestamp } = activePopupNotification;

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full animate-in slide-in-from-top-3 duration-300">
      <div className="rounded-xl border border-cyan-500/30 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-xl text-slate-100 relative overflow-hidden">
        
        {/* Subtle accent border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
              <Bell className="w-4 h-4 animate-bounce" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wide">
                  New Submission
                </span>
                <span className="text-[10px] text-slate-500">
                  {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <h3 className="text-xs font-bold text-white">
                {taskTitle}
              </h3>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {snippet || 'Your brother has submitted their task. Click to review.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={dismissPopupNotification}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-md hover:bg-slate-800 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-end">
          <button
            type="button"
            onClick={() => {
              checkTaskFromNotification(taskId);
              navigate('/admin/submissions');
            }}
            className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <span>Review Submission</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default CyberNotificationPopup;
