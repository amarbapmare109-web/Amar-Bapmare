export interface UserProfile {
  id: string;
  email: string;
  username: string;
  avatarUrl: string;
  xp: number;
  level: number;
  coins: number;
  gems: number;
  isPremium: boolean;
  referralCode: string;
  referredBy?: string;
  achievements: string[]; // unlocked achievement IDs
  dailyMissionsClaimed: string[]; // claimed mission IDs
  lastDailyRewardClaimedAt?: string; // ISO date
  createdAt: string;
  banned: boolean;
}

export interface WalletTransaction {
  id: string;
  type: 'reward' | 'spend' | 'purchase' | 'gift_code' | 'referral' | 'ad_bonus';
  amount: number;
  currency: 'coins' | 'gems';
  description: string;
  date: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  coinsReward: number;
  gemsReward: number;
  xpReward: number;
  progressMax?: number;
  progressCurrent?: number;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  progressMax: number;
  progressCurrent: number;
  coinsReward: number;
  gemsReward: number;
  xpReward: number;
  isCompleted: boolean;
  isClaimed: boolean;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: 'arcade' | 'puzzle' | 'board' | 'rpg';
  rating: number;
  playersCount: number;
  status: 'active' | 'beta' | 'coming_soon';
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatarUrl: string;
  value: number; // either coins or level/xp depending on type
  rank: number;
  isPremium?: boolean;
}

export interface SystemAlert {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: 'reward' | 'system' | 'tournament' | 'mission';
}

export interface AppState {
  user: UserProfile | null;
  transactions: WalletTransaction[];
  alerts: SystemAlert[];
  dailyMissions: DailyMission[];
  achievements: Achievement[];
  leaderboards: {
    coins: LeaderboardEntry[];
    xp: LeaderboardEntry[];
  };
  bannedUsers: string[];
  adMobConfig: {
    bannerVisible: boolean;
    bannerUnitId: string;
    interstitialUnitId: string;
    rewardedUnitId: string;
    adImpressions: number;
    estimatedRevenue: number;
  };
}
