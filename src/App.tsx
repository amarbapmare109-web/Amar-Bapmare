import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Trophy, Wallet, User, ShieldAlert, Bell, Moon, Sun, Smartphone, Menu, Sparkles, LogOut, Award, ShieldCheck } from 'lucide-react';
import { UserProfile, WalletTransaction, SystemAlert, DailyMission, Achievement, Game } from './types';
import { GAMES_LIST, DEFAULT_ACHIEVEMENTS, DEFAULT_MISSIONS } from './data/gamesData';
import { MobileFrame } from './components/MobileFrame';
import { AuthScreen } from './components/AuthScreen';
import { AdMobBanner, AdMobInterstitial, AdMobRewarded } from './components/AdMobSimulator';
import { GameScreen } from './components/GameScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { WalletScreen } from './components/WalletScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { NotificationCenter } from './components/NotificationCenter';
import { AdminPanel } from './components/AdminPanel';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [games, setGames] = useState<Game[]>(GAMES_LIST);
  const [bannedUsers, setBannedUsers] = useState<string[]>([]);
  const [currentScreen, setCurrentScreen] = useState<'home' | 'game' | 'leaderboard' | 'wallet' | 'profile' | 'notifications' | 'admin'>('home');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  // Layout & Styling states
  const [isMobileFrame, setIsMobileFrame] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'board' | 'puzzle' | 'rpg' | 'arcade'>('all');

  // AdMob states
  const [bannerVisible, setBannerVisible] = useState(true);
  const [interstitialOpen, setInterstitialOpen] = useState(false);
  const [rewardedOpen, setRewardedOpen] = useState(false);
  const [rewardedCallback, setRewardedCallback] = useState<(completed: boolean) => void | null>(() => () => {});
  const [adImpressions, setAdImpressions] = useState(0);
  const [estimatedRevenue, setEstimatedRevenue] = useState(0);

  // Daily Missions & Achievements
  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // Daily Rewards Claim Claimed state
  const [dailyClaimedToday, setDailyClaimedToday] = useState(false);

  // ==========================================
  // INITIAL LOAD
  // ==========================================
  useEffect(() => {
    // Set default initial data
    setDailyMissions(DEFAULT_MISSIONS);
    setAchievements(DEFAULT_ACHIEVEMENTS);

    // Initial default mock transaction
    const initialTxs: WalletTransaction[] = [
      {
        id: 'tx_init',
        type: 'reward',
        amount: 200,
        currency: 'coins',
        description: 'Vortex Welcome Account Gift',
        date: new Date().toISOString(),
      },
    ];
    setTransactions(initialTxs);

    // Initial alert notification
    const initialAlerts: SystemAlert[] = [
      {
        id: 'alert_init',
        title: '🎮 Welcome to Vortex Arcade!',
        description: 'Enjoy 3 premium playable games, custom leaderboards, real wallet syncing, and dynamic achievements.',
        timestamp: new Date().toISOString(),
        read: false,
        type: 'system',
      },
    ];
    setAlerts(initialAlerts);
  }, []);

  // Sync dark mode class
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Check if current user gets banned in real-time
  const isBanned = user && bannedUsers.includes(user.id);

  // ==========================================
  // AUTHENTICATION HANDLERS
  // ==========================================
  const handleAuthSuccess = (authenticatedUser: UserProfile) => {
    setUser(authenticatedUser);

    // Add logging transaction
    const joinTx: WalletTransaction = {
      id: `tx_${Math.random().toString(36).substr(2, 9)}`,
      type: 'reward',
      amount: authenticatedUser.coins,
      currency: 'coins',
      description: 'Account Created: Welcome Bonus Coins Added',
      date: new Date().toISOString(),
    };
    setTransactions((prev) => [joinTx, ...prev]);

    // Push login alert notification
    const logAlert: SystemAlert = {
      id: `alert_log_${Date.now()}`,
      title: '🔐 Successful Authentication',
      description: `Account logged in under email: ${authenticatedUser.email}. Cloud synched.`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'system',
    };
    setAlerts((prev) => [logAlert, ...prev]);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen('home');
    setSelectedGame(null);
    setDailyClaimedToday(false);
  };

  // ==========================================
  // REWARDS & BALANCES (XP / COINS / LEVEL ENGINE)
  // ==========================================
  const handleReward = (coins: number, gems: number, xp: number, achievementId?: string) => {
    if (!user) return;

    setUser((prev) => {
      if (!prev) return prev;

      let newCoins = prev.coins + coins;
      let newGems = prev.gems + gems;
      let newXp = prev.xp + xp;
      let newLevel = prev.level;

      // Experience Level up calculator
      let xpNeeded = newLevel * 300;
      let levelsGained = 0;

      while (newXp >= xpNeeded) {
        newXp -= xpNeeded;
        newLevel += 1;
        levelsGained += 1;
        xpNeeded = newLevel * 300;
      }

      if (levelsGained > 0) {
        // Dispatch Level-up notification
        setTimeout(() => {
          handleAddAlert(
            `🚀 LEVEL UP: Level ${newLevel}!`,
            `Congratulations! You've achieved Level ${newLevel}. Amassed +50 Coins and +5 Gems as promotion rewards!`,
            'reward'
          );
          // Credit Level promotion rewards
          handleReward(50, 5, 0);
        }, 800);
      }

      // Handle Achievement unlock
      let updatedAchievements = [...prev.achievements];
      if (achievementId && !updatedAchievements.includes(achievementId)) {
        updatedAchievements.push(achievementId);
        const ach = achievements.find((a) => a.id === achievementId);
        if (ach) {
          setTimeout(() => {
            handleAddAlert(
              `🏆 Achievement Unlocked: ${ach.title}`,
              `Earned achievement: ${ach.description}. Claim rewards in your profile.`,
              'mission'
            );
          }, 1200);
        }
      }

      // Ensure stats never drop below zero
      return {
        ...prev,
        coins: Math.max(newCoins, 0),
        gems: Math.max(newGems, 0),
        xp: Math.max(newXp, 0),
        level: newLevel,
        achievements: updatedAchievements,
      };
    });

    // Handle generic achievements triggers
    if (coins > 0 || gems > 0) {
      checkDynamicAchievementsTriggers();
    }
  };

  // Triggered when Coins/Gems balances update to satisfy aggregate achievements
  const checkDynamicAchievementsTriggers = () => {
    if (!user) return;
    if (user.coins >= 1000 && !user.achievements.includes('rich_gamer')) {
      handleReward(0, 0, 0, 'rich_gamer');
    }
  };

  // ==========================================
  // ADMOB TRIGGERS
  // ==========================================
  const triggerAd = (type: 'interstitial' | 'rewarded', callback: (completed: boolean) => void) => {
    // Register metrics
    setAdImpressions((prev) => prev + 1);
    setEstimatedRevenue((prev) => prev + (type === 'rewarded' ? 0.35 : 0.08));

    if (type === 'interstitial') {
      setInterstitialOpen(true);
      setRewardedCallback(() => () => {
        setInterstitialOpen(false);
        callback(true);
      });
    } else {
      setRewardedOpen(true);
      setRewardedCallback(() => (completed: boolean) => {
        setRewardedOpen(false);
        callback(completed);
      });
    }
  };

  // ==========================================
  // DAILY REWARDS CLAIM & QUESTS
  // ==========================================
  const handleClaimDailyReward = () => {
    if (dailyClaimedToday) return;
    onRewardAndTx(100, 2, 'Claimed Daily Reward of +100 Coins & +2 Gems');
    setDailyClaimedToday(true);
    handleAddAlert('🎁 Daily Check-In Success!', 'Claimed +100 Coins & +2 Gems. Come back tomorrow for more!', 'reward');
  };

  const handleClaimMission = (missionId: string) => {
    const mission = dailyMissions.find((m) => m.id === missionId);
    if (!mission || user?.dailyMissionsClaimed.includes(missionId)) return;

    onRewardAndTx(mission.coinsReward, mission.gemsReward, `Claimed Daily Quest Reward: ${mission.title}`);

    // Update claimed list
    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        dailyMissionsClaimed: [...prev.dailyMissionsClaimed, missionId],
      };
    });
  };

  const onRewardAndTx = (coins: number, gems: number, desc: string) => {
    handleReward(coins, gems, 40); // award Coins, Gems, and standard Quest XP

    const newTx: WalletTransaction = {
      id: `tx_${Math.random().toString(36).substr(2, 9)}`,
      type: coins >= 0 ? 'reward' : 'spend',
      amount: Math.abs(coins > 0 ? coins : gems),
      currency: coins > 0 ? 'coins' : 'gems',
      description: desc,
      date: new Date().toISOString(),
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // ==========================================
  // ALERTS & NOTIFICATIONS
  // ==========================================
  const handleAddAlert = (title: string, desc: string, type: 'reward' | 'system' | 'tournament' | 'mission') => {
    const newAlert: SystemAlert = {
      id: `alert_${Date.now()}`,
      title,
      description: desc,
      timestamp: new Date().toISOString(),
      read: false,
      type,
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const handleMarkRead = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  };

  const handleClearAlerts = () => {
    setAlerts([]);
  };

  // ==========================================
  // NAVIGATION ROUTER WITH INTERSTITIAL CHANCE
  // ==========================================
  const handleNavigate = (screen: typeof currentScreen) => {
    // 30% chance to trigger AdMob Interstitial on screen transition!
    const triggerChance = Math.random() < 0.25;

    if (triggerChance && user) {
      triggerAd('interstitial', () => {
        setCurrentScreen(screen);
        setSelectedGame(null);
      });
    } else {
      setCurrentScreen(screen);
      setSelectedGame(null);
    }
  };

  // Filter games based on search & active category
  const filteredGames = games.filter((g) => {
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) || g.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === 'all' || g.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  // Calculate unread notification badge count
  const unreadAlertsCount = alerts.filter((a) => !a.read).length;

  return (
    <MobileFrame isMobileFrame={isMobileFrame} setIsMobileFrame={setIsMobileFrame}>
      <div className={`h-full flex flex-col ${isDarkMode ? 'bg-[#0a0a0e] text-slate-100' : 'bg-slate-50 text-slate-800'}`}>

        {/* BANNED CARD BLOCK */}
        {isBanned ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[#0a0a0e] text-slate-100 space-y-4">
            <div className="w-16 h-16 bg-red-600/10 border-2 border-red-500 rounded-full flex items-center justify-center text-red-500 animate-bounce">
              <ShieldAlert className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold font-display uppercase tracking-tight">Access Restricted</h2>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed font-mono">
              Your connection to the Vortex Games Hub has been restricted by an administrator due to telemetry deviations.
            </p>
            <button
              onClick={handleLogout}
              className="py-2.5 px-6 bg-red-600 hover:bg-red-500 font-bold font-mono rounded-xl text-xs flex items-center space-x-2 text-white uppercase tracking-wider"
            >
              <LogOut className="w-4 h-4" />
              <span>Exit Account</span>
            </button>
          </div>
        ) : (
          <>
            {/* NO USER STATE (SHOW LOGIN SCREENS) */}
            {!user ? (
              <AuthScreen onAuthSuccess={handleAuthSuccess} userEmail="" />
            ) : (
              /* CORE APP VIEWS */
              <div className="flex-1 flex flex-col overflow-hidden relative">

                {/* ADMOB OVERLAYS */}
                <AdMobInterstitial isOpen={interstitialOpen} onClose={() => rewardedCallback(true)} />
                <AdMobRewarded isOpen={rewardedOpen} onClose={(comp) => { rewardedCallback(comp); }} />

                {/* HEADER ROW */}
                <div className="h-14 shrink-0 px-4 flex items-center justify-between border-b border-white/10 bg-[#0f0f14]/90 backdrop-blur-md relative z-10">
                  <div className="flex items-center space-x-2.5">
                    <img src={user.avatarUrl} className="w-8 h-8 rounded-full border border-white/15" alt="profile" referrerPolicy="no-referrer" />
                    <div className="text-left">
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] font-bold text-white truncate max-w-[80px]">{user.username}</span>
                        {user.isPremium && <span className="text-[9px] text-blue-400 font-mono">★ VIP</span>}
                      </div>
                      <span className="text-[9px] text-blue-400 block font-semibold uppercase font-mono">Lv. {user.level}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Currency counter pills */}
                    <div className="flex items-center space-x-1.5 bg-[#15151e] border border-white/10 px-2 py-1 rounded-full text-[10px] font-mono">
                      <span className="text-amber-400 font-bold">💰 {user.coins}</span>
                      <span className="text-white/10">|</span>
                      <span className="text-blue-400 font-bold">💎 {user.gems}</span>
                    </div>

                    {/* Dark mode toggler */}
                    <button
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className="p-1.5 rounded-xl bg-[#15151e] border border-white/10 hover:text-blue-400 text-slate-400"
                    >
                      {isDarkMode ? <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" /> : <Moon className="w-4 h-4 text-slate-400" />}
                    </button>
                  </div>
                </div>

                {/* MIDDLE CONTENT SCREEN PORTALS */}
                <div className="flex-1 overflow-hidden relative flex flex-col">
                  <AnimatePresence mode="wait">
                    {currentScreen === 'home' && (
                      <motion.div
                        key="home"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4"
                      >
                        {/* Daily Rewards claimed banner */}
                        {!dailyClaimedToday && (
                          <div className="bg-gradient-to-r from-blue-500/5 via-blue-500/10 to-emerald-500/5 border border-blue-500/20 rounded-2xl p-3 flex items-center justify-between shadow-[0_0_10px_rgba(59,130,246,0.05)] select-none animate-pulse-slow">
                            <div>
                              <h4 className="text-xs font-bold text-blue-400 flex items-center gap-1 uppercase tracking-wider font-mono">
                                <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Daily Check-In
                              </h4>
                              <p className="text-[10px] text-slate-400 font-mono">Reward of +100 Coins & +2 Gems available!</p>
                            </div>
                            <button
                              onClick={handleClaimDailyReward}
                              className="py-1 px-3.5 bg-blue-600 hover:bg-blue-500 text-white font-mono font-extrabold rounded-xl text-[9px] uppercase tracking-wider shadow-[0_0_10px_rgba(59,130,246,0.4)] border border-blue-400/20"
                            >
                              Claim
                            </button>
                          </div>
                        )}

                        {/* Search bar & Category filter */}
                        <div className="space-y-2 shrink-0">
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search games, RPG, puzzle..."
                            className="w-full bg-[#0f0f14] border border-white/10 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/40 text-slate-100 font-mono"
                          />

                          {/* Categories horizontally scrollable row */}
                          <div className="flex space-x-1.5 overflow-x-auto custom-scrollbar pb-1 text-[9px] font-bold select-none shrink-0 uppercase tracking-wider font-mono">
                            {(['all', 'board', 'puzzle', 'rpg', 'arcade'] as const).map((cat) => (
                              <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`py-1.5 px-3.5 rounded-full capitalize shrink-0 transition-all ${
                                  activeCategory === cat
                                    ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(59,130,246,0.35)] border border-blue-400/25'
                                    : 'bg-[#0f0f14] border border-white/10 text-slate-400 hover:text-white'
                                }`}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Featured Game Hero */}
                        <div className="bg-gradient-to-tr from-[#0f0f14] via-[#15151e] to-[#0a0a0e] rounded-3xl p-4 border border-white/10 relative overflow-hidden flex items-center justify-between min-h-[140px] select-none shadow-lg shrink-0">
                          <div className="absolute inset-0 bg-blue-500/5 animate-pulse-slow"></div>
                          <div className="space-y-2 relative z-10 max-w-[180px]">
                            <span className="text-[8px] bg-blue-600 text-white font-extrabold font-mono uppercase px-1.5 py-0.5 rounded-full tracking-wider">
                              Trending RPG
                            </span>
                            <h3 className="text-base font-black font-display text-white uppercase tracking-tight">Monster Tap RPG</h3>
                            <p className="text-[10px] text-slate-400 font-mono">Tap legendary bosses and upgrade obsidian blades!</p>
                            <button
                              onClick={() => {
                                setSelectedGame(games[2]); // RPG
                                setCurrentScreen('game');
                              }}
                              className="py-1.5 px-4 bg-blue-600 hover:bg-blue-500 font-bold rounded-xl text-[11px] font-mono uppercase tracking-wider text-white shadow-[0_0_10px_rgba(59,130,246,0.3)] border border-blue-400/20"
                            >
                              Play Now
                            </button>
                          </div>
                          <img
                            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=150&h=150"
                            className="w-24 h-24 rounded-2xl border border-white/10 rotate-3 shadow-2xl relative z-10 shrink-0"
                            alt="monster rpg hero"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Popular Games List */}
                        <div className="space-y-2.5">
                          <h4 className="text-[10px] font-bold font-mono uppercase tracking-widest text-slate-500">
                            Available Arcade Games ({filteredGames.length})
                          </h4>

                          <div className="grid grid-cols-1 gap-2.5">
                            {filteredGames.map((g) => (
                              <div
                                key={g.id}
                                className={`p-3 bg-[#0f0f14]/60 border border-white/10 hover:border-white/20 rounded-2xl flex items-center justify-between transition-all ${
                                  g.status === 'coming_soon' ? 'opacity-65 select-none' : ''
                                }`}
                              >
                                <div className="flex items-center space-x-3 min-w-0">
                                  <img
                                    src={g.thumbnail}
                                    className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10"
                                    alt="game logo"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="min-w-0 text-left">
                                    <h5 className="text-xs font-bold text-white truncate max-w-[150px] uppercase tracking-tight">{g.title}</h5>
                                    <p className="text-[10px] text-slate-400 truncate max-w-[180px] font-mono">{g.description}</p>
                                    <span className="text-blue-400 capitalize font-mono text-[9px] font-bold mt-0.5 block">{g.category}</span>
                                  </div>
                                </div>

                                {g.status === 'coming_soon' ? (
                                  <span className="text-[9px] bg-[#15151e] border border-white/5 text-slate-500 font-mono font-extrabold px-2.5 py-1 rounded-xl">
                                    Soon
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setSelectedGame(g);
                                      setCurrentScreen('game');
                                    }}
                                    className="py-1 px-3 bg-blue-600 hover:bg-blue-500 font-mono font-bold rounded-xl text-[9px] uppercase tracking-wider text-white shadow-[0_0_8px_rgba(59,130,246,0.2)] border border-blue-400/20 px-2.5 py-1"
                                  >
                                    Start
                                  </button>
                                )}
                              </div>
                            ))}

                            {filteredGames.length === 0 && (
                              <div className="text-center py-6 text-xs text-slate-500 font-mono uppercase">No matching games found.</div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {currentScreen === 'game' && selectedGame && (
                      <motion.div
                        key="game"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col h-full"
                      >
                        <GameScreen
                          game={selectedGame}
                          user={user}
                          onExit={() => handleNavigate('home')}
                          onReward={handleReward}
                          triggerAd={(type, callback) => triggerAd(type as any, callback)}
                        />
                      </motion.div>
                    )}

                    {currentScreen === 'leaderboard' && (
                      <motion.div
                        key="leaderboard"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex-1 flex flex-col h-full"
                      >
                        <LeaderboardScreen user={user} />
                      </motion.div>
                    )}

                    {currentScreen === 'wallet' && (
                      <motion.div
                        key="wallet"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex-1 flex flex-col h-full"
                      >
                        <WalletScreen
                          user={user}
                          transactions={transactions}
                          onAddTransaction={(tx) => setTransactions((prev) => [tx, ...prev])}
                          onReward={handleReward}
                          triggerAd={(type, callback) => triggerAd(type, callback)}
                          setAppState={setUser as any}
                        />
                      </motion.div>
                    )}

                    {currentScreen === 'profile' && (
                      <motion.div
                        key="profile"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex-1 flex flex-col h-full"
                      >
                        <ProfileScreen
                          user={user}
                          achievements={achievements}
                          dailyMissions={dailyMissions}
                          onClaimMission={handleClaimMission}
                          onClaimAchievement={(id) => handleReward(0, 0, 0, id)}
                          onUpdateAvatar={(av) => setUser((prev) => (prev ? { ...prev, avatarUrl: av } : null))}
                          onUpdateUsername={(name) => setUser((prev) => (prev ? { ...prev, username: name } : null))}
                        />
                      </motion.div>
                    )}

                    {currentScreen === 'notifications' && (
                      <motion.div
                        key="notifications"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex-1 flex flex-col h-full"
                      >
                        <NotificationCenter
                          user={user}
                          alerts={alerts}
                          onMarkRead={handleMarkRead}
                          onClearAll={handleClearAlerts}
                          onAddAlert={handleAddAlert}
                        />
                      </motion.div>
                    )}

                    {currentScreen === 'admin' && (
                      <motion.div
                        key="admin"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex-1 flex flex-col h-full"
                      >
                        <AdminPanel
                          user={user}
                          games={games}
                          bannedUsers={bannedUsers}
                          adImpressions={adImpressions}
                          estimatedRevenue={estimatedRevenue}
                          setBannedUsers={setBannedUsers}
                          onSetGames={setGames}
                          onReward={handleReward}
                          onAddTransaction={(tx) => setTransactions((prev) => [tx, ...prev])}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ADMOB BOTTOM STICKY BANNER */}
                <AdMobBanner visible={bannerVisible} onClose={() => setBannerVisible(false)} />

                {/* BOTTOM MOBILE NAVIGATION MENUS */}
                <div className="h-14 bg-[#0f0f14] border-t border-white/10 shrink-0 flex items-center justify-around text-[9px] font-bold font-mono uppercase tracking-tight select-none relative z-10 text-slate-500">
                  <button
                    onClick={() => handleNavigate('home')}
                    className={`flex flex-col items-center justify-center space-y-1 py-1 px-3 ${
                      currentScreen === 'home' ? 'text-blue-500 font-extrabold' : 'hover:text-slate-200'
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    <span>Lobby</span>
                  </button>

                  <button
                    onClick={() => handleNavigate('leaderboard')}
                    className={`flex flex-col items-center justify-center space-y-1 py-1 px-3 ${
                      currentScreen === 'leaderboard' ? 'text-blue-500 font-extrabold' : 'hover:text-slate-200'
                    }`}
                  >
                    <Trophy className="w-4 h-4" />
                    <span>Arena</span>
                  </button>

                  <button
                    onClick={() => handleNavigate('wallet')}
                    className={`flex flex-col items-center justify-center space-y-1 py-1 px-3 ${
                      currentScreen === 'wallet' ? 'text-blue-500 font-extrabold' : 'hover:text-slate-200'
                    }`}
                  >
                    <Wallet className="w-4 h-4" />
                    <span>Wallet</span>
                  </button>

                  <button
                    onClick={() => handleNavigate('notifications')}
                    className={`flex flex-col items-center justify-center space-y-1 py-1 px-3 relative ${
                      currentScreen === 'notifications' ? 'text-blue-500 font-extrabold' : 'hover:text-slate-200'
                    }`}
                  >
                    {unreadAlertsCount > 0 && (
                      <span className="absolute top-0 right-3 bg-red-500 text-white rounded-full text-[8px] px-1 font-black min-w-3 text-center">
                        {unreadAlertsCount}
                      </span>
                    )}
                    <Bell className="w-4 h-4" />
                    <span>Alerts</span>
                  </button>

                  <button
                    onClick={() => handleNavigate('profile')}
                    className={`flex flex-col items-center justify-center space-y-1 py-1 px-3 ${
                      currentScreen === 'profile' ? 'text-blue-500 font-extrabold' : 'hover:text-slate-200'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Me</span>
                  </button>

                  <button
                    onClick={() => handleNavigate('admin')}
                    className={`flex flex-col items-center justify-center space-y-1 py-1 px-3 ${
                      currentScreen === 'admin' ? 'text-blue-500 font-extrabold' : 'hover:text-slate-200'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Console</span>
                  </button>
                </div>

              </div>
            )}
          </>
        )}

      </div>
    </MobileFrame>
  );
}
