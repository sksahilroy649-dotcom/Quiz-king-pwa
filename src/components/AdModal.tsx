import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { MonitorPlay } from 'lucide-react';

interface AdModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

const AdModal = ({ isOpen, onComplete }: AdModalProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      return;
    }

    const duration = 5000;
    const step = 100;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += step;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(timer);
        setTimeout(onComplete, 300);
      }
    }, step);

    return () => clearInterval(timer);
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-background/90 backdrop-blur-md p-4">
      <div className="glass-card rounded-2xl p-8 w-full max-w-sm animate-scale-in text-center shadow-card">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <MonitorPlay className="w-8 h-8 text-foreground" />
        </div>
        
        <h3 className="text-xl font-bold text-foreground mb-2">Watching Ad...</h3>
        <p className="text-muted-foreground text-sm mb-6">Please wait to claim your reward</p>
        
        <div className="space-y-3">
          <Progress value={progress} className="h-3 bg-muted" />
          <p className="text-2xl font-extrabold gradient-text">{progress}%</p>
        </div>
      </div>
    </div>
  );
};

export default AdModal;
