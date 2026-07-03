import React, { useState } from 'react';
import { User, Award, CheckCircle, ShieldCheck, Sparkles, RefreshCw, Star, Info } from 'lucide-react';
import { UserProfile, Achievement, DailyMission } from '../types';
import { AVATARS_LIST } from '../data/gamesData';

interface ProfileScreenProps {
  user: UserProfile;
  achievements: Achievement[];
  dailyMissions: DailyMission[];
  onClaimMission: (missionId: string) => void;
  onClaimAchievement: (achievementId: string) => void;
  onUpdateAvatar: (avatarUrl: string) => void;
  onUpdateUsername: (username: string) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  achievements,
  dailyMissions,
  onClaimMission,
  onClaimAchievement,
  onUpdateAvatar,
  onUpdateUsername
}) => {
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user.username);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  const xpNeededForNextLevel = user.level * 300;
  const xpPercent = Math.min((user.xp / xpNeededForNextLevel) * 100, 100);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    onUpdateUsername(nameInput);
    setEditingName(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0e] text-slate-100 p-4 select-none h-full overflow-y-auto custom-scrollbar">
      {/* HEADER CARD */}
      <div className="bg-gradient-to-tr from-[#0f0f14] via-[#15151e] to-[#0a0a0e] border border-white/10 rounded-3xl p-5 text-center relative overflow-hidden shrink-0 shadow-lg">
        {/* Glow orb */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl"></div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Avatar frame */}
          <div className="relative group cursor-pointer" onClick={() => setShowAvatarSelector(!showAvatarSelector)}>
            <img
              src={user.avatarUrl}
              className="w-20 h-20 rounded-full border-4 border-blue-600/40 bg-[#15151e] group-hover:opacity-85 transition-opacity animate-pulse-slow"
              alt="avatar"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-0 right-0 bg-blue-600 text-[8px] px-1.5 py-0.5 rounded-full font-bold font-mono border border-black uppercase tracking-wider text-white">
              Edit
            </span>
          </div>

          {/* Username editing */}
          <div className="mt-3 w-full max-w-[180px]">
            {editingName ? (
              <form onSubmit={handleSaveName} className="flex gap-1.5 justify-center">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  maxLength={15}
                  className="bg-[#15151e] border border-blue-500 rounded-lg px-2 py-0.5 text-xs text-center w-full focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-white"
                />
                <button type="submit" className="text-[9px] bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider">
                  Save
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center space-x-1.5">
                <h3 className="text-sm font-bold truncate max-w-[150px] uppercase tracking-tight">{user.username}</h3>
                <button onClick={() => setEditingName(true)} className="text-[9px] text-slate-500 hover:text-white font-mono uppercase tracking-wider underline">
                  Rename
                </button>
              </div>
            )}
          </div>

          {/* Level and XP progress */}
          <div className="w-full mt-4 space-y-1">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold font-mono uppercase">
              <span className="bg-blue-600/20 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-bold">
                Lv. {user.level}
              </span>
              <span>{user.xp} / {xpNeededForNextLevel} XP</span>
            </div>
            <div className="w-full h-2.5 bg-[#15151e] rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                style={{ width: `${xpPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="flex gap-4 mt-3 text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider">
            <span>🎟️ Referral: <span className="text-blue-400 font-mono font-bold">{user.referralCode}</span></span>
          </div>
        </div>
      </div>

      {/* AVATAR SELECTION COMPONENT */}
      {showAvatarSelector && (
        <div className="bg-[#0f0f14] border border-white/10 p-3 rounded-2xl mt-3 shrink-0 animate-fadeIn">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-2 font-mono">Select Avatar seed</span>
          <div className="grid grid-cols-4 gap-2">
            {AVATARS_LIST.map((av, index) => (
              <button
                key={index}
                onClick={() => { onUpdateAvatar(av); setShowAvatarSelector(false); }}
                className={`p-1 bg-[#15151e] hover:bg-white/5 border rounded-xl flex items-center justify-center transition-colors ${
                  user.avatarUrl === av ? 'border-blue-500' : 'border-transparent'
                }`}
              >
                <img src={av} className="w-10 h-10" alt="seeded avatar" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* DAILY MISSIONS/QUESTS */}
      <div className="mt-4 shrink-0">
        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block mb-2 flex items-center gap-1 font-mono">
          <Star className="w-3.5 h-3.5 text-blue-500" /> Daily Quests
        </span>
        <div className="space-y-2 bg-[#0f0f14]/60 border border-white/10 p-3 rounded-2xl">
          {dailyMissions.map((mission) => {
            const isCompleted = mission.progressCurrent >= mission.progressMax;
            const isClaimed = user.dailyMissionsClaimed.includes(mission.id);

            return (
              <div key={mission.id} className="bg-[#15151e] border border-white/5 p-2.5 rounded-xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-white uppercase tracking-tight">{mission.title}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{mission.description}</p>
                  <p className="text-[9px] text-slate-500 font-mono">
                    Progress: {mission.progressCurrent} / {mission.progressMax}
                  </p>
                </div>

                {isClaimed ? (
                  <span className="text-[9px] text-slate-500 font-semibold italic font-mono uppercase tracking-wider">Claimed</span>
                ) : isCompleted ? (
                  <button
                    onClick={() => onClaimMission(mission.id)}
                    className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 font-bold rounded-xl text-[9px] font-mono uppercase tracking-wider text-white shadow-md shadow-emerald-600/10 border border-emerald-400/25"
                  >
                    Claim 💰{mission.coinsReward}
                  </button>
                ) : (
                  <span className="text-[9px] bg-[#15151e] border border-white/10 text-slate-500 font-mono font-bold uppercase tracking-wider px-2 py-1 rounded">
                    Active
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ACHIEVEMENTS / BADGES */}
      <div className="mt-4 flex-1 flex flex-col min-h-[200px]">
        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block mb-2 flex items-center gap-1 font-mono">
          <Award className="w-3.5 h-3.5 text-blue-500" /> Achievements
        </span>
        <div className="flex-1 bg-[#0f0f14]/60 border border-white/10 p-3 rounded-2xl space-y-2 overflow-y-auto custom-scrollbar">
          {achievements.map((ach) => {
            const isUnlocked = user.achievements.includes(ach.id);

            return (
              <div
                key={ach.id}
                className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
                  isUnlocked
                    ? 'bg-gradient-to-r from-[#15151e] to-blue-950/10 border-blue-500/20'
                    : 'bg-[#15151e]/60 border-white/5 opacity-75'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <span className="text-2xl shrink-0">{ach.icon}</span>
                  <div className="min-w-0 text-left">
                    <p className={`text-xs font-bold uppercase tracking-tight ${isUnlocked ? 'text-blue-400' : 'text-slate-400'}`}>
                      {ach.title}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate max-w-[180px] font-mono">{ach.description}</p>
                    <div className="flex items-center space-x-1.5 mt-0.5 font-mono">
                      <span className="text-[9px] text-amber-500">💰+{ach.coinsReward}</span>
                      <span className="text-[9px] text-blue-400">💎+{ach.gemsReward}</span>
                      <span className="text-[9px] text-emerald-400">⭐+{ach.xpReward} XP</span>
                    </div>
                  </div>
                </div>

                <div>
                  {isUnlocked ? (
                    <span className="text-[8px] bg-blue-500/10 text-blue-400 font-mono font-bold border border-blue-500/20 px-2 py-1 rounded-lg uppercase tracking-wider">
                      Unlocked
                    </span>
                  ) : (
                    <span className="text-[8px] bg-[#15151e] text-slate-500 font-mono font-bold border border-white/5 px-2 py-1 rounded-lg uppercase tracking-wider">
                      Locked
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
