import { Instagram, Youtube, Send, Gift, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SocialRewardsProps {
  onSocialFollow: (platform: string) => void;
  socialFollowed: string[];
}

const SocialRewards = ({ onSocialFollow, socialFollowed }: SocialRewardsProps) => {
  const socialLinks = [
    { 
      id: 'ig', 
      name: 'Instagram', 
      Icon: Instagram, 
      color: 'from-pink-500 to-purple-600',
      reward: 50 
    },
    { 
      id: 'yt', 
      name: 'YouTube', 
      Icon: Youtube, 
      color: 'from-red-500 to-red-600',
      reward: 50 
    },
    { 
      id: 'tg', 
      name: 'Telegram', 
      Icon: Send, 
      color: 'from-blue-400 to-blue-600',
      reward: 50 
    },
  ];

  return (
    <Card className="glass-card animate-slide-up" style={{ animationDelay: '0.35s' }}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Gift className="w-5 h-5 text-accent" />
          Social Rewards
        </CardTitle>
        <p className="text-sm text-muted-foreground">Follow & earn 50 coins each!</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {socialLinks.map(({ id, name, Icon, color, reward }) => {
            const isFollowed = socialFollowed.includes(id);
            return (
              <Button
                key={id}
                onClick={() => onSocialFollow(id)}
                className={`relative h-20 flex-col gap-1 transition-all duration-300 ${
                  isFollowed 
                    ? 'bg-muted/30 border border-green-500/50 text-foreground hover:bg-muted/50' 
                    : `bg-gradient-to-br ${color} hover:scale-105 hover:shadow-lg`
                }`}
              >
                {isFollowed ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <Icon className="w-4 h-4 opacity-70" />
                  </>
                ) : (
                  <Icon className="w-6 h-6" />
                )}
                <span className="text-xs font-medium">{name}</span>
                {!isFollowed && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs px-1.5 py-0.5 rounded-full font-bold">
                    +{reward}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialRewards;
