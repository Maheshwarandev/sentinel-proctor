import React from 'react';
import { AlertOctagon, Volume2, VolumeX, ShieldAlert, Zap, Radio } from 'lucide-react';
import { useForensics } from '../context/ForensicContext';

export const RedLockdownBanner = () => {
  const { 
    isRedLockdownActive, 
    activeBreach, 
    disarmRedLockdown, 
    isSirenMuted, 
    toggleSirenMute 
  } = useForensics();

  if (!isRedLockdownActive) return null;

  return (
    <div className="sticky top-0 z-[100] w-full bg-gradient-to-r from-rose-950 via-red-900 to-rose-950 border-b-2 border-rose-500 text-white shadow-[0_0_50px_rgba(244,63,94,0.7)] font-mono animate-in slide-in-from-top duration-300">
      
      {/* Top flashing emergency scanline */}
      <div className="h-1 w-full bg-gradient-to-r from-red-500 via-rose-300 to-red-500 animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left: Siren & Breach Details */}
        <div className="flex items-center space-x-3 text-center md:text-left">
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-xl bg-rose-600/30 border-2 border-rose-400 flex items-center justify-center text-rose-300 shadow-[0_0_20px_#f43f5e] animate-bounce">
              <AlertOctagon className="w-6 h-6 text-white animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-90" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
            </span>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <span className="text-xs font-black tracking-widest text-rose-200 uppercase animate-pulse">
                🚨 SECURITY BREACH LOCKDOWN ACTIVE
              </span>
              <span className="text-[10px] bg-rose-500 text-slate-950 font-black px-2 py-0.5 rounded flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
                <span>TSUNAMI SIREN ACTIVE</span>
              </span>
            </div>
            <p className="text-xs font-bold text-white tracking-tight">
              {activeBreach?.reason || 'Subject cheating infraction detected in active task!'}
            </p>
            <p className="text-[10px] text-rose-300/80">
              Time of Incident: {new Date(activeBreach?.timestamp || Date.now()).toLocaleTimeString()} • Manual Physical Disarm Required
            </p>
          </div>
        </div>

        {/* Right: Controls (Mute Siren + Physical Disarm Button) */}
        <div className="flex items-center space-x-2.5 shrink-0">
          
          {/* Mute Siren Button */}
          <button
            type="button"
            onClick={toggleSirenMute}
            className="px-3 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            title={isSirenMuted ? "Unmute Tsunami Siren" : "Mute Tsunami Siren"}
          >
            {isSirenMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-rose-400" />
                <span className="text-[11px]">Unmute</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-rose-300 animate-pulse" />
                <span className="text-[11px]">Mute</span>
              </>
            )}
          </button>

          {/* THE PHYSICAL DISARM BUTTON */}
          <button
            type="button"
            onClick={disarmRedLockdown}
            className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 active:scale-95 text-slate-950 font-mono font-black text-xs tracking-wider flex items-center space-x-2 shadow-[0_0_30px_rgba(244,63,94,0.9)] border-2 border-white/60 uppercase transition-all"
          >
            <ShieldAlert className="w-4 h-4 text-slate-950 animate-spin" />
            <span>🛑 PHYSICALLY DISARM ALARM</span>
          </button>

        </div>

      </div>
    </div>
  );
};

export default RedLockdownBanner;
