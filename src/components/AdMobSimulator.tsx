import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Volume2, Award, Zap } from 'lucide-react';

interface AdMobBannerProps {
  visible: boolean;
  onClose: () => void;
}

export const AdMobBanner: React.FC<AdMobBannerProps> = ({ visible, onClose }) => {
  const [adIndex, setAdIndex] = useState(0);

  const mockAds = [
    { title: "🤖 AI Studio Build", desc: "Build full-stack web applications with natural language prompts. Instant deploy!", cta: "Try Now" },
    { title: "⚔️ Monster Arena", desc: "Form epic guilds, raid bosses, and earn real gems in the ultimate mobile RPG!", cta: "Download" },
    { title: "🦄 Unicorn Tech", desc: "Hiring React Developers starting at $150k. Work from anywhere!", cta: "Apply" },
    { title: "🧠 Brain Teasers", desc: "Increase your IQ by 20 points! Challenge your memory and logic daily.", cta: "Play" }
  ];

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setAdIndex((prev) => (prev + 1) % mockAds.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="bg-slate-900 border-t border-slate-800 text-white py-2 px-4 flex items-center justify-between relative h-14 z-50 select-none">
      <div className="flex items-center space-x-3 overflow-hidden mr-4">
        <span className="text-[10px] bg-amber-500 text-slate-950 px-1 font-bold rounded uppercase tracking-wider">Ad</span>
        <div className="text-xs">
          <p className="font-semibold text-amber-400 truncate">{mockAds[adIndex].title}</p>
          <p className="text-[10px] text-slate-300 truncate max-w-[220px] xs:max-w-[300px]">{mockAds[adIndex].desc}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2 shrink-0">
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="text-[10px] bg-blue-600 hover:bg-blue-500 font-bold px-2 py-1 rounded transition-colors text-white uppercase"
        >
          {mockAds[adIndex].cta}
        </a>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

interface AdMobInterstitialProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdMobInterstitial: React.FC<AdMobInterstitialProps> = ({ isOpen, onClose }) => {
  const [secondsLeft, setSecondsLeft] = useState(5);

  useEffect(() => {
    if (!isOpen) return;
    setSecondsLeft(5);
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-950/95 z-[100] flex flex-col items-center justify-center p-6 text-white text-center select-none"
      >
        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-full uppercase tracking-widest font-bold mb-8">
          Interstitial Ad
        </span>

        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative"
        >
          <div className="w-20 h-20 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-violet-500/20">
            <Zap className="w-10 h-10 text-white animate-bounce" />
          </div>

          <h3 className="text-2xl font-bold font-display text-white mb-2">Vortex Premium Guilds</h3>
          <p className="text-sm text-slate-300 mb-6 leading-relaxed">
            Form alliances with over 10M players worldwide. Earn exclusive cosmetic sets, customize your citadel, and claim your place in the legend.
          </p>

          <div className="flex flex-col space-y-3">
            <button
              onClick={() => { if (secondsLeft === 0) onClose(); }}
              disabled={secondsLeft > 0}
              className={`w-full py-3.5 rounded-xl font-bold transition-all ${
                secondsLeft > 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90 active:scale-95 shadow-lg shadow-indigo-600/30'
              }`}
            >
              {secondsLeft > 0 ? `Skip Ad in ${secondsLeft}s` : 'Close and Return'}
            </button>
            <span className="text-[10px] text-slate-400">Sponsored by Vortex Ads Network</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

interface AdMobRewardedProps {
  isOpen: boolean;
  onClose: (completed: boolean) => void;
}

export const AdMobRewarded: React.FC<AdMobRewardedProps> = ({ isOpen, onClose }) => {
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(12);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setProgress(0);
    setTimeLeft(12);
    setClaimed(false);

    const duration = 12000; // 12 seconds
    const start = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
      setTimeLeft(Math.max(Math.ceil((duration - elapsed) / 1000), 0));

      if (elapsed >= duration) {
        clearInterval(interval);
        setClaimed(true);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-[100] flex flex-col justify-between p-6 text-white select-none"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
              Rewarded Video
            </span>
            <span className="text-xs text-slate-400">Watch to earn +50 Coins & +10 Gems</span>
          </div>
          <button
            onClick={() => onClose(claimed)}
            className="bg-slate-900/60 hover:bg-slate-800 p-2 rounded-full border border-slate-800/40"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Dynamic Simulated Gameplay footage */}
        <div className="flex-1 flex flex-col items-center justify-center py-8">
          <div className="w-full max-w-sm aspect-video bg-gradient-to-tr from-indigo-950 via-slate-900 to-emerald-950 border border-slate-800 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center p-6 shadow-2xl">
            {/* Pulsing Game Simulator Graphics */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="text-6xl mb-4"
            >
              🦄
            </motion.div>
            <h4 className="text-xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400">
              Unicorn Match Saga
            </h4>
            <p className="text-xs text-slate-400 mt-2 text-center">Simulated Ad Content Playing...</p>

            <div className="absolute bottom-4 left-4 flex items-center space-x-2 text-slate-500 text-[10px]">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Realistic Game Ad Engine</span>
            </div>
          </div>
        </div>

        {/* Bottom Control and Loading bar */}
        <div className="w-full max-w-md mx-auto space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{timeLeft > 0 ? `Securing Reward in ${timeLeft}s` : 'Reward Unlocked! Claim Now'}</span>
            <span className="font-bold text-amber-400 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> +50 Coins, +10 Gems
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <button
            onClick={() => onClose(claimed)}
            className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center space-x-2 ${
              claimed
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:opacity-95 shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
            disabled={!claimed}
          >
            <Award className="w-5 h-5" />
            <span>{claimed ? 'Claim Your 50 Coins & 10 Gems' : 'Please Watch Entire Video'}</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
