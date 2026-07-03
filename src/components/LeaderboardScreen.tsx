import React, { useState } from 'react';
import { Trophy, Coins, Star, Award, Search, Sparkles } from 'lucide-react';
import { LeaderboardEntry, UserProfile } from '../types';
import { MOCK_LEADERBOARD_COINS, MOCK_LEADERBOARD_XP } from '../data/gamesData';

interface LeaderboardScreenProps {
  user: UserProfile;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ user }) => {
  const [metric, setMetric] = useState<'coins' | 'xp'>('coins');
  const [searchQuery, setSearchQuery] = useState('');

  // Assemble full lists including the current user
  const rawList = metric === 'coins' ? MOCK_LEADERBOARD_COINS : MOCK_LEADERBOARD_XP;

  // Check if current user is already in the mock lists. If not, add them dynamically based on their current balance
  const userExistsInList = rawList.some(item => item.username === user.username);
  let completeList = [...rawList];

  if (!userExistsInList) {
    const userValue = metric === 'coins' ? user.coins : user.xp;
    const userEntry: LeaderboardEntry = {
      userId: user.id,
      username: user.username,
      avatarUrl: user.avatarUrl,
      value: userValue,
      rank: 99, // default placeholder
      isPremium: user.isPremium,
    };
    completeList.push(userEntry);
  } else {
    // Update user entry with live values
    completeList = completeList.map(item => {
      if (item.userId === user.id || item.username === user.username) {
        return {
          ...item,
          value: metric === 'coins' ? user.coins : user.xp,
          isPremium: user.isPremium
        };
      }
      return item;
    });
  }

  // Sort list and re-assign ranks
  completeList.sort((a, b) => b.value - a.value);
  completeList = completeList.map((item, index) => ({
    ...item,
    rank: index + 1
  }));

  // Find user's current rank
  const currentUserEntry = completeList.find(item => item.username === user.username);

  // Filter list with search query
  const filteredList = completeList.filter(item =>
    item.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0e] text-slate-100 p-4 select-none h-full overflow-hidden">
      {/* Search & Header */}
      <div className="space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-display tracking-tight flex items-center gap-1 uppercase">
            <Trophy className="w-5 h-5 text-blue-500 animate-pulse-slow" />
            <span>Leaderboards</span>
          </h2>
          <span className="text-[9px] bg-[#15151e] border border-white/10 px-2 py-0.5 rounded font-mono text-slate-400 uppercase tracking-widest">
            SYNC: LIVE
          </span>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-2 bg-[#0f0f14] p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setMetric('coins')}
            className={`py-2 text-xs font-bold font-mono uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              metric === 'coins' ? 'bg-blue-600 text-white shadow-[0_0_8px_rgba(59,130,246,0.3)]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Coins</span>
          </button>
          <button
            onClick={() => setMetric('xp')}
            className={`py-2 text-xs font-bold font-mono uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              metric === 'xp' ? 'bg-blue-600 text-white shadow-[0_0_8px_rgba(59,130,246,0.3)]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>XP</span>
          </button>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search champion username..."
            className="w-full bg-[#0f0f14] border border-white/10 rounded-xl py-1.5 pl-9 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/40 text-slate-100 font-mono"
          />
        </div>
      </div>

      {/* Leaderboard Entries List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar my-3 space-y-1.5 pr-1">
        {filteredList.map((entry) => {
          const isCurrentUser = entry.username === user.username;
          return (
            <div
              key={entry.userId}
              className={`p-2.5 rounded-xl flex items-center justify-between border transition-all ${
                isCurrentUser
                  ? 'bg-blue-950/20 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.1)]'
                  : 'bg-[#0f0f14]/60 border border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                {/* Rank indicator */}
                <div className="w-6 text-center text-xs font-bold font-mono shrink-0">
                  {entry.rank === 1 ? (
                    <span className="text-xl">🥇</span>
                  ) : entry.rank === 2 ? (
                    <span className="text-xl">🥈</span>
                  ) : entry.rank === 3 ? (
                    <span className="text-xl">🥉</span>
                  ) : (
                    <span className="text-slate-400 text-[10px]">#{entry.rank}</span>
                  )}
                </div>

                {/* Avatar */}
                <div className="relative shrink-0">
                  <img src={entry.avatarUrl} className="w-8 h-8 rounded-full border border-white/10" alt="avatar" referrerPolicy="no-referrer" />
                  {entry.isPremium && (
                    <span className="absolute -bottom-1 -right-1 bg-blue-500 text-[8px] px-0.5 rounded font-black text-white flex items-center justify-center font-mono">
                      ★
                    </span>
                  )}
                </div>

                {/* Username */}
                <div className="min-w-0">
                  <p className={`text-xs font-semibold truncate uppercase tracking-tight ${isCurrentUser ? 'text-blue-400 font-bold font-mono' : 'text-slate-100'}`}>
                    {entry.username}
                  </p>
                  {isCurrentUser && (
                    <span className="text-[8px] text-blue-400 font-mono font-bold uppercase tracking-wider block">Your Profile</span>
                  )}
                </div>
              </div>

              {/* Value Balance */}
              <div className="text-right shrink-0">
                <p className="text-xs font-bold font-mono text-white">
                  {metric === 'coins' ? `💰 ${entry.value.toLocaleString()}` : `⭐ ${entry.value.toLocaleString()} XP`}
                </p>
              </div>
            </div>
          );
        })}

        {filteredList.length === 0 && (
          <div className="text-center py-8 text-xs text-slate-500 font-mono uppercase">No champions found.</div>
        )}
      </div>

      {/* User's Bottom Rank Sticker */}
      {currentUserEntry && (
        <div className="bg-gradient-to-r from-[#0f0f14] to-[#15151e] border border-white/10 p-3 rounded-2xl flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-lg font-bold font-mono">
              #{currentUserEntry.rank}
            </span>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-tight">Your Current Rank</p>
              <p className="text-[10px] text-slate-400 font-mono">Play games to advance higher</p>
            </div>
          </div>
          <span className="text-xs font-black text-blue-400 flex items-center gap-1 font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Lv. {user.level}
          </span>
        </div>
      )}
    </div>
  );
};
