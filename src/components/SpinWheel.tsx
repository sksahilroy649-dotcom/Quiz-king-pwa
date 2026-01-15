import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Zap, Coins } from 'lucide-react';
import { toast } from 'sonner';

// Import prize images
import betterLuckImg from '@/assets/better-luck.jpeg';
import iphoneImg from '@/assets/iphone.jpeg';
import laptopImg from '@/assets/laptop.jpeg';
import bikeImg from '@/assets/bike.webp';

interface SpinWheelProps {
  spinLeft: number;
  coins: number;
  isSpinning: boolean;
  onSpin: () => { success: boolean; prizeIndex: number };
}

const SEGMENTS = [
  { color: 'hsl(45, 100%, 50%)', label: '100 Coins', icon: 'coins', prize: '100 Coins', image: null },
  { color: 'hsl(0, 0%, 30%)', label: 'Better Luck', icon: 'luck', prize: 'Better Luck (2 Coins)', image: betterLuckImg },
  { color: 'hsl(220, 90%, 56%)', label: 'iPhone', icon: 'phone', prize: 'iPhone', image: iphoneImg },
  { color: 'hsl(262, 84%, 59%)', label: 'Laptop', icon: 'laptop', prize: 'Lenovo IdeaPad', image: laptopImg },
  { color: 'hsl(0, 0%, 40%)', label: 'Better Luck', icon: 'luck', prize: 'Better Luck (2 Coins)', image: betterLuckImg },
  { color: 'hsl(140, 70%, 45%)', label: 'Bike', icon: 'bike', prize: 'Splendor Bike', image: bikeImg },
];

const SPIN_COST = 50;

const SpinWheel = ({ spinLeft, coins, isSpinning, onSpin }: SpinWheelProps) => {
  const [rotation, setRotation] = useState(0);
  const [showPrize, setShowPrize] = useState(false);
  const [wonPrize, setWonPrize] = useState('');
  const wheelRef = useRef<HTMLDivElement>(null);

  const handleSpin = () => {
    if (spinLeft <= 0 || isSpinning || coins < SPIN_COST) {
      if (coins < SPIN_COST) {
        toast.error(`50 coins चाहिए spin के लिए! आपके पास ${coins} coins हैं`);
      }
      return;
    }
    
    const result = onSpin();
    if (result.success) {
      const segmentAngle = 360 / SEGMENTS.length;
      const targetAngle = (SEGMENTS.length - result.prizeIndex - 1) * segmentAngle + segmentAngle / 2;
      const newRotation = rotation + 360 * 8 + targetAngle + Math.random() * 10 - 5;
      setRotation(newRotation);
      
      setTimeout(() => {
        setWonPrize(SEGMENTS[result.prizeIndex].prize);
        setShowPrize(true);
      }, 5500);
    }
  };

  const closePrize = () => {
    setShowPrize(false);
    setWonPrize('');
  };

  const conicGradient = SEGMENTS.map((seg, i) => {
    const start = (i / SEGMENTS.length) * 360;
    const end = ((i + 1) / SEGMENTS.length) * 360;
    return `${seg.color} ${start}deg ${end}deg`;
  }).join(', ');

  const getSegmentContent = (seg: typeof SEGMENTS[0]) => {
    if (seg.image) {
      return (
        <img 
          src={seg.image} 
          alt={seg.label} 
          className="w-10 h-10 object-contain rounded"
        />
      );
    }
    return <Coins className="w-6 h-6 text-amber-900" />;
  };

  return (
    <>
      <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-foreground">Spin Wheel</h3>
          <div className="text-right">
            <span className="text-sm text-muted-foreground block">{spinLeft} spins left</span>
            <span className="text-xs text-accent">50 coins/spin</span>
          </div>
        </div>
        
        <div className="relative flex items-center justify-center py-6">
          {/* Pointer */}
          <div className="absolute top-2 z-10 flex flex-col items-center">
            <div className="w-0 h-0 border-l-[16px] border-r-[16px] border-t-[24px] border-l-transparent border-r-transparent border-t-accent drop-shadow-lg" />
          </div>
          
          {/* Wheel Container with glow */}
          <div className={`relative ${isSpinning ? 'wheel-glow' : ''}`}>
            {/* Wheel */}
            <div
              ref={wheelRef}
              className="w-64 h-64 rounded-full border-8 border-accent/30 shadow-2xl relative overflow-hidden"
              style={{
                background: `conic-gradient(${conicGradient})`,
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? 'transform 5.5s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none',
              }}
            >
              {/* Segment labels with images */}
              {SEGMENTS.map((seg, i) => {
                const angle = (i / SEGMENTS.length) * 360 + (360 / SEGMENTS.length / 2);
                return (
                  <div
                    key={i}
                    className="absolute w-full h-full flex items-center justify-center"
                    style={{ transform: `rotate(${angle}deg)` }}
                  >
                    <div
                      className="absolute flex flex-col items-center gap-0.5"
                      style={{ 
                        transform: `translateY(-80px) rotate(-${angle}deg)`,
                      }}
                    >
                      {getSegmentContent(seg)}
                      <span className="text-[8px] font-bold text-white drop-shadow-md text-center leading-tight max-w-[45px]">
                        {seg.label}
                      </span>
                    </div>
                  </div>
                );
              })}
              
              {/* Center circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-amber-600 border-4 border-accent/50 shadow-inner flex items-center justify-center">
                  <Zap className="w-8 h-8 text-accent-foreground" />
                </div>
              </div>
            </div>
            
            {/* Decorative dots around wheel */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-3 h-3 rounded-full ${isSpinning ? 'animate-pulse' : ''}`}
                style={{
                  background: i % 2 === 0 ? 'hsl(45, 100%, 70%)' : 'hsl(262, 84%, 59%)',
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${i * 30}deg) translateY(-145px) translateX(-50%)`,
                }}
              />
            ))}
          </div>
          
          {/* Glow effect */}
          <div className={`absolute w-72 h-72 rounded-full blur-3xl -z-10 transition-opacity duration-300 ${isSpinning ? 'opacity-60' : 'opacity-30'}`} 
            style={{ background: 'radial-gradient(circle, hsl(262, 84%, 59%) 0%, transparent 70%)' }} 
          />
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-muted-foreground text-sm">Win amazing prizes!</p>
            <p className="text-xs text-accent">Bike, Laptop, iPhone & more</p>
          </div>
          <Button
            onClick={handleSpin}
            disabled={spinLeft <= 0 || isSpinning || coins < SPIN_COST}
            className="btn-spin px-8 py-6 rounded-xl text-lg gap-2"
          >
            <Zap className="w-5 h-5" />
            {isSpinning ? 'Spinning...' : `Spin (${SPIN_COST} coins)`}
          </Button>
        </div>
      </div>

      {/* Prize Modal */}
      {showPrize && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closePrize}>
          <div className="glass-card rounded-2xl p-8 max-w-sm w-full text-center animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="w-24 h-24 mx-auto mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-accent to-amber-500 flex items-center justify-center animate-bounce">
              {wonPrize.includes('Better Luck') ? (
                <img src={betterLuckImg} alt="Better Luck" className="w-full h-full object-contain" />
              ) : wonPrize.includes('100 Coin') ? (
                <Coins className="w-12 h-12 text-accent-foreground" />
              ) : wonPrize.includes('iPhone') ? (
                <img src={iphoneImg} alt="iPhone" className="w-full h-full object-contain" />
              ) : wonPrize.includes('Laptop') ? (
                <img src={laptopImg} alt="Laptop" className="w-full h-full object-contain" />
              ) : (
                <img src={bikeImg} alt="Bike" className="w-full h-full object-contain" />
              )}
            </div>
            <h2 className="text-2xl font-extrabold text-foreground mb-2">
              {wonPrize.includes('Better Luck') ? 'Better Luck Next Time!' : 'Congratulations!'}
            </h2>
            <p className="text-lg text-accent font-bold mb-4">{wonPrize}</p>
            {wonPrize.includes('Better Luck') && (
              <p className="text-muted-foreground text-sm mb-4">You got 2 coins as consolation!</p>
            )}
            <Button onClick={closePrize} className="btn-primary w-full">
              {wonPrize.includes('Better Luck') ? 'Try Again' : 'Claim Prize'}
            </Button>
          </div>
        </div>
      )}

      <style>{`
        .wheel-glow {
          filter: drop-shadow(0 0 20px hsl(262, 84%, 59%));
        }
        @keyframes wheel-pulse {
          0%, 100% { filter: drop-shadow(0 0 20px hsl(262, 84%, 59%)); }
          50% { filter: drop-shadow(0 0 40px hsl(45, 100%, 70%)); }
        }
      `}</style>
    </>
  );
};

export default SpinWheel;
