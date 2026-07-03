import { Game, Achievement, DailyMission, LeaderboardEntry } from '../types';

export const GAMES_LIST: Game[] = [
  {
    id: 'tic-tac-toe',
    title: 'Tic-Tac-Toe AI & Match',
    description: 'Play against an advanced minimax AI or test your skills in the simulated multiplayer online matchmaking lobby!',
    thumbnail: 'https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?auto=format&fit=crop&q=80&w=200&h=200',
    category: 'board',
    rating: 4.8,
    playersCount: 1420,
    status: 'active',
  },
  {
    id: 'memory-match',
    title: 'Memory Tiles',
    description: 'Train your brain in this fast-paced card matching game. Standard grid, beautiful emoji icons, and high-score rankings!',
    thumbnail: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&q=80&w=200&h=200',
    category: 'puzzle',
    rating: 4.6,
    playersCount: 940,
    status: 'active',
  },
  {
    id: 'monster-tap-rpg',
    title: 'Monster Tap RPG',
    description: 'A pocket-sized adventure clicker! Tap to defeat monsters, purchase legendary swords, level up, and battle epic bosses.',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=200&h=200',
    category: 'rpg',
    rating: 4.9,
    playersCount: 2310,
    status: 'active',
  },
  {
    id: 'pixel-dash',
    title: 'Neon Runner',
    description: 'Jump, slide, and dodge obstacles in an endless cyberpunk landscape. Play-Store-Ready dashboard controls!',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=200&h=200',
    category: 'arcade',
    rating: 4.5,
    playersCount: 0,
    status: 'coming_soon',
  }
];

export const AVATARS_LIST = [
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Felix',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Jack',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Boots',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Max',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Lilly',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Shadow',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Princess'
];

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_win',
    title: 'First Blood',
    description: 'Win your first game on the platform.',
    icon: '🏆',
    coinsReward: 100,
    gemsReward: 5,
    xpReward: 50,
  },
  {
    id: 'memory_master',
    title: 'Memory Master',
    description: 'Complete Memory Tiles in less than 40 seconds.',
    icon: '🧠',
    coinsReward: 250,
    gemsReward: 15,
    xpReward: 150,
  },
  {
    id: 'monster_slayer',
    title: 'Monster Slayer',
    description: 'Defeat 10 monsters in Monster Tap RPG.',
    icon: '⚔️',
    coinsReward: 150,
    gemsReward: 10,
    xpReward: 100,
    progressMax: 10,
    progressCurrent: 0,
  },
  {
    id: 'ad_watcher',
    title: 'Ad Supporter',
    description: 'Watch 3 Rewarded Video Ads to support game development.',
    icon: '📺',
    coinsReward: 300,
    gemsReward: 20,
    xpReward: 200,
    progressMax: 3,
    progressCurrent: 0,
  },
  {
    id: 'rich_gamer',
    title: 'Golden Vault',
    description: 'Amass 1,000 Coins in your rewards wallet.',
    icon: '💰',
    coinsReward: 500,
    gemsReward: 30,
    xpReward: 300,
    progressMax: 1000,
    progressCurrent: 200,
  }
];

export const DEFAULT_MISSIONS: DailyMission[] = [
  {
    id: 'daily_login',
    title: 'Daily Log-In',
    description: 'Log in to the Vortex Games Hub today.',
    progressMax: 1,
    progressCurrent: 1,
    coinsReward: 50,
    gemsReward: 2,
    xpReward: 25,
    isCompleted: true,
    isClaimed: false,
  },
  {
    id: 'play_any_game',
    title: 'Arcade Player',
    description: 'Play any game from the library.',
    progressMax: 1,
    progressCurrent: 0,
    coinsReward: 75,
    gemsReward: 3,
    xpReward: 50,
    isCompleted: false,
    isClaimed: false,
  },
  {
    id: 'tap_frenzy',
    title: 'Tap Frenzy',
    description: 'Tap 100 times in Monster Tap RPG.',
    progressMax: 100,
    progressCurrent: 0,
    coinsReward: 100,
    gemsReward: 5,
    xpReward: 75,
    isCompleted: false,
    isClaimed: false,
  }
];

export const MOCK_LEADERBOARD_COINS: LeaderboardEntry[] = [
  { userId: '1', username: 'SpeedRunner99', avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=SpeedRunner99', value: 3450, rank: 1, isPremium: true },
  { userId: '2', username: 'PixelQueen', avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=PixelQueen', value: 2900, rank: 2 },
  { userId: '3', username: 'ApexGamer', avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=ApexGamer', value: 2150, rank: 3, isPremium: true },
  { userId: '4', username: 'CyberNinja', avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=CyberNinja', value: 1840, rank: 4 },
  { userId: '5', username: 'ShadowBlade', avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=ShadowBlade', value: 1520, rank: 5 },
  { userId: '6', username: 'NerdAlert', avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=NerdAlert', value: 1200, rank: 6 },
  { userId: '7', username: 'ComboKing', avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=ComboKing', value: 950, rank: 7 },
  { userId: '8', username: 'LuckyCharm', avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=LuckyCharm', value: 810, rank: 8 },
];

export const MOCK_LEADERBOARD_XP: LeaderboardEntry[] = [
  { userId: '10', username: 'LegendGamer', avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=LegendGamer', value: 9200, rank: 1, isPremium: true },
  { userId: '1', username: 'SpeedRunner99', avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=SpeedRunner99', value: 7400, rank: 2, isPremium: true },
  { userId: '3', username: 'ApexGamer', avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=ApexGamer', value: 5800, rank: 3, isPremium: true },
  { userId: '11', username: 'LootGoblin', avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=LootGoblin', value: 4900, rank: 4 },
  { userId: '4', username: 'CyberNinja', avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=CyberNinja', value: 4100, rank: 5 },
  { userId: '2', username: 'PixelQueen', avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=PixelQueen', value: 3800, rank: 6 },
  { userId: '12', username: 'RogueOne', avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=RogueOne', value: 3100, rank: 7 },
  { userId: '5', username: 'ShadowBlade', avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=ShadowBlade', value: 2750, rank: 8 },
];
