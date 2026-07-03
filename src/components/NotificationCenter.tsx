import React, { useState } from 'react';
import { Bell, BellRing, Sparkles, Check, Trash, ShieldAlert, Zap } from 'lucide-react';
import { SystemAlert, UserProfile } from '../types';

interface NotificationCenterProps {
  user: UserProfile;
  alerts: SystemAlert[];
  onMarkRead: (alertId: string) => void;
  onClearAll: () => void;
  onAddAlert: (title: string, desc: string, type: 'reward' | 'system' | 'tournament' | 'mission') => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  user,
  alerts,
  onMarkRead,
  onClearAll,
  onAddAlert
}) => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customDesc, setCustomDesc] = useState('');

  // Handle native browser notification permissions
  const handleRequestNativeNotification = () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications.');
      return;
    }

    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        setPermissionGranted(true);
        new Notification('Vortex Arcade Games', {
          body: 'Push notifications successfully synced with your device! 🕹️',
          icon: user.avatarUrl,
        });
      }
    });
  };

  // Dispatch a simulated local notification
  const triggerSimulatedNotification = () => {
    const titles = [
      '🎁 Daily Bonus Ready',
      '🏆 Leaderboard Updated',
      '⚔️ Tournament Alert',
      '🔥 Double XP Active'
    ];
    const descs = [
      'Your daily reward of 100 Coins is waiting. Claim now in your wallet!',
      'SpeedRunner99 has claimed rank #1 with 3,450 Coins. Challenge them now!',
      'The weekly Tic-Tac-Toe championship has begun! Win 3 matches to enter.',
      'Enjoy 2x Experience multiplier on all RPG clicker battles for the next hour.'
    ];
    const types: ('reward' | 'system' | 'tournament' | 'mission')[] = ['reward', 'system', 'tournament', 'mission'];

    const idx = Math.floor(Math.random() * titles.length);
    onAddAlert(titles[idx], descs[idx], types[idx]);

    // Send native if permission was granted
    if (permissionGranted || (typeof Notification !== 'undefined' && Notification.permission === 'granted')) {
      new Notification(titles[idx], {
        body: descs[idx],
        icon: user.avatarUrl,
      });
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customDesc.trim()) return;
    onAddAlert(customTitle, customDesc, 'system');
    setCustomTitle('');
    setCustomDesc('');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0e] text-slate-100 p-4 select-none h-full overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0 mb-3">
        <h2 className="text-xl font-bold font-display tracking-tight flex items-center gap-1.5 uppercase">
          <Bell className="w-5 h-5 text-blue-500 animate-pulse-slow" />
          <span>Notification Hub</span>
        </h2>
        {alerts.length > 0 && (
          <button onClick={onClearAll} className="text-[9px] text-slate-500 hover:text-red-400 flex items-center gap-1 font-mono uppercase tracking-wider">
            <Trash className="w-3.5 h-3.5" /> Clear All
          </button>
        )}
      </div>

      {/* Push Permissions Toggle */}
      <div className="bg-[#0f0f14] p-4 border border-white/10 rounded-2xl shrink-0 space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold flex items-center gap-1.5 uppercase tracking-tight">
              <BellRing className="w-4 h-4 text-blue-500" />
              <span>Native Push Alerts</span>
            </h4>
            <p className="text-[10px] text-slate-400 font-mono">Receive alerts when offline or closed</p>
          </div>
          <button
            onClick={handleRequestNativeNotification}
            disabled={permissionGranted}
            className={`py-1.5 px-3 rounded-xl text-[9px] font-mono font-bold uppercase tracking-wider transition-all ${
              permissionGranted
                ? 'bg-emerald-600/15 border border-emerald-500/30 text-emerald-400'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {permissionGranted ? 'Enabled' : 'Request'}
          </button>
        </div>

        <div className="pt-2 border-t border-white/5 flex items-center justify-between">
          <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Test notification engine</span>
          <button
            onClick={triggerSimulatedNotification}
            className="flex items-center space-x-1 py-1 px-2.5 bg-[#15151e] hover:bg-white/5 rounded-lg text-[9px] border border-white/10 font-bold font-mono uppercase tracking-wider"
          >
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span>Simulate Alert</span>
          </button>
        </div>
      </div>

      {/* Alert Logs */}
      <div className="flex-1 flex flex-col min-h-[180px] mb-4">
        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest font-mono block mb-2">
          INCOMING ALERTS ({alerts.length})
        </span>

        <div className="flex-1 bg-[#0f0f14]/60 rounded-2xl border border-white/10 p-2.5 overflow-y-auto custom-scrollbar space-y-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-2.5 rounded-xl border flex items-center justify-between ${
                alert.read
                  ? 'bg-[#15151e]/60 border-white/5 opacity-70'
                  : 'bg-[#15151e] border-blue-500/10 shadow-[0_0_8px_rgba(59,130,246,0.05)]'
              }`}
            >
              <div className="space-y-0.5 max-w-[220px]">
                <h5 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-tight">
                  {!alert.read && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>}
                  <span>{alert.title}</span>
                </h5>
                <p className="text-[10px] text-slate-400 leading-relaxed font-mono">{alert.description}</p>
                <span className="text-[9px] text-slate-500 block font-mono">
                  {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {!alert.read && (
                <button
                  onClick={() => onMarkRead(alert.id)}
                  className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 p-1.5 rounded-lg border border-blue-500/20"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}

          {alerts.length === 0 && (
            <div className="text-center py-10 text-[10px] text-slate-500 font-mono uppercase space-y-1">
              <p>No notifications on device.</p>
              <p>Click "Simulate Alert" to test triggers.</p>
            </div>
          )}
        </div>
      </div>

      {/* Administrator Custom Notification Push */}
      <form onSubmit={handleCustomSubmit} className="bg-[#0f0f14]/60 p-3.5 border border-white/10 rounded-2xl space-y-2 shrink-0">
        <label className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1 font-mono">
          <ShieldAlert className="w-3.5 h-3.5 text-blue-500" /> Admin Custom Broadcast
        </label>
        <div className="space-y-2">
          <input
            type="text"
            required
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            placeholder="Alert Title (e.g., Update Available)"
            className="w-full bg-[#15151e] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/40 font-mono"
          />
          <textarea
            required
            value={customDesc}
            onChange={(e) => setCustomDesc(e.target.value)}
            placeholder="Notification message body details..."
            rows={2}
            className="w-full bg-[#15151e] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/40 resize-none font-mono"
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold rounded-xl text-[10px] uppercase tracking-wider shadow-[0_0_8px_rgba(59,130,246,0.2)] border border-blue-400/20 transition-colors"
          >
            Broadcast Custom Code
          </button>
        </div>
      </form>
    </div>
  );
};
