import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Battery, Wifi, Signal, Info } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children, isMobileFrame, setIsMobileFrame }) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0e] text-slate-100 flex flex-col items-center justify-center p-0 md:p-4 font-sans select-none overflow-hidden">
      {/* Desktop Top Control bar */}
      <div className="hidden md:flex items-center justify-between w-full max-w-5xl bg-[#0f0f14]/80 border border-white/10 px-6 py-2 rounded-2xl mb-4 text-xs">
        <div className="flex items-center space-x-3 text-slate-300 font-display font-medium">
          <span className="text-blue-500 font-extrabold text-sm tracking-wider">🎮 VORTEX HUB</span>
          <span className="text-white/20">|</span>
          <span className="flex items-center gap-1 text-[11px] text-slate-400 uppercase font-mono tracking-tight"><Info className="w-3.5 h-3.5 text-blue-400" /> STABLE MULTIPLAYER FRAMEWORK ACTIVE - BUILD v2.4.0</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMobileFrame(true)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase tracking-wider transition-all ${
              isMobileFrame
                ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.4)] border border-blue-400/30 font-bold'
                : 'bg-[#15151e] border border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile Frame</span>
          </button>
          <button
            onClick={() => setIsMobileFrame(false)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase tracking-wider transition-all ${
              !isMobileFrame
                ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.4)] border border-blue-400/30 font-bold'
                : 'bg-[#15151e] border border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Full Desktop</span>
          </button>
        </div>
      </div>

      {isMobileFrame ? (
        /* Sleek Mobile Chassis Wrapper */
        <div className="relative mx-auto my-auto w-full max-w-[390px] h-[844px] bg-black rounded-[50px] p-3 shadow-[0_0_80px_rgba(0,0,0,0.95)] border-[6px] border-[#15151e] flex flex-col overflow-hidden">
          {/* Speaker, Front Camera (Dynamic Island Notch) */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-50 flex items-center justify-between px-4 border border-white/5">
            <div className="w-3 h-3 bg-slate-900 rounded-full border border-white/10"></div>
            <div className="w-12 h-1 bg-slate-950 rounded-full"></div>
            <div className="w-2.5 h-2.5 bg-blue-950 rounded-full"></div>
          </div>

          {/* Status Bar */}
          <div className="h-9 px-6 pt-2 pb-1 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-[#0f0f14] shrink-0 select-none border-b border-white/5">
            <span>{time}</span>
            <div className="flex items-center space-x-1.5">
              <Signal className="w-3.5 h-3.5 text-blue-500" />
              <Wifi className="w-3.5 h-3.5 text-blue-500" />
              <div className="flex items-center space-x-0.5">
                <span className="text-[9px] font-bold text-slate-400">85%</span>
                <Battery className="w-4 h-4 rotate-0 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Core Content View Inside Phone */}
          <div className="flex-1 rounded-[38px] bg-[#0a0a0e] overflow-hidden relative flex flex-col border border-white/10">
            {children}
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="h-5 bg-[#0f0f14] flex items-center justify-center shrink-0 border-t border-white/5">
            <div className="w-32 h-1 bg-slate-700 rounded-full"></div>
          </div>
        </div>
      ) : (
        /* Full Desktop Window */
        <div className="w-full max-w-5xl h-[844px] bg-[#0a0a0e] border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-[0_0_60px_rgba(0,0,0,0.9)] relative">
          {children}
        </div>
      )}
    </div>
  );
};
