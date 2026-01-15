import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

const SPIN_LIMIT_PER_DAY = 10;
const SPIN_COST = 50;
const REFER_COINS = 200;
const SOCIAL_REWARD = 50;
const COINS_KEY = 'quiz_coins_v4';
const DAILY_KEY = 'quiz_daily_v4';
const CASH_KEY = 'quiz_cash';
const REFERRAL_KEY = 'quiz_referral_code';
const USED_REFERRALS_KEY = 'quiz_used_referrals';
const SOCIAL_FOLLOWED_KEY = 'quiz_social_followed';

interface DailyState {
  date: string;
  spinLeft: number;
}

interface ProfileData {
  social_followed: string[];
}

// Generate unique referral code
const generateReferralCode = () => {
  return 'QK' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const useGameState = () => {
  const [coins, setCoins] = useState(() => {
    return parseInt(localStorage.getItem(COINS_KEY) || '100', 10); // Start with 100 coins
  });
  
  const [cash, setCash] = useState(() => {
    return parseInt(localStorage.getItem(CASH_KEY) || '0', 10);
  });
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [referralCode, setReferralCode] = useState('');

  const [usedReferrals, setUsedReferrals] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem(USED_REFERRALS_KEY) || '[]');
  });
  
  const [daily, setDaily] = useState<DailyState>(() => {
    const today = new Date().toLocaleDateString();
    const stored = JSON.parse(localStorage.getItem(DAILY_KEY) || '{}');
    if (!stored.date || stored.date !== today) {
      return { date: today, spinLeft: SPIN_LIMIT_PER_DAY };
    }
    return stored;
  });

  const [socialFollowed, setSocialFollowed] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem(SOCIAL_FOLLOWED_KEY) || '[]');
  });

  // Fetch social_followed and referral_code from database when user logs in
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('social_followed, referral_code')
          .eq('id', user.id)
          .single();
        
        if (data?.social_followed) {
          setSocialFollowed(data.social_followed);
        }
        if (data?.referral_code) {
          setReferralCode(data.referral_code);
        }
      }
    };
    fetchUserData();
  }, [user]);

  const [isSpinning, setIsSpinning] = useState(false);
  const [showAd, setShowAd] = useState(false);

  // Listen to auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setIsLoggedIn(!!session?.user);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoggedIn(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Persist state changes
  useEffect(() => {
    localStorage.setItem(COINS_KEY, coins.toString());
  }, [coins]);

  useEffect(() => {
    localStorage.setItem(CASH_KEY, cash.toString());
  }, [cash]);

  useEffect(() => {
    localStorage.setItem(DAILY_KEY, JSON.stringify(daily));
  }, [daily]);

  useEffect(() => {
    localStorage.setItem(USED_REFERRALS_KEY, JSON.stringify(usedReferrals));
  }, [usedReferrals]);

  // Persist socialFollowed to localStorage
  useEffect(() => {
    localStorage.setItem(SOCIAL_FOLLOWED_KEY, JSON.stringify(socialFollowed));
  }, [socialFollowed]);

  const login = useCallback(() => {
    // This is called after successful Supabase auth
    // The auth state listener will update isLoggedIn
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  const addCoins = useCallback((amount: number) => {
    setCoins(prev => prev + amount);
  }, []);

  const spin = useCallback(() => {
    if (daily.spinLeft <= 0 || isSpinning || coins < SPIN_COST) {
      return { success: false, prizeIndex: 0 };
    }
    
    // Deduct spin cost
    setCoins(prev => prev - SPIN_COST);
    setIsSpinning(true);
    
    // Weighted random for prizes (Better Luck has higher chance)
    const weights = [5, 40, 1, 1, 40, 1]; // 100 coins, Better Luck, iPhone, Laptop, Better Luck, Bike
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    let prizeIndex = 0;
    
    for (let i = 0; i < weights.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        prizeIndex = i;
        break;
      }
    }
    
    // Calculate reward based on prize
    const rewards = [100, 2, 0, 0, 2, 0]; // Coins for each prize
    const reward = rewards[prizeIndex];
    
    // After spin animation completes
    setTimeout(() => {
      if (reward > 0) {
        addCoins(reward);
      }
      setDaily(prev => ({ ...prev, spinLeft: prev.spinLeft - 1 }));
      setShowAd(true);
    }, 5500);
    
    return { success: true, prizeIndex };
  }, [daily.spinLeft, isSpinning, coins, addCoins]);

  const finishAd = useCallback(() => {
    setShowAd(false);
    setIsSpinning(false);
  }, []);

  const applyReferralCode = useCallback((code: string) => {
    // Can't use own code
    if (code === referralCode) {
      return { success: false, message: 'अपना खुद का code use नहीं कर सकते!' };
    }
    
    // Check if already used a referral
    if (usedReferrals.length > 0) {
      return { success: false, message: 'आप पहले ही एक referral use कर चुके हैं!' };
    }
    
    // Valid code format check
    if (!code.startsWith('QK') || code.length !== 8) {
      return { success: false, message: 'Invalid referral code!' };
    }
    
    // Apply referral
    addCoins(REFER_COINS);
    setUsedReferrals([code]);
    
    return { success: true, message: `${REFER_COINS} coins मिले referral से!` };
  }, [referralCode, usedReferrals, addCoins]);

  const socialFollow = useCallback(async (platform: string) => {
    const urls: Record<string, string> = {
      ig: 'https://www.instagram.com/quizking1000',
      yt: 'https://www.youtube.com/@Quizkingearnmoney',
      tg: 'https://t.me/Quizkingearnmony'
    };
    
    // Always open the social link
    if (urls[platform]) {
      window.open(urls[platform], '_blank');
    }
    
    // Only give reward if not already followed this platform
    if (!socialFollowed.includes(platform)) {
      // Small delay to ensure user has been redirected
      setTimeout(async () => {
        addCoins(SOCIAL_REWARD);
        const newFollowed = [...socialFollowed, platform];
        setSocialFollowed(newFollowed);
        
        // Save to database if user is logged in
        if (user) {
          await supabase
            .from('profiles')
            .update({ social_followed: newFollowed })
            .eq('id', user.id);
        }
      }, 1000);
    }
    // If already followed, button still works but no reward given
  }, [socialFollowed, addCoins, user]);

  const withdraw = useCallback(() => {
    if (coins >= 1000) {
      setCoins(prev => prev - 1000);
      setCash(prev => prev + 10);
      return true;
    }
    return false;
  }, [coins]);

  return {
    coins,
    cash,
    isLoggedIn,
    user,
    spinLeft: daily.spinLeft,
    isSpinning,
    showAd,
    socialFollowed,
    referralCode,
    usedReferrals,
    login,
    logout,
    spin,
    finishAd,
    applyReferralCode,
    socialFollow,
    withdraw,
    addCoins,
  };
};
