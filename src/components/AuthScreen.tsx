import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, KeyRound, Smartphone, ShieldCheck, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthScreenProps {
  onAuthSuccess: (user: UserProfile) => void;
  userEmail: string;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess, userEmail }) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'otp' | 'forgot'>('signin');
  const [email, setEmail] = useState(userEmail || 'gamer@vortex.com');
  const [password, setPassword] = useState('password123');
  const [username, setUsername] = useState('EliteGamer');
  const [phone, setPhone] = useState('+1 (555) 019-2831');
  const [otpCode, setOtpCode] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Handle Google Sign-In
  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const googleUser: UserProfile = {
        id: 'google_user_123',
        email: userEmail || 'amarbapmare109@gmail.com',
        username: userEmail ? userEmail.split('@')[0] : 'GooglePlayer',
        avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=GooglePlayer',
        xp: 120,
        level: 2,
        coins: 400,
        gems: 15,
        isPremium: false,
        referralCode: 'GOOG999',
        achievements: ['first_win'],
        dailyMissionsClaimed: [],
        createdAt: new Date().toISOString(),
        banned: false,
      };
      onAuthSuccess(googleUser);
    }, 1200);
  };

  // Handle OTP request
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingOtp(true);
    setTimeout(() => {
      setIsSendingOtp(false);
      setOtpSent(true);
      setMessage('SMS OTP sent! Enter "777777" to authenticate.');
    }, 1500);
  };

  // Handle OTP Verification
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== '777777') {
      setMessage('Invalid code. Try "777777".');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const otpUser: UserProfile = {
        id: 'otp_user_456',
        email: 'otp_user@vortex.com',
        username: 'PhoneWarrior',
        avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=PhoneWarrior',
        xp: 0,
        level: 1,
        coins: 250,
        gems: 5,
        isPremium: false,
        referralCode: 'PHONE88',
        achievements: [],
        dailyMissionsClaimed: [],
        createdAt: new Date().toISOString(),
        banned: false,
      };
      onAuthSuccess(otpUser);
    }, 1000);
  };

  // Handle standard Sign In
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const standardUser: UserProfile = {
        id: 'standard_user_789',
        email: email,
        username: email.split('@')[0],
        avatarUrl: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${email.split('@')[0]}`,
        xp: 350,
        level: 3,
        coins: 600,
        gems: 25,
        isPremium: false,
        referralCode: 'VRTX789',
        achievements: [],
        dailyMissionsClaimed: [],
        createdAt: new Date().toISOString(),
        banned: false,
      };
      onAuthSuccess(standardUser);
    }, 1000);
  };

  // Handle standard Registration
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newUser: UserProfile = {
        id: `user_${Math.random().toString(36).substr(2, 9)}`,
        email: email,
        username: username,
        avatarUrl: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${username}`,
        xp: 50,
        level: 1,
        coins: 300,
        gems: 10,
        isPremium: false,
        referralCode: username.toUpperCase().substr(0, 5) + '111',
        achievements: [],
        dailyMissionsClaimed: [],
        createdAt: new Date().toISOString(),
        banned: false,
      };
      onAuthSuccess(newUser);
    }, 1200);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(`Instructions to reset password have been sent to ${email}`);
    setTimeout(() => {
      setActiveTab('signin');
      setMessage('');
    }, 3000);
  };

  return (
    <div className="flex-1 flex flex-col justify-center p-6 bg-[#0a0a0e] text-slate-100 select-none relative overflow-y-auto custom-scrollbar">
      {/* Decorative gradient glowing orb */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-xs w-full mx-auto space-y-6 relative z-10 py-4">
        {/* Logo/Header */}
        <div className="text-center space-y-2">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-14 h-14 mx-auto bg-gradient-to-tr from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/20 font-display text-2xl font-extrabold text-white"
          >
            V
          </motion.div>
          <h2 className="text-xl font-bold font-display tracking-tight bg-gradient-to-r from-white via-blue-200 to-blue-300 bg-clip-text text-transparent uppercase">
            Vortex Arcade
          </h2>
          <p className="text-[10px] text-slate-400 font-mono tracking-tight uppercase">STABLE REWARDS CLIENT v2.4</p>
        </div>

        {message && (
          <div className="p-3 bg-blue-950/40 border border-blue-500/30 rounded-xl text-xs text-center text-blue-300 font-mono">
            {message}
          </div>
        )}

        {/* Tab Selector */}
        {activeTab !== 'forgot' && activeTab !== 'otp' && (
          <div className="grid grid-cols-2 bg-[#0f0f14] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => { setActiveTab('signin'); setMessage(''); }}
              className={`py-2 text-[10px] uppercase font-mono tracking-wider rounded-lg transition-all ${
                activeTab === 'signin' ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)] font-bold' : 'text-slate-500 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setActiveTab('signup'); setMessage(''); }}
              className={`py-2 text-[10px] uppercase font-mono tracking-wider rounded-lg transition-all ${
                activeTab === 'signup' ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)] font-bold' : 'text-slate-500 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === 'signin' && (
            <motion.form
              key="signin"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handleSignIn}
              className="space-y-4"
            >
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full bg-[#0f0f14] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/40 text-slate-100 font-mono"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-[#0f0f14] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/40 text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setActiveTab('forgot')}
                  className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold font-mono"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-2 shadow-[0_0_15px_rgba(59,130,246,0.3)] border border-blue-400/20"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Enter Arcade</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.form>
          )}

          {activeTab === 'signup' && (
            <motion.form
              key="signup"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onSubmit={handleSignUp}
              className="space-y-4"
            >
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Gamer Username"
                    className="w-full bg-[#0f0f14] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/40 text-slate-100 font-mono"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full bg-[#0f0f14] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/40 text-slate-100 font-mono"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-[#0f0f14] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/40 text-slate-100 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-2 shadow-[0_0_15px_rgba(59,130,246,0.3)] border border-blue-400/20"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Create Profile</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.form>
          )}

          {activeTab === 'otp' && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-3">
                  <div className="text-[11px] text-slate-400 leading-relaxed mb-1 font-mono">
                    Enter your phone number below. We will simulate sending a secure SMS OTP verification code.
                  </div>
                  <div className="relative">
                    <Smartphone className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone Number"
                      className="w-full bg-[#0f0f14] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/40 text-slate-100 font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSendingOtp}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center space-x-2"
                  >
                    {isSendingOtp ? 'Sending SMS...' : 'Request Verification Code'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-3">
                  <div className="relative">
                    <ShieldCheck className="absolute left-3.5 top-3 w-4 h-4 text-emerald-400" />
                    <input
                      type="text"
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Enter 6-Digit Code"
                      maxLength={6}
                      className="w-full bg-[#0f0f14] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/40 text-slate-100 tracking-widest text-center font-mono font-bold"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center justify-center space-x-2 font-mono uppercase tracking-wider"
                  >
                    {isLoading ? 'Verifying...' : 'Verify & Enter'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-center text-[10px] text-slate-400 hover:text-white w-full block mt-2 font-mono uppercase"
                  >
                    Change Phone Number
                  </button>
                </form>
              )}
            </motion.div>
          )}

          {activeTab === 'forgot' && (
            <motion.form
              key="forgot"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleForgotPassword}
              className="space-y-4"
            >
              <div className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider font-mono">Reset Password</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                  Enter your email address and we will generate a secure simulated link to restore account access.
                </p>
              </div>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full bg-[#0f0f14] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/40 text-slate-100 font-mono"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs uppercase tracking-wider rounded-xl"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('signin')}
                  className="flex-1 py-2.5 bg-[#15151e] hover:bg-[#1f1f2e] text-slate-300 font-mono text-xs uppercase tracking-wider rounded-xl border border-white/5"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Auth alternatives */}
        {activeTab !== 'forgot' && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between text-[9px] text-slate-500 uppercase font-mono tracking-wider">
              <span className="w-1/4 h-px bg-white/5"></span>
              <span>Or connect via</span>
              <span className="w-1/4 h-px bg-white/5"></span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="flex items-center justify-center space-x-1.5 py-2 bg-[#0f0f14] hover:bg-[#15151e] border border-white/10 rounded-xl text-[11px] font-mono transition-colors text-slate-300"
              >
                {/* Custom Google logo */}
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#ea4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.47 14.97 0 12 0 7.35 0 3.37 2.67 1.46 6.57l3.79 2.94C6.14 6.74 8.84 5.04 12 5.04z" />
                  <path fill="#4285f4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.47h6.45c-.28 1.47-1.11 2.71-2.36 3.55l3.66 2.84c2.14-1.97 3.74-4.87 3.74-8.5z" />
                  <path fill="#fbbc05" d="M5.25 14.49c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L1.46 6.57C.53 8.41 0 10.45 0 12.6s.53 4.19 1.46 6.03l3.79-2.94C4.87 15.69 4.87 14.49 5.25 14.49z" />
                  <path fill="#34a853" d="M12 24c3.24 0 5.97-1.07 7.96-2.91l-3.66-2.84c-1.01.68-2.31 1.09-3.8 1.09-3.16 0-5.86-1.7-6.75-4.47L1.46 17.77C3.37 21.33 7.35 24 12 24z" />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab(activeTab === 'otp' ? 'signin' : 'otp');
                  setMessage('');
                }}
                className={`flex items-center justify-center space-x-1.5 py-2 border rounded-xl text-[11px] font-mono transition-all ${
                  activeTab === 'otp'
                    ? 'bg-blue-600/10 border-blue-500/30 text-blue-400 font-bold shadow-[0_0_8px_rgba(59,130,246,0.2)]'
                    : 'bg-[#0f0f14] hover:bg-[#15151e] border-white/10 text-slate-300'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5 text-blue-400" />
                <span>SMS OTP</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
