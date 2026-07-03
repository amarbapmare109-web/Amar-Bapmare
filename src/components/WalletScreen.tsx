import React, { useState } from 'react';
import { Wallet, Coins, Gem, Gift, Send, Play, CreditCard, Sparkles, Plus, CheckCircle } from 'lucide-react';
import { UserProfile, WalletTransaction } from '../types';

interface WalletScreenProps {
  user: UserProfile;
  transactions: WalletTransaction[];
  onAddTransaction: (tx: WalletTransaction) => void;
  onReward: (coins: number, gems: number, xp: number) => void;
  triggerAd: (type: 'rewarded', callback: (completed: boolean) => void) => void;
  setAppState: React.Dispatch<React.SetStateAction<any>>;
}

export const WalletScreen: React.FC<WalletScreenProps> = ({
  user,
  transactions,
  onAddTransaction,
  onReward,
  triggerAd,
  setAppState
}) => {
  const [giftCode, setGiftCode] = useState('');
  const [referralInput, setReferralInput] = useState('');
  const [message, setMessage] = useState('');
  const [referralClaimed, setReferralClaimed] = useState(false);

  // Handle Gift Code Redemption
  const handleRedeemGift = (e: React.FormEvent) => {
    e.preventDefault();
    const code = giftCode.trim().toUpperCase();

    let coins = 0;
    let gems = 0;
    let feedback = '';

    if (code === 'STARTUP500') {
      coins = 500;
      feedback = 'Promo code accepted! +500 Coins added!';
    } else if (code === 'GEMPOWER') {
      gems = 50;
      feedback = 'Promo code accepted! +50 Gems added!';
    } else if (code === 'VORTEX2026') {
      coins = 1000;
      gems = 20;
      feedback = 'VIP code accepted! +1,000 Coins & +20 Gems!';
    } else {
      setMessage('Invalid gift code. Try "STARTUP500" or "VORTEX2026".');
      return;
    }

    // Add reward
    onReward(coins, gems, 0);

    // Create wallet transaction
    const newTx: WalletTransaction = {
      id: `tx_${Math.random().toString(36).substr(2, 9)}`,
      type: 'gift_code',
      amount: coins > 0 ? coins : gems,
      currency: coins > 0 ? 'coins' : 'gems',
      description: `Redeemed Gift Code: ${code}`,
      date: new Date().toISOString()
    };
    onAddTransaction(newTx);
    setMessage(feedback);
    setGiftCode('');
  };

  // Handle Referral Code Input
  const handleClaimReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referralInput.trim()) return;

    if (referralInput.toUpperCase() === user.referralCode) {
      setMessage('You cannot enter your own referral code!');
      return;
    }

    onReward(250, 5, 50); // reward coins and gems
    setReferralClaimed(true);

    const newTx: WalletTransaction = {
      id: `tx_ref_${Date.now()}`,
      type: 'referral',
      amount: 250,
      currency: 'coins',
      description: `Referral bonus via code: ${referralInput.toUpperCase()}`,
      date: new Date().toISOString()
    };
    onAddTransaction(newTx);
    setMessage('Referral claimed successfully! +250 Coins, +5 Gems, +50 XP!');
    setReferralInput('');
  };

  // Watch Rewarded Ad Action
  const handleWatchRewardedAd = () => {
    triggerAd('rewarded', (completed) => {
      if (completed) {
        onReward(50, 10, 30);
        const newTx: WalletTransaction = {
          id: `tx_ad_${Date.now()}`,
          type: 'ad_bonus',
          amount: 50,
          currency: 'coins',
          description: 'Rewarded Video Ad Viewer Bonus',
          date: new Date().toISOString()
        };
        onAddTransaction(newTx);
        setMessage('Ad complete! +50 Coins & +10 Gems have been credited.');
      }
    });
  };

  // Unlock Premium Status Simulation
  const handlePurchasePremium = () => {
    if (user.coins < 800) {
      setMessage('Insufficient Coin balance. You need at least 800 Coins to activate Premium.');
      return;
    }

    onReward(-800, 0, 0); // subtract coins
    setAppState((prev: any) => {
      if (!prev.user) return prev;
      return {
        ...prev,
        user: {
          ...prev.user,
          isPremium: true
        }
      };
    });

    const newTx: WalletTransaction = {
      id: `tx_prem_${Date.now()}`,
      type: 'spend',
      amount: 800,
      currency: 'coins',
      description: 'Purchased Premium VIP Elite Membership',
      date: new Date().toISOString()
    };
    onAddTransaction(newTx);
    setMessage('Congratulations! Your account is now upgraded to Premium VIP Elite!');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0e] text-slate-100 p-4 select-none h-full overflow-y-auto custom-scrollbar">
      {/* Header */}
      <h2 className="text-xl font-bold font-display tracking-tight flex items-center gap-1.5 shrink-0 mb-3 uppercase">
        <Wallet className="w-5 h-5 text-blue-500 animate-pulse-slow" />
        <span>Gamer Wallet</span>
      </h2>

      {message && (
        <div className="p-3 bg-blue-950/20 border border-blue-500/20 rounded-xl text-xs text-center text-blue-300 mb-3 select-none font-mono">
          {message}
        </div>
      )}

      {/* Coins & Gems balance cards */}
      <div className="grid grid-cols-2 gap-3 shrink-0">
        {/* Coin Card */}
        <div className="bg-gradient-to-br from-amber-500/5 to-amber-500/15 border border-amber-500/20 rounded-3xl p-4 flex flex-col justify-between h-28 relative overflow-hidden shadow-lg shadow-amber-500/5">
          <div className="absolute top-2 right-2 w-16 h-16 bg-amber-500/5 rounded-full blur-xl"></div>
          <div className="flex items-center space-x-2 text-amber-400 font-mono">
            <Coins className="w-5 h-5" />
            <span className="text-[9px] font-bold uppercase tracking-widest">COIN BALANCE</span>
          </div>
          <p className="text-2xl font-black font-mono tracking-tight text-white mt-2">
            {user.coins.toLocaleString()}
          </p>
          <span className="text-[9px] text-amber-500/80 font-mono mt-1">Earn in arcade games</span>
        </div>

        {/* Gems Card */}
        <div className="bg-gradient-to-br from-blue-500/5 to-blue-500/15 border border-blue-500/25 rounded-3xl p-4 flex flex-col justify-between h-28 relative overflow-hidden shadow-lg shadow-blue-500/5">
          <div className="absolute top-2 right-2 w-16 h-16 bg-blue-500/5 rounded-full blur-xl"></div>
          <div className="flex items-center space-x-2 text-blue-400 font-mono">
            <Gem className="w-4 h-4" />
            <span className="text-[9px] font-bold uppercase tracking-widest">GEMS BALANCE</span>
          </div>
          <p className="text-2xl font-black font-mono tracking-tight text-white mt-2">
            {user.gems}
          </p>
          <span className="text-[9px] text-blue-400/80 font-mono mt-1">Gems unlock Premium</span>
        </div>
      </div>

      {/* AdMob and Premium membership panels */}
      <div className="space-y-3 mt-4 shrink-0">
        {/* AdMob Rewarded Trigger */}
        <div className="bg-[#0f0f14] p-3.5 border border-white/10 rounded-2xl flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[8px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-extrabold uppercase tracking-widest font-mono">AdMob</span>
            <h4 className="text-xs font-bold uppercase tracking-tight">Watch Video Ad</h4>
            <p className="text-[10px] text-slate-400 font-mono">Watch video to credit +50 Coins, +10 Gems</p>
          </div>
          <button
            onClick={handleWatchRewardedAd}
            className="flex items-center space-x-1 py-1.5 px-3 bg-blue-600 hover:bg-blue-500 font-bold rounded-xl text-xs text-white shadow-[0_0_8px_rgba(59,130,246,0.2)] border border-blue-400/20 font-mono text-[10px] uppercase tracking-wider"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Play Ad</span>
          </button>
        </div>

        {/* Premium Upgrade */}
        <div className="bg-gradient-to-r from-blue-950/20 to-blue-900/10 border border-blue-500/20 p-3.5 rounded-2xl flex items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600/5 animate-pulse-slow"></div>
          <div className="space-y-0.5 relative z-10">
            <h4 className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-400 flex items-center gap-1 uppercase tracking-wider font-mono">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Premium VIP Elite</span>
            </h4>
            <p className="text-[10px] text-slate-400 font-mono">Unlocks gold name badge on Leaderboards</p>
          </div>

          {user.isPremium ? (
            <span className="text-[9px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono uppercase tracking-wider px-3 py-1.5 rounded-xl flex items-center gap-1 font-bold">
              <CheckCircle className="w-3.5 h-3.5" /> Active VIP
            </span>
          ) : (
            <button
              onClick={handlePurchasePremium}
              className="flex items-center space-x-1 py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold rounded-xl text-[10px] uppercase tracking-wider shadow-[0_0_8px_rgba(59,130,246,0.25)] border border-blue-400/20 relative z-10"
            >
              <span>Buy (💰 800)</span>
            </button>
          )}
        </div>
      </div>

      {/* Gift Codes & Referral Inputs */}
      <div className="grid grid-cols-2 gap-3 mt-4 shrink-0">
        {/* Redeem Gift Code */}
        <form onSubmit={handleRedeemGift} className="bg-[#0f0f14]/60 p-3.5 border border-white/10 rounded-2xl space-y-2">
          <label className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1 font-mono">
            <Gift className="w-3.5 h-3.5 text-rose-400" /> Gift Voucher
          </label>
          <div className="flex bg-[#15151e] rounded-xl border border-white/10 overflow-hidden">
            <input
              type="text"
              value={giftCode}
              onChange={(e) => setGiftCode(e.target.value)}
              placeholder="STARTUP500"
              className="w-full bg-transparent px-2.5 py-1.5 text-xs text-slate-200 uppercase focus:outline-none placeholder-slate-600 font-mono"
            />
            <button type="submit" className="px-2.5 bg-blue-600 text-white flex items-center justify-center border-l border-white/5 hover:bg-blue-500">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Enter Referral */}
        <form onSubmit={handleClaimReferral} className="bg-[#0f0f14]/60 p-3.5 border border-white/10 rounded-2xl space-y-2">
          <label className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1 font-mono">
            <CreditCard className="w-3.5 h-3.5 text-blue-400" /> Friend Referral
          </label>
          <div className="flex bg-[#15151e] rounded-xl border border-white/10 overflow-hidden">
            <input
              type="text"
              value={referralInput}
              disabled={referralClaimed}
              onChange={(e) => setReferralInput(e.target.value)}
              placeholder={referralClaimed ? 'CLAIMED' : 'PEER_CODE'}
              className="w-full bg-transparent px-2.5 py-1.5 text-xs text-slate-200 uppercase focus:outline-none placeholder-slate-600 font-mono"
            />
            <button
              type="submit"
              disabled={referralClaimed}
              className={`px-2.5 flex items-center justify-center text-white border-l border-white/5 ${
                referralClaimed ? 'bg-[#15151e] text-slate-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* Transaction History Log */}
      <div className="mt-4 flex-1 flex flex-col min-h-[160px]">
        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest font-mono block mb-2">
          TRANSACTIONS LEDGER (SECURE)
        </span>
        <div className="flex-1 bg-[#0f0f14]/60 rounded-2xl border border-white/10 p-2.5 overflow-y-auto custom-scrollbar space-y-1.5">
          {transactions.map((tx) => (
            <div key={tx.id} className="bg-[#15151e] p-2 rounded-xl flex items-center justify-between border border-white/5">
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-white truncate uppercase tracking-tight">{tx.description}</p>
                <p className="text-[9px] text-slate-500 font-mono">
                  {new Date(tx.date).toLocaleDateString()} at {new Date(tx.date).toLocaleTimeString()}
                </p>
              </div>
              <span
                className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                  tx.type === 'spend'
                    ? 'bg-red-500/10 text-red-400'
                    : 'bg-emerald-500/10 text-emerald-400'
                }`}
              >
                {tx.type === 'spend' ? '-' : '+'}
                {tx.currency === 'coins' ? '💰' : '💎'}
                {tx.amount}
              </span>
            </div>
          ))}

          {transactions.length === 0 && (
            <div className="text-center py-6 text-[10px] text-slate-500 font-mono uppercase">No transaction entries found.</div>
          )}
        </div>
      </div>
    </div>
  );
};
