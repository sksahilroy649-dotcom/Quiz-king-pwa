import { useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import Header from '@/components/Header';
import LoginModal from '@/components/LoginModal';
import SpinWheel from '@/components/SpinWheel';
import QuizSelector from '@/components/QuizSelector';
import SocialRewards from '@/components/SocialRewards';
import AdModal from '@/components/AdModal';
import { Button } from '@/components/ui/button';
import { Wallet, Users, Banknote } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const navigate = useNavigate();
  const {
    coins,
    cash,
    isLoggedIn,
    user,
    spinLeft,
    isSpinning,
    showAd,
    socialFollowed,
    logout,
    spin,
    finishAd,
    socialFollow,
    withdraw,
  } = useGameState();

  const handleWithdraw = () => {
    if (withdraw()) {
      toast.success('₹10 added to cash!');
    } else {
      toast.error('1000 coins चाहिए!');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-[#1a1a2e] px-4 pt-6">
        <div className="container max-w-lg mx-auto">
          <Header 
            coins={coins} 
            cash={cash} 
            isLoggedIn={isLoggedIn}
            userId={user?.id}
            onLogout={logout}
          />
        </div>
      </div>
      <div className="flex-1 px-4 py-6 bg-background">
        <div className="container max-w-lg mx-auto">
        
        {!isLoggedIn && <LoginModal onLogin={() => {}} />}
        
        {isLoggedIn && (
          <main className="space-y-4">
            <QuizSelector />
            <SpinWheel
              spinLeft={spinLeft}
              coins={coins}
              isSpinning={isSpinning}
              onSpin={spin}
            />
            
            {/* Social Rewards - Prominent Section */}
            <SocialRewards 
              onSocialFollow={socialFollow}
              socialFollowed={socialFollowed}
            />
            
            {/* Convert Coins to Cash */}
            <Button onClick={handleWithdraw} className="w-full h-12 btn-glass gap-2">
              <Banknote className="w-5 h-5" /> Convert Coins (1000 → ₹10)
            </Button>
            
            {/* Referral Button */}
            <Button 
              onClick={() => navigate('/referral')}
              className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 gap-2"
            >
              <Users className="w-5 h-5" />
              Referral - Earn 200 Coins
            </Button>
            
            {/* Withdraw Button */}
            <Button 
              onClick={() => navigate('/withdraw')}
              className="w-full h-14 btn-primary gap-2 text-lg font-bold"
            >
              <Wallet className="w-6 h-6" />
              Withdraw Cash (₹{cash.toFixed(2)})
            </Button>
          </main>
        )}
        
          <AdModal isOpen={showAd} onComplete={finishAd} />
        </div>
      </div>
    </div>
  );
};

export default Index;
