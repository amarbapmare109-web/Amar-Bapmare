import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RefreshCw, Trophy, Swords, Cpu, User, Send, ShoppingBag, Flame, Sparkles, Clock, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Game, UserProfile } from '../types';

interface GameScreenProps {
  game: Game;
  user: UserProfile;
  onExit: () => void;
  onReward: (coins: number, gems: number, xp: number, achievementId?: string) => void;
  triggerAd: (type: 'interstitial' | 'rewarded', callback: () => void) => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ game, user, onExit, onReward, triggerAd }) => {
  // Common states
  const [isPlaying, setIsPlaying] = useState(true);

  // ==========================================
  // GAME 1: TIC-TAC-TOE STATES
  // ==========================================
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [tttMode, setTttMode] = useState<'ai' | 'multi'>('ai');
  const [tttDifficulty, setTttDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [matchStatus, setMatchStatus] = useState<'lobby' | 'matching' | 'playing' | 'ended'>('lobby');
  const [opponentName, setOpponentName] = useState('');
  const [opponentAvatar, setOpponentAvatar] = useState('');
  const [chatMessages, setChatMessages] = useState<{ sender: 'me' | 'opponent'; text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [opponentThinking, setOpponentThinking] = useState(false);
  const [tttWinner, setTttWinner] = useState<string | null>(null);

  // ==========================================
  // GAME 2: MEMORY TILES STATES
  // ==========================================
  const EMOJIS = ['⚔️', '🛡️', '💎', '👑', '🐉', '🏹', '🧪', '🔮'];
  const [cards, setCards] = useState<{ id: number; symbol: string; isFlipped: boolean; isMatched: boolean }[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [flips, setFlips] = useState(0);
  const [memoryTime, setMemoryTime] = useState(0);
  const [isMemoryActive, setIsMemoryActive] = useState(false);
  const [memoryWon, setMemoryWon] = useState(false);

  // ==========================================
  // GAME 3: MONSTER TAP RPG CLICKER STATES
  // ==========================================
  const MONSTERS = [
    { name: 'Slime', emoji: '🟢', hp: 15, maxHp: 15, rewardCoins: 10, rewardXp: 15, boss: false },
    { name: 'Goblin', emoji: '👺', hp: 30, maxHp: 30, rewardCoins: 20, rewardXp: 25, boss: false },
    { name: 'Skeleton', emoji: '💀', hp: 50, maxHp: 50, rewardCoins: 35, rewardXp: 40, boss: false },
    { name: 'Orc Warrior', emoji: '👹', hp: 80, maxHp: 80, rewardCoins: 50, rewardXp: 60, boss: false },
    { name: 'Lava Golem', emoji: '🌋', hp: 120, maxHp: 120, rewardCoins: 75, rewardXp: 90, boss: false },
    { name: 'Demon Dragon (BOSS)', emoji: '🐉', hp: 400, maxHp: 400, rewardCoins: 200, rewardXp: 250, boss: true }
  ];
  const WEAPONS = [
    { name: 'Rusty Dagger', dps: 1, cost: 0, emoji: '🗡️' },
    { name: 'Iron Broadsword', dps: 3, cost: 100, emoji: '⚔️' },
    { name: 'Elven Bow', dps: 8, cost: 350, emoji: '🏹' },
    { name: 'Obsidian Fire Claymore', dps: 20, cost: 800, emoji: '🔥' },
    { name: 'Mjolnir Lightning Hammer', dps: 55, cost: 2000, emoji: '⚡' }
  ];
  const [monsterIndex, setMonsterIndex] = useState(0);
  const [monsterHp, setMonsterHp] = useState(15);
  const [activeWeaponIndex, setActiveWeaponIndex] = useState(0);
  const [purchasedWeapons, setPurchasedWeapons] = useState<number[]>([0]);
  const [bossTimer, setBossTimer] = useState<number | null>(null);
  const [particles, setParticles] = useState<{ id: number; text: string; x: number; y: number }[]>([]);
  const [totalTaps, setTotalTaps] = useState(0);

  // References
  const tttThinkingRef = useRef(false);

  // ==========================================
  // INITIALIZATION
  // ==========================================
  useEffect(() => {
    if (game.id === 'memory-match') {
      initializeMemoryGame();
    } else if (game.id === 'monster-tap-rpg') {
      const savedWeapon = localStorage.getItem('rpg_weapon');
      if (savedWeapon) {
        try {
          const arr = JSON.parse(savedWeapon);
          setPurchasedWeapons(arr);
          setActiveWeaponIndex(arr[arr.length - 1]);
        } catch(e){}
      }
    }
  }, [game]);

  // ==========================================
  // TIC-TAC-TOE LOGIC
  // ==========================================
  const checkWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return squares.includes(null) ? null : 'T'; // 'T' means tie
  };

  const handleTttReset = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setTttWinner(null);
    if (tttMode === 'multi') {
      setMatchStatus('playing');
      setChatMessages([{ sender: 'opponent', text: 'Another round? Let\'s go!' }]);
    }
  };

  const handleTttCellClick = (index: number) => {
    if (board[index] || tttWinner || opponentThinking || (tttMode === 'multi' && !isXNext)) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);

    const winResult = checkWinner(newBoard);
    if (winResult) {
      handleTttEnd(winResult);
      return;
    }

    if (tttMode === 'ai') {
      setIsXNext(false);
      setOpponentThinking(true);
      setTimeout(() => {
        makeAiMove(newBoard);
      }, 700);
    } else {
      // Multiplayer matchmaking simulated step
      setIsXNext(false);
      setOpponentThinking(true);
      simulateOpponentTurn(newBoard);
    }
  };

  // Minimax algorithm for unbeatable TTT
  const minimax = (squares: (string | null)[], depth: number, isMax: boolean): number => {
    const winner = checkWinner(squares);
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (winner === 'T') return 0;

    if (isMax) {
      let best = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!squares[i]) {
          squares[i] = 'O';
          best = Math.max(best, minimax(squares, depth + 1, false));
          squares[i] = null;
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!squares[i]) {
          squares[i] = 'X';
          best = Math.min(best, minimax(squares, depth + 1, true));
          squares[i] = null;
        }
      }
      return best;
    }
  };

  const makeAiMove = (currentBoard: (string | null)[]) => {
    const availableCells: number[] = [];
    currentBoard.forEach((cell, idx) => {
      if (!cell) availableCells.push(idx);
    });

    if (availableCells.length === 0) return;

    let targetIndex = availableCells[0];

    // AI Difficulty implementation
    const isEasy = tttDifficulty === 'easy';
    const isMedium = tttDifficulty === 'medium';

    if (isEasy || (isMedium && Math.random() < 0.35)) {
      // Pick random cell
      targetIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    } else {
      // Hard mode: Minimax unbeatable
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!currentBoard[i]) {
          currentBoard[i] = 'O';
          const score = minimax(currentBoard, 0, false);
          currentBoard[i] = null;
          if (score > bestScore) {
            bestScore = score;
            targetIndex = i;
          }
        }
      }
    }

    const nextBoard = [...currentBoard];
    nextBoard[targetIndex] = 'O';
    setBoard(nextBoard);
    setOpponentThinking(false);
    setIsXNext(true);

    const winResult = checkWinner(nextBoard);
    if (winResult) {
      handleTttEnd(winResult);
    }
  };

  const simulateOpponentTurn = (currentBoard: (string | null)[]) => {
    const availableCells: number[] = [];
    currentBoard.forEach((cell, idx) => {
      if (!cell) availableCells.push(idx);
    });

    if (availableCells.length === 0) return;

    // Simulate smart gameplay from online rival
    let targetIndex = availableCells[Math.floor(Math.random() * availableCells.length)];

    // Block or win check for simulated rival
    // Win if possible
    for (let i = 0; i < 9; i++) {
      if (!currentBoard[i]) {
        const testBoard = [...currentBoard];
        testBoard[i] = 'O';
        if (checkWinner(testBoard) === 'O') {
          targetIndex = i;
          break;
        }
      }
    }

    setTimeout(() => {
      const nextBoard = [...currentBoard];
      nextBoard[targetIndex] = 'O';
      setBoard(nextBoard);
      setOpponentThinking(false);
      setIsXNext(true);

      // Chat feedback
      const rivalChats = [
        'Gotcha! ⚡',
        'Hmm, interesting placement.',
        'Wait, I see what you are doing!',
        'No way!',
        'Check this out!'
      ];
      sendOpponentChat(rivalChats[Math.floor(Math.random() * rivalChats.length)]);

      const winResult = checkWinner(nextBoard);
      if (winResult) {
        handleTttEnd(winResult);
      }
    }, 1500);
  };

  const startMatchmaking = () => {
    setMatchStatus('matching');
    setChatMessages([]);
    setTimeout(() => {
      const rivalNames = ['ApexGamer', 'ShadowSniper', 'PixelPro', 'ChronoLord', 'AlphaHelix'];
      const avatars = [
        'https://api.dicebear.com/7.x/pixel-art/svg?seed=ApexGamer',
        'https://api.dicebear.com/7.x/pixel-art/svg?seed=ShadowSniper',
        'https://api.dicebear.com/7.x/pixel-art/svg?seed=PixelPro',
        'https://api.dicebear.com/7.x/pixel-art/svg?seed=ChronoLord'
      ];
      setOpponentName(rivalNames[Math.floor(Math.random() * rivalNames.length)]);
      setOpponentAvatar(avatars[Math.floor(Math.random() * avatars.length)]);
      setMatchStatus('playing');
      setBoard(Array(9).fill(null));
      setIsXNext(true);
      setTttWinner(null);
      setChatMessages([{ sender: 'opponent', text: 'Hey there! GLHF! 👍' }]);
    }, 3000);
  };

  const handleTttEnd = (winner: string) => {
    setTttWinner(winner);
    setMatchStatus('ended');

    if (winner === 'X') {
      // Human win
      onReward(150, 5, 50, 'first_win');
      if (tttMode === 'multi') {
        sendOpponentChat('Ah, nice game! You were too fast. GGs 🤝');
      }
    } else if (winner === 'O') {
      onReward(25, 0, 10);
      if (tttMode === 'multi') {
        sendOpponentChat('Yes! That strategy worked out perfectly! 😎');
      }
    } else {
      // Tie
      onReward(50, 1, 20);
      if (tttMode === 'multi') {
        sendOpponentChat('Wow, complete grid block. GG!');
      }
    }
  };

  const sendOpponentChat = (text: string) => {
    setChatMessages(prev => [...prev, { sender: 'opponent', text }]);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { sender: 'me', text: chatInput }]);
    const currentMsg = chatInput.toLowerCase();
    setChatInput('');

    // Simulated responses
    setTimeout(() => {
      let reply = 'Keep playing!';
      if (currentMsg.includes('hi') || currentMsg.includes('hello')) {
        reply = 'Yo! Focus up, game on! 🕹️';
      } else if (currentMsg.includes('gg')) {
        reply = 'Good game indeed, standard play.';
      } else if (currentMsg.includes('hack') || currentMsg.includes('cheat')) {
        reply = 'No cheats here, just raw strategic skill.';
      } else {
        const standardReplies = [
          'Nice play!',
          'Let me calculate my next cell...',
          'Grid block incoming! 🛡️',
          'Aha!'
        ];
        reply = standardReplies[Math.floor(Math.random() * standardReplies.length)];
      }
      sendOpponentChat(reply);
    }, 1200);
  };

  // ==========================================
  // MEMORY TILES LOGIC
  // ==========================================
  const initializeMemoryGame = () => {
    const deck = [...EMOJIS, ...EMOJIS]
      .map((sym, index) => ({ id: index, symbol: sym, isFlipped: false, isMatched: false }))
      .sort(() => Math.random() - 0.5);

    setCards(deck);
    setSelectedCards([]);
    setFlips(0);
    setMemoryTime(0);
    setMemoryWon(false);
    setIsMemoryActive(true);
  };

  // Memory Game Clock
  useEffect(() => {
    if (!isMemoryActive || memoryWon) return;
    const timer = setInterval(() => {
      setMemoryTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isMemoryActive, memoryWon]);

  const handleCardClick = (cardId: number) => {
    if (selectedCards.length >= 2 || cards.find(c => c.id === cardId)?.isFlipped || cards.find(c => c.id === cardId)?.isMatched) return;

    const newCards = cards.map(c => c.id === cardId ? { ...c, isFlipped: true } : c);
    setCards(newCards);

    const newSelection = [...selectedCards, cardId];
    setSelectedCards(newSelection);

    if (newSelection.length === 2) {
      setFlips(prev => prev + 1);
      const [firstId, secondId] = newSelection;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.symbol === secondCard.symbol) {
        // Matched!
        setTimeout(() => {
          setCards(prev => prev.map(c => (c.id === firstId || c.id === secondId) ? { ...c, isMatched: true } : c));
          setSelectedCards([]);

          // Check if game complete
          const allMatched = newCards.every(c => c.id === firstId || c.id === secondId ? true : c.isMatched || c.isFlipped);
          if (allMatched) {
            handleMemoryWin();
          }
        }, 500);
      } else {
        // Unmatched, flip back
        setTimeout(() => {
          setCards(prev => prev.map(c => (c.id === firstId || c.id === secondId) ? { ...c, isFlipped: false } : c));
          setSelectedCards([]);
        }, 1000);
      }
    }
  };

  const handleMemoryWin = () => {
    setMemoryWon(true);
    setIsMemoryActive(false);

    let coinBonus = 200;
    let gemBonus = 10;
    let xpBonus = 100;

    // Time speed limits
    let achievementId;
    if (memoryTime < 40) {
      coinBonus += 100;
      gemBonus += 5;
      xpBonus += 50;
      achievementId = 'memory_master';
    }

    onReward(coinBonus, gemBonus, xpBonus, achievementId);
  };

  // ==========================================
  // MONSTER TAP LOGIC
  // ==========================================
  const spawnNextMonster = (indexChange?: number) => {
    const nextIdx = indexChange !== undefined ? indexChange : (monsterIndex + 1) % MONSTERS.length;
    setMonsterIndex(nextIdx);
    setMonsterHp(MONSTERS[nextIdx].hp);

    if (MONSTERS[nextIdx].boss) {
      // Start boss timer
      setBossTimer(30);
    } else {
      setBossTimer(null);
    }
  };

  // Boss fight ticking clock
  useEffect(() => {
    if (bossTimer === null) return;
    if (bossTimer <= 0) {
      // Boss escaped/failed
      setBossTimer(null);
      spawnNextMonster(0); // spawn Slime again
      alert('The Boss escaped! Weapon level insufficient. Level up your sword in the Merchant Shop!');
      return;
    }

    const timer = setInterval(() => {
      setBossTimer(prev => (prev !== null && prev > 0) ? prev - 1 : null);
    }, 1000);

    return () => clearInterval(timer);
  }, [bossTimer, monsterIndex]);

  const handleMonsterTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const currentWeapon = WEAPONS[activeWeaponIndex];
    const dmg = currentWeapon.dps;

    // Create particle
    const pId = Date.now() + Math.random();
    setParticles(prev => [...prev, { id: pId, text: `-${dmg} HP`, x, y }]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== pId));
    }, 800);

    setTotalTaps(prev => prev + 1);

    const newHp = Math.max(monsterHp - dmg, 0);
    setMonsterHp(newHp);

    if (newHp <= 0) {
      // Defeated!
      const currentMonster = MONSTERS[monsterIndex];
      onReward(currentMonster.rewardCoins, currentMonster.boss ? 15 : 1, currentMonster.rewardXp);
      spawnNextMonster();
    }
  };

  const handleBuyWeapon = (weaponIdx: number, cost: number) => {
    if (user.coins < cost) return;
    onReward(-cost, 0, 0); // spend coins
    const newOwned = [...purchasedWeapons, weaponIdx];
    setPurchasedWeapons(newOwned);
    setActiveWeaponIndex(weaponIdx);
    localStorage.setItem('rpg_weapon', JSON.stringify(newOwned));
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remaining = sec % 60;
    return `${mins}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0e] text-slate-100 h-full relative select-none">
      {/* HEADER BAR */}
      <div className="h-14 border-b border-white/10 px-4 flex items-center justify-between shrink-0 bg-[#0a0a0e]">
        <button onClick={onExit} className="flex items-center space-x-2 text-slate-400 hover:text-white font-mono uppercase tracking-wider text-[10px]">
          <ArrowLeft className="w-4 h-4 text-blue-500" />
          <span>Exit Arcade</span>
        </button>
        <span className="font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 text-xs uppercase tracking-widest truncate max-w-[150px]">
          {game.title}
        </span>
        <div className="flex items-center space-x-1 bg-[#15151e] border border-white/10 px-2.5 py-1 rounded-full">
          <span className="text-[10px] font-mono font-bold text-amber-400">💰 {user.coins}</span>
        </div>
      </div>

      {/* GAME RUNNER */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col justify-center">

        {/* ========================================================= */}
        {/* GAME: TIC-TAC-TOE PLATFORM */}
        {/* ========================================================= */}
        {game.id === 'tic-tac-toe' && (
          <div className="max-w-md w-full mx-auto space-y-4 flex-1 flex flex-col justify-between py-2">
            {/* Game Options Selector */}
            {matchStatus === 'lobby' && (
              <div className="space-y-4 my-auto animate-fadeIn">
                <div className="bg-[#0f0f14] border border-white/10 p-6 rounded-3xl text-center space-y-4 shadow-xl">
                  <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/30 rounded-2xl mx-auto flex items-center justify-center text-blue-400">
                    <Swords className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-sm uppercase tracking-tight">Select Match Arena</h3>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
                    Test your tactical coordinates with our advanced artificial intelligence agent or enter the matchmaking queue for simulated P2P multiplayers.
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => { setTttMode('ai'); setMatchStatus('playing'); }}
                      className="py-3 px-4 bg-[#15151e] hover:bg-white/5 font-bold font-mono uppercase tracking-wider text-[9px] rounded-2xl border border-white/10 transition-all active:scale-95 text-white"
                    >
                      <Cpu className="w-5 h-5 text-blue-400 mb-1 mx-auto" />
                      <span>VS AI Rival</span>
                    </button>
                    <button
                      onClick={() => { setTttMode('multi'); startMatchmaking(); }}
                      className="py-3 px-4 bg-blue-600 hover:bg-blue-500 font-bold font-mono uppercase tracking-wider text-[9px] rounded-2xl transition-all active:scale-95 shadow-[0_0_8px_rgba(59,130,246,0.2)] border border-blue-400/20 text-white"
                    >
                      <Swords className="w-5 h-5 text-white mb-1 mx-auto" />
                      <span>Match Lobby</span>
                    </button>
                  </div>
                </div>

                <div className="bg-[#0f0f14] p-4 border border-white/10 rounded-2xl">
                  <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest font-mono block mb-2 text-center">AI DIFFICULTY CONFIG</span>
                  <div className="grid grid-cols-3 gap-2">
                    {(['easy', 'medium', 'hard'] as const).map((diff) => (
                      <button
                        key={diff}
                        onClick={() => setTttDifficulty(diff)}
                        className={`py-1.5 rounded-xl text-[9px] font-mono font-bold uppercase tracking-wider transition-all border ${
                          tttDifficulty === diff
                            ? 'bg-blue-600 text-white border-blue-500/25 shadow-[0_0_8px_rgba(59,130,246,0.2)]'
                            : 'bg-[#15151e] text-slate-400 border-white/5 hover:text-white'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Matching Screen */}
            {matchStatus === 'matching' && (
              <div className="text-center space-y-6 my-auto p-6 bg-[#0f0f14] border border-white/10 rounded-3xl animate-pulse-slow">
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 border-4 border-blue-600/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
                  <Swords className="w-8 h-8 text-blue-400 absolute inset-0 m-auto animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs uppercase tracking-wider font-mono">Searching Arena Rivals...</h4>
                  <p className="text-[10px] text-slate-500 font-mono animate-pulse uppercase">Syncing with global Game Servers</p>
                </div>
              </div>
            )}

            {/* Active TTT Grid */}
            {(matchStatus === 'playing' || matchStatus === 'ended') && (
              <div className="flex-1 flex flex-col justify-between space-y-4 animate-fadeIn">
                {/* Status Bar */}
                <div className="bg-[#0f0f14] border border-white/10 p-3 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-[#15151e] border border-white/10 flex items-center justify-center font-mono font-bold text-[10px] text-blue-400">
                      U
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-bold text-white truncate max-w-[80px] uppercase font-mono">{user.username}</p>
                      <p className="text-[8px] text-emerald-400 font-mono uppercase tracking-wider">X (Player)</p>
                    </div>
                  </div>

                  <span className="text-[8px] bg-[#15151e] border border-white/10 font-mono font-bold px-2 py-0.5 rounded text-slate-400 uppercase tracking-widest">
                    VS
                  </span>

                  <div className="flex items-center space-x-2 text-right">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-white truncate max-w-[80px] uppercase font-mono">
                        {tttMode === 'ai' ? `VortexBot` : opponentName}
                      </p>
                      <p className="text-[8px] text-amber-400 font-mono uppercase tracking-wider">
                        {tttMode === 'ai' ? tttDifficulty : 'O (Opponent)'}
                      </p>
                    </div>
                    {tttMode === 'ai' ? (
                      <div className="w-8 h-8 rounded-full bg-[#15151e] border border-white/10 flex items-center justify-center text-xs">
                        🤖
                      </div>
                    ) : (
                      <img src={opponentAvatar} className="w-8 h-8 rounded-full border border-blue-500 bg-[#15151e]" alt="rival" referrerPolicy="no-referrer" />
                    )}
                  </div>
                </div>

                {/* Tic Tac Toe Grid */}
                <div className="grid grid-cols-3 gap-3 aspect-square max-w-xs mx-auto w-full bg-[#0a0a0e] p-3 rounded-3xl border border-white/10">
                  {board.map((cell, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleTttCellClick(idx)}
                      disabled={!!cell || tttWinner || opponentThinking}
                      className={`rounded-2xl text-4xl font-extrabold flex items-center justify-center transition-all border ${
                        cell ? 'bg-[#15151e] border-transparent' : 'bg-[#15151e]/40 hover:bg-white/5 border-white/5 cursor-pointer'
                      } ${
                        cell === 'X' ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600' : 'text-amber-400'
                      }`}
                    >
                      <AnimatePresence>
                        {cell && (
                          <motion.span
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                          >
                            {cell}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  ))}
                </div>

                {/* Turn Indicators & Game Over results */}
                <div className="text-center min-h-[50px] flex items-center justify-center">
                  {opponentThinking ? (
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-2 uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></span>
                      <span>Formulating tactical vector...</span>
                    </span>
                  ) : tttWinner ? (
                    <div className="space-y-2">
                      <p className="text-xs font-mono font-bold uppercase tracking-wider">
                        {tttWinner === 'X' ? (
                          <span className="text-emerald-400 flex items-center gap-1 justify-center"><Trophy className="w-4 h-4 animate-pulse-slow" /> Victory! +150 Coins</span>
                        ) : tttWinner === 'O' ? (
                          <span className="text-rose-400">Defeat! System failure.</span>
                        ) : (
                          <span className="text-amber-400 text-center">Tie Game! Grid lock.</span>
                        )}
                      </p>
                      <button
                        onClick={handleTttReset}
                        className="py-1.5 px-4 bg-blue-600 hover:bg-blue-500 font-bold font-mono rounded-xl text-[9px] uppercase tracking-wider flex items-center gap-1 mx-auto text-white shadow-[0_0_8px_rgba(59,130,246,0.2)] border border-blue-400/25"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Play Again
                      </button>
                    </div>
                  ) : (
                    <span className="text-[9px] text-slate-500 font-semibold font-mono uppercase tracking-widest">
                      {isXNext ? 'Your Turn (X)' : 'Opponent Turn (O)'}
                    </span>
                  )}
                </div>

                {/* Simulated Chat Interface for Multiplayer matches */}
                {tttMode === 'multi' && (
                  <div className="border border-white/10 bg-[#0f0f14] rounded-2xl flex flex-col h-28 overflow-hidden shrink-0">
                    {/* Chat log */}
                    <div className="flex-1 p-2 overflow-y-auto custom-scrollbar flex flex-col space-y-1">
                      {chatMessages.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                          <span
                            className={`text-[9px] font-mono px-2.5 py-1 rounded-full max-w-[150px] break-words uppercase ${
                              msg.sender === 'me'
                                ? 'bg-blue-600 text-white rounded-br-none border border-blue-400/20'
                                : 'bg-[#15151e] text-slate-300 rounded-bl-none border border-white/5'
                            }`}
                          >
                            {msg.text}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSendChat} className="h-8 border-t border-white/5 flex bg-[#15151e]">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Say hello..."
                        className="flex-1 bg-transparent px-3 text-[9px] font-mono focus:outline-none text-white"
                      />
                      <button type="submit" className="px-3 bg-blue-600 text-white flex items-center justify-center border-l border-white/10 hover:bg-blue-500">
                        <Send className="w-3 h-3" />
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* GAME: MEMORY MATCH CARD GAME */}
        {/* ========================================================= */}
        {game.id === 'memory-match' && (
          <div className="max-w-md w-full mx-auto space-y-4 flex-1 flex flex-col justify-between py-2">
            {/* Game Dashboard Stats */}
            <div className="grid grid-cols-3 gap-2 bg-[#0f0f14] p-3 rounded-2xl border border-white/10 text-center shrink-0">
              <div>
                <p className="text-[8px] text-slate-500 uppercase font-bold font-mono tracking-widest">Flips</p>
                <p className="text-xs font-bold font-mono text-white mt-0.5">{flips}</p>
              </div>
              <div className="border-x border-white/5">
                <p className="text-[8px] text-slate-500 uppercase font-bold font-mono tracking-widest">Time Elapsed</p>
                <p className="text-xs font-bold font-mono text-amber-400 flex items-center justify-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 shrink-0 text-amber-500 animate-pulse-slow" />
                  <span>{formatSeconds(memoryTime)}</span>
                </p>
              </div>
              <div>
                <p className="text-[8px] text-slate-500 uppercase font-bold font-mono tracking-widest">Multiplier</p>
                <p className="text-xs font-bold font-mono text-blue-400 mt-0.5">{memoryTime < 40 ? '3.0x 🔥' : '1.0x'}</p>
              </div>
            </div>

            {/* Grid Container */}
            <div className="grid grid-cols-4 gap-2.5 max-w-xs mx-auto w-full aspect-square bg-[#0a0a0e] p-3 rounded-3xl border border-white/10 flex-1 flex items-center justify-center">
              {cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  disabled={card.isFlipped || card.isMatched || memoryWon}
                  className={`aspect-square rounded-xl text-2xl font-bold flex items-center justify-center transition-all duration-300 transform select-none ${
                    card.isFlipped || card.isMatched
                      ? 'bg-gradient-to-tr from-[#15151e] to-blue-950/20 text-white rotate-0 border border-blue-500/20'
                      : 'bg-[#15151e] text-transparent hover:bg-white/5 border border-white/5 shadow-md'
                  }`}
                >
                  {(card.isFlipped || card.isMatched) ? card.symbol : '❓'}
                </button>
              ))}
            </div>

            {/* Win Banner / Restart */}
            <div className="text-center min-h-[60px] flex items-center justify-center shrink-0">
              {memoryWon ? (
                <div className="space-y-2">
                  <p className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1 justify-center uppercase tracking-wider">
                    <Trophy className="w-4 h-4 animate-pulse-slow" /> Perfect Match! +200 Coins, +10 Gems
                  </p>
                  <button
                    onClick={initializeMemoryGame}
                    className="py-1.5 px-4 bg-blue-600 hover:bg-blue-500 font-bold font-mono rounded-xl text-[9px] uppercase tracking-wider flex items-center gap-1 mx-auto text-white shadow-[0_0_8px_rgba(59,130,246,0.2)] border border-blue-400/25"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Match Again
                  </button>
                </div>
              ) : (
                <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider text-center">Pair all matching emojis to solve the neural tile puzzle.</p>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* GAME: MONSTER TAP RPG CLICKER */}
        {/* ========================================================= */}
        {game.id === 'monster-tap-rpg' && (
          <div className="max-w-md w-full mx-auto space-y-4 flex-1 flex flex-col justify-between py-1 custom-scrollbar">

            {/* Boss Timer Alerts */}
            {bossTimer !== null && (
              <div className="bg-red-950/20 border border-red-500/20 p-2 rounded-xl text-center flex items-center justify-center space-x-2 animate-bounce">
                <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse-slow" />
                <span className="text-[9px] font-mono font-bold text-red-400 uppercase tracking-wider">
                  BOSS BATTLE: Defeat the Boss in {bossTimer}s or it escapes!
                </span>
              </div>
            )}

            {/* Monster Display Frame */}
            <div
              onClick={handleMonsterTap}
              className="bg-gradient-to-tr from-[#0f0f14] to-[#15151e] border border-white/10 rounded-3xl p-6 text-center shadow-lg relative h-48 flex flex-col items-center justify-center cursor-pointer active:scale-[0.98] select-none overflow-hidden shrink-0"
            >
              {/* Particles layer */}
              <AnimatePresence>
                {particles.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ scale: 0.8, opacity: 1, y: p.y - 10, x: p.x }}
                    animate={{ y: p.y - 80, opacity: 0, scale: 1.2 }}
                    exit={{ opacity: 0 }}
                    className="absolute text-rose-500 font-black font-mono text-sm pointer-events-none drop-shadow-md z-30"
                  >
                    {p.text}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Monster Avatar */}
              <motion.div
                animate={{
                  y: [0, -6, 0],
                  scale: monsterHp <= 0 ? [1, 0.8, 0] : [1, 1.02, 1]
                }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="text-7xl select-none relative z-10"
              >
                {MONSTERS[monsterIndex].emoji}
              </motion.div>

              {/* Monster Health bar */}
              <div className="w-full max-w-[200px] mt-4 space-y-1 relative z-10">
                <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono uppercase font-bold">
                  <span>{MONSTERS[monsterIndex].name}</span>
                  <span>{monsterHp}/{MONSTERS[monsterIndex].maxHp} HP</span>
                </div>
                <div className="w-full h-2 bg-[#0a0a0e] rounded-full overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-rose-600 transition-all duration-75"
                    style={{ width: `${(monsterHp / MONSTERS[monsterIndex].maxHp) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Weapon & Merchant Store Area */}
            <div className="bg-[#0f0f14] p-3 border border-white/10 rounded-2xl flex flex-col">
              <span className="text-[9px] text-blue-400 font-bold uppercase tracking-widest block mb-2 flex items-center gap-1 font-mono">
                <ShoppingBag className="w-3.5 h-3.5" /> MERCHANTS ARSENAL
              </span>

              <div className="space-y-2 max-h-36 overflow-y-auto custom-scrollbar pr-1">
                {WEAPONS.map((weap, idx) => {
                  const isOwned = purchasedWeapons.includes(idx);
                  const isEquipped = activeWeaponIndex === idx;

                  return (
                    <div key={idx} className="bg-[#15151e] border border-white/5 p-2 rounded-xl flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-left">
                        <span className="text-xl">{weap.emoji}</span>
                        <div>
                          <p className="text-[11px] font-bold text-white uppercase tracking-tight">{weap.name}</p>
                          <p className="text-[9px] text-blue-400 font-mono">DPS: {weap.dps} HP / click</p>
                        </div>
                      </div>

                      {isEquipped ? (
                        <span className="text-[8px] bg-emerald-600/15 border border-emerald-500/30 text-emerald-400 font-bold font-mono px-2 py-1 rounded uppercase tracking-wider">
                          Equipped
                        </span>
                      ) : isOwned ? (
                        <button
                          onClick={() => { setActiveWeaponIndex(idx); }}
                          className="text-[8px] bg-[#15151e] hover:bg-white/5 border border-white/10 font-bold font-mono px-2 py-1 rounded uppercase tracking-wider text-slate-300"
                        >
                          Equip
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBuyWeapon(idx, weap.cost)}
                          disabled={user.coins < weap.cost}
                          className={`text-[8px] font-bold font-mono px-2.5 py-1 rounded uppercase tracking-wider transition-colors ${
                            user.coins >= weap.cost
                              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                              : 'bg-[#15151e] border border-white/5 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          💰 {weap.cost}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="text-center text-[9px] text-slate-500 font-mono uppercase tracking-wider">
              Tap the monster repeatedly to deal raw sword damage. Upgrade blades at the Forge.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
