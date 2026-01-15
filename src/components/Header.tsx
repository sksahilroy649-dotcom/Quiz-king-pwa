import { Coins, Banknote, Crown } from 'lucide-react';
import SettingsMenu from '@/components/SettingsMenu';

interface HeaderProps {
  coins: number;
  cash: number;
  isLoggedIn?: boolean;
  userId?: string;
  onLogout?: () => void;
}

const Header = ({ coins, cash, isLoggedIn, userId, onLogout }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between mb-6 animate-fade-in bg-[#1a1a2e] rounded-2xl p-4 -mx-4">
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-amber-500 flex items-center justify-center shadow-glow-accent float-animation">
          <Crown className="w-10 h-10 text-accent-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold gradient-text">Quiz King</h1>
          <p className="text-xs text-muted-foreground">Spin & Earn!</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="glass-card rounded-full px-4 py-2 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent to-amber-500 flex items-center justify-center">
              <Coins className="w-3.5 h-3.5 text-accent-foreground" />
            </div>
            <span className="font-bold text-foreground">{coins.toLocaleString()}</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <Banknote className="w-3.5 h-3.5 text-accent-foreground" />
            </div>
            <span className="font-bold text-foreground">₹{cash}</span>
          </div>
        </div>
        
        {isLoggedIn && onLogout && (
          <SettingsMenu userId={userId} onLogout={onLogout} />
        )}
      </div>
    </header>
  );
};

export default Header;
