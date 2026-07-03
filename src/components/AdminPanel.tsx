import React, { useState } from 'react';
import { ShieldCheck, Users, Gamepad2, Award, BarChart3, Trash2, Ban, ShieldAlert, Plus, Percent, RefreshCw, Star, Coins } from 'lucide-react';
import { UserProfile, Game, WalletTransaction } from '../types';
import { GAMES_LIST } from '../data/gamesData';

interface AdminPanelProps {
  user: UserProfile;
  games: Game[];
  bannedUsers: string[];
  adImpressions: number;
  estimatedRevenue: number;
  setBannedUsers: React.Dispatch<React.SetStateAction<string[]>>;
  onSetGames: (games: Game[]) => void;
  onReward: (coins: number, gems: number, xp: number) => void;
  onAddTransaction: (tx: WalletTransaction) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  user,
  games,
  bannedUsers,
  adImpressions,
  estimatedRevenue,
  setBannedUsers,
  onSetGames,
  onReward,
  onAddTransaction
}) => {
  const [adminTab, setAdminTab] = useState<'analytics' | 'users' | 'games' | 'ads'>('analytics');
  const [bannedListLocal, setBannedListLocal] = useState<string[]>(bannedUsers);
  const [adMultiplier, setAdMultiplier] = useState(1.5);
  const [statusMessage, setStatusMessage] = useState('');

  // Mock users for admin dashboard list
  const [mockUserRecords, setMockUserRecords] = useState<any[]>([
    { id: '1', name: 'SpeedRunner99', email: 'speed@vortex.com', status: 'active', coins: 3450, xp: 7400 },
    { id: '2', name: 'PixelQueen', email: 'queen@vortex.com', status: 'active', coins: 2900, xp: 3800 },
    { id: '3', name: 'ApexGamer', email: 'apex@vortex.com', status: 'active', coins: 2150, xp: 5800 },
    { id: '4', name: 'CyberNinja', email: 'cyber@vortex.com', status: 'banned', coins: 1840, xp: 4100 },
    { id: user.id, name: user.username, email: user.email, status: 'active', coins: user.coins, xp: user.xp, isMe: true }
  ]);

  // Handle User Banning
  const handleToggleBanUser = (targetUserId: string, targetName: string) => {
    // Prevent banning self
    if (targetUserId === user.id) {
      setStatusMessage("You cannot ban yourself!");
      return;
    }

    const isCurrentlyBanned = bannedListLocal.includes(targetUserId);
    let updatedBannedList: string[];

    if (isCurrentlyBanned) {
      updatedBannedList = bannedListLocal.filter(id => id !== targetUserId);
      setStatusMessage(`User ${targetName} unbanned successfully.`);
    } else {
      updatedBannedList = [...bannedListLocal, targetUserId];
      setStatusMessage(`User ${targetName} banned successfully. Ingress revoked.`);
    }

    setBannedListLocal(updatedBannedList);
    setBannedUsers(updatedBannedList);

    setMockUserRecords(prev => prev.map(u => {
      if (u.id === targetUserId) {
        return { ...u, status: isCurrentlyBanned ? 'active' : 'banned' };
      }
      return u;
    }));
  };

  // Handle Admin awarding currencies
  const handleAwardUser = (targetUserId: string, targetName: string) => {
    setMockUserRecords(prev => prev.map(u => {
      if (u.id === targetUserId) {
        return { ...u, coins: u.coins + 500 };
      }
      return u;
    }));

    if (targetUserId === user.id) {
      onReward(500, 0, 0);
      const newTx: WalletTransaction = {
        id: `tx_admin_${Date.now()}`,
        type: 'reward',
        amount: 500,
        currency: 'coins',
        description: 'Admin Console: Awarded +500 Coins',
        date: new Date().toISOString()
      };
      onAddTransaction(newTx);
    }
    setStatusMessage(`Awarded +500 Coins to ${targetName}.`);
  };

  // Toggle game status (coming_soon, beta, active)
  const handleToggleGameStatus = (gameId: string) => {
    const updatedGames = games.map(g => {
      if (g.id === gameId) {
        const nextStatus = g.status === 'active' ? 'beta' : g.status === 'beta' ? 'coming_soon' : 'active';
        return { ...g, status: nextStatus as any };
      }
      return g;
    });
    onSetGames(updatedGames);
    setStatusMessage(`Updated game status on platform.`);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0e] text-slate-100 p-4 select-none h-full overflow-hidden">
      {/* Admin Title Banner */}
      <div className="flex items-center justify-between shrink-0 mb-3">
        <h2 className="text-sm font-bold font-mono tracking-tight flex items-center gap-1.5 text-blue-400 uppercase">
          <ShieldCheck className="w-5 h-5 text-blue-400 animate-pulse-slow" />
          <span>Vortex Console (Admin)</span>
        </h2>
        <span className="text-[8px] bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
          Developer Access
        </span>
      </div>

      {statusMessage && (
        <div className="p-2 bg-blue-950/40 border border-blue-500/20 rounded-xl text-[10px] font-mono text-center text-blue-300 mb-3 uppercase">
          {statusMessage}
        </div>
      )}

      {/* Admin Horizontal Tabs */}
      <div className="grid grid-cols-4 bg-[#0f0f14] p-1 rounded-xl border border-white/10 shrink-0 mb-3 text-[9px] font-mono uppercase tracking-wider font-bold">
        <button
          onClick={() => { setAdminTab('analytics'); setStatusMessage(''); }}
          className={`py-1.5 rounded-lg transition-all flex flex-col items-center gap-0.5 ${
            adminTab === 'analytics' ? 'bg-blue-600 text-white shadow-[0_0_8px_rgba(59,130,246,0.3)]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Analytics</span>
        </button>
        <button
          onClick={() => { setAdminTab('users'); setStatusMessage(''); }}
          className={`py-1.5 rounded-lg transition-all flex flex-col items-center gap-0.5 ${
            adminTab === 'users' ? 'bg-blue-600 text-white shadow-[0_0_8px_rgba(59,130,246,0.3)]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Users ({mockUserRecords.length})</span>
        </button>
        <button
          onClick={() => { setAdminTab('games'); setStatusMessage(''); }}
          className={`py-1.5 rounded-lg transition-all flex flex-col items-center gap-0.5 ${
            adminTab === 'games' ? 'bg-blue-600 text-white shadow-[0_0_8px_rgba(59,130,246,0.3)]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Games</span>
        </button>
        <button
          onClick={() => { setAdminTab('ads'); setStatusMessage(''); }}
          className={`py-1.5 rounded-lg transition-all flex flex-col items-center gap-0.5 ${
            adminTab === 'ads' ? 'bg-blue-600 text-white shadow-[0_0_8px_rgba(59,130,246,0.3)]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Percent className="w-3.5 h-3.5" />
          <span>AdMob</span>
        </button>
      </div>

      {/* VIEWPORT AREA */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">

        {/* 1. ANALYTICS GRAPHS VIEW (CUSTOM SVG SHAPES) */}
        {adminTab === 'analytics' && (
          <div className="space-y-4 py-1">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-[#0f0f14] p-2.5 border border-white/10 rounded-xl text-center">
                <p className="text-[8px] text-slate-500 uppercase font-bold font-mono tracking-wider">Active DAU</p>
                <p className="text-xs font-black font-mono text-white mt-1">1,420</p>
                <span className="text-[8px] font-mono text-emerald-400">+12.4%</span>
              </div>
              <div className="bg-[#0f0f14] p-2.5 border border-white/10 rounded-xl text-center">
                <p className="text-[8px] text-slate-500 uppercase font-bold font-mono tracking-wider">Total Ad Rev</p>
                <p className="text-xs font-black font-mono text-emerald-400 mt-1">${estimatedRevenue.toFixed(2)}</p>
                <span className="text-[8px] font-mono text-slate-500">eCPM: $4.50</span>
              </div>
              <div className="bg-[#0f0f14] p-2.5 border border-white/10 rounded-xl text-center">
                <p className="text-[8px] text-slate-500 uppercase font-bold font-mono tracking-wider">Impressions</p>
                <p className="text-xs font-black font-mono text-white mt-1">{adImpressions}</p>
                <span className="text-[8px] font-mono text-blue-400">Rewarded</span>
              </div>
            </div>

            {/* Daily Active Users SVG Trend Graph */}
            <div className="bg-[#0f0f14] p-3.5 border border-white/10 rounded-2xl space-y-1">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest font-mono block">
                Daily Active Users (DAU) Trend - Weekly
              </span>
              <div className="h-28 w-full bg-[#050508] rounded-xl p-2 relative flex items-end border border-white/5">
                {/* SVG Graph Path */}
                <svg className="absolute inset-0 w-full h-full p-2 overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="10" x2="100" y2="10" stroke="#111118" strokeWidth="0.5" />
                  <line x1="0" y1="20" x2="100" y2="20" stroke="#111118" strokeWidth="0.5" />

                  {/* Gradient Area under curve */}
                  <path
                    d="M 0 30 Q 15 15 30 20 T 60 10 T 90 5 L 100 5 L 100 30 Z"
                    fill="url(#chartGrad)"
                    opacity="0.15"
                  />
                  {/* Glowing Stroke line */}
                  <path
                    d="M 0 25 Q 15 15 30 20 T 60 10 T 90 5 L 100 5"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />

                  {/* Definitions */}
                  <defs>
                    <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="1" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* X Axis label row */}
                <div className="w-full flex justify-between text-[8px] text-slate-500 mt-auto select-none font-mono relative z-10 px-1">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
            </div>

            {/* Coin Generation Trend Graph */}
            <div className="bg-[#0f0f14] p-3.5 border border-white/10 rounded-2xl space-y-1">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest font-mono block">
                Currency generation across games
              </span>
              <div className="h-28 w-full bg-[#050508] rounded-xl p-2 relative flex items-end border border-white/5">
                {/* SVG Graph Path */}
                <svg className="absolute inset-0 w-full h-full p-2 overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
                  <line x1="0" y1="10" x2="100" y2="10" stroke="#111118" strokeWidth="0.5" />
                  <line x1="0" y1="20" x2="100" y2="20" stroke="#111118" strokeWidth="0.5" />

                  <path
                    d="M 0 30 Q 10 25 25 15 T 50 18 T 75 10 T 100 2 L 100 30 Z"
                    fill="url(#coinGrad)"
                    opacity="0.15"
                  />
                  <path
                    d="M 0 30 Q 10 25 25 15 T 50 18 T 75 10 T 100 2"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />

                  <defs>
                    <linearGradient id="coinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="1" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="w-full flex justify-between text-[8px] text-slate-500 mt-auto select-none font-mono relative z-10 px-1">
                  <span>Slime</span>
                  <span>Memory</span>
                  <span>Goblins</span>
                  <span>TicTacToe</span>
                  <span>BossFight</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. USER MANAGEMENT TAB */}
        {adminTab === 'users' && (
          <div className="space-y-2 py-1">
            {mockUserRecords.map((item) => (
              <div key={item.id} className="bg-[#0f0f14] p-3 border border-white/10 rounded-2xl flex items-center justify-between">
                <div className="text-left">
                  <p className="text-xs font-bold text-white flex items-center gap-1.5 font-mono uppercase tracking-tight">
                    <span>{item.name}</span>
                    {item.isMe && <span className="text-[8px] bg-blue-600 px-1 py-0.5 rounded font-black text-white font-mono uppercase">YOU</span>}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">{item.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-[9px] text-amber-500 font-mono">💰 {item.coins}</span>
                    <span className="text-[9px] text-slate-600">|</span>
                    <span className="text-[9px] text-emerald-400 font-mono">{item.xp} XP</span>
                  </div>
                </div>

                <div className="flex space-x-1.5">
                  <button
                    onClick={() => handleAwardUser(item.id, item.name)}
                    className="p-1.5 bg-[#15151e] hover:bg-white/5 text-amber-400 rounded-lg border border-white/10"
                    title="Award +500 Coins"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleToggleBanUser(item.id, item.name)}
                    disabled={item.isMe}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      item.isMe
                        ? 'bg-[#15151e]/20 border-transparent text-slate-600 cursor-not-allowed'
                        : item.status === 'banned'
                        ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20'
                        : 'bg-[#15151e] hover:bg-white/5 border-white/10 text-slate-400 hover:text-red-400'
                    }`}
                    title={item.status === 'banned' ? 'Unban User' : 'Ban User'}
                  >
                    <Ban className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. GAME MANAGEMENT TAB */}
        {adminTab === 'games' && (
          <div className="space-y-2 py-1">
            {games.map((g) => (
              <div key={g.id} className="bg-[#0f0f14] p-3 border border-white/10 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={g.thumbnail} className="w-10 h-10 rounded-xl border border-white/10 bg-[#15151e]" alt="game preview" referrerPolicy="no-referrer" />
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-white uppercase tracking-tight">{g.title}</h4>
                    <span
                      className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                        g.status === 'active'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                          : g.status === 'beta'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                          : 'bg-[#15151e] text-slate-400 border border-white/5'
                      }`}
                    >
                      {g.status}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleGameStatus(g.id)}
                  className="py-1 px-2.5 bg-[#15151e] hover:bg-white/5 font-mono font-bold rounded-xl text-[9px] uppercase tracking-wider border border-white/10 text-slate-300"
                >
                  Rotate Mode
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 4. ADMOB CONTROL TAB */}
        {adminTab === 'ads' && (
          <div className="space-y-4 py-1">
            {/* Ad Statistics Grid */}
            <div className="bg-[#0f0f14] p-4 border border-white/10 rounded-2xl space-y-3">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest font-mono block">
                Google AdMob Network Configuration
              </span>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#15151e] p-2.5 rounded-xl border border-white/5 text-left">
                  <p className="text-slate-500 text-[9px] font-mono uppercase">AD UNIT CTR</p>
                  <p className="font-mono font-bold text-white text-xs mt-0.5">2.41%</p>
                </div>
                <div className="bg-[#15151e] p-2.5 rounded-xl border border-white/5 text-left">
                  <p className="text-slate-500 text-[9px] font-mono uppercase">NETWORK FILL RATE</p>
                  <p className="font-mono font-bold text-white text-xs mt-0.5">99.8%</p>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono uppercase text-[9px]">Rewarded Multiplier:</span>
                  <span className="font-bold text-amber-400 font-mono text-[10px]">{adMultiplier}x Coins</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="3.0"
                  step="0.1"
                  value={adMultiplier}
                  onChange={(e) => setAdMultiplier(parseFloat(e.target.value))}
                  className="w-full h-1 bg-[#15151e] rounded-lg appearance-none cursor-pointer accent-blue-500 border border-white/5"
                />
              </div>
            </div>

            <div className="bg-[#0f0f14] p-4 border border-white/10 rounded-2xl">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest font-mono block mb-2">
                ACTIVE AD UNIT PLACEMENTS
              </span>
              <div className="space-y-2 text-xs">
                <div className="bg-[#15151e] p-2 border border-white/5 rounded-xl flex justify-between text-[10px] font-mono">
                  <span>Banner Ad (Bottom sticky)</span>
                  <span className="text-blue-400 font-semibold">ca-pub-39401/banner</span>
                </div>
                <div className="bg-[#15151e] p-2 border border-white/5 rounded-xl flex justify-between text-[10px] font-mono">
                  <span>Interstitial Ad (Countdown)</span>
                  <span className="text-blue-400 font-semibold">ca-pub-39401/interstitial</span>
                </div>
                <div className="bg-[#15151e] p-2 border border-white/5 rounded-xl flex justify-between text-[10px] font-mono">
                  <span>Rewarded Video Ad (Multiplier)</span>
                  <span className="text-blue-400 font-semibold">ca-pub-39401/rewarded</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
