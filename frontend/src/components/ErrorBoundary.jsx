import React from 'react';
import { AlertOctagon, RotateCcw, ShieldAlert } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Sentinel ErrorBoundary] Caught runtime exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleResetAndReload = () => {
    try {
      localStorage.removeItem('forensic_tasks_state');
      localStorage.removeItem('forensic_notifications_state');
      localStorage.removeItem('forensic_clean_empty_state_v3');
      localStorage.removeItem('forensic_clean_empty_state_v4');
    } catch (e) {}
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col items-center justify-center p-6 font-mono select-none">
          <div className="w-full max-w-lg p-6 sm:p-8 rounded-2xl border border-rose-500/40 bg-slate-950/90 shadow-[0_0_50px_rgba(244,63,94,0.2)] text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider">
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>Runtime Sentinel Interception</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Workstation Display Recovered
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                A client-side state discrepancy was intercepted. Click below to restore initial compliance modules and resume immediately.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-rose-300/80 text-left overflow-x-auto max-h-28">
                {this.state.error.toString()}
              </div>
            )}

            <button
              type="button"
              onClick={this.handleResetAndReload}
              className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset State & Resume Workstation</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
