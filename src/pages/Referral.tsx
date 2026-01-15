import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Check, Users, Gift, TrendingUp, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ReferralStats {
  totalReferrals: number;
  totalCoinsEarned: number;
}

const Referral = () => {
  const navigate = useNavigate();
  const [referralCode, setReferralCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [hasUsedReferral, setHasUsedReferral] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<ReferralStats>({ totalReferrals: 0, totalCoinsEarned: 0 });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      navigate('/');
      return;
    }
    setUser(session.user);
    fetchProfile(session.user.id);
    fetchReferralStats(session.user.id);
  };

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('referral_code, referred_by')
      .eq('id', userId)
      .maybeSingle();
    
    if (data) {
      setReferralCode(data.referral_code || '');
      setHasUsedReferral(!!data.referred_by);
    }
  };

  const fetchReferralStats = async (userId: string) => {
    // Get the user's referral code first
    const { data: profile } = await supabase
      .from('profiles')
      .select('referral_code')
      .eq('id', userId)
      .maybeSingle();
    
    if (!profile?.referral_code) return;

    // Count how many people used this referral code
    const { count: referralCount } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('referred_by', profile.referral_code);

    // Calculate total coins earned from referrals (200 per referral)
    const totalReferrals = referralCount || 0;
    const totalCoinsEarned = totalReferrals * 200;

    setStats({ totalReferrals, totalCoinsEarned });
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success('Code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyReferral = async () => {
    if (!inputCode.trim() || !user) return;
    
    const code = inputCode.trim().toUpperCase();
    
    // Can't use own code
    if (code === referralCode) {
      toast.error('अपना खुद का code use नहीं कर सकते!');
      return;
    }
    
    setLoading(true);
    
    try {
      // Call the database function to process referral
      const { data, error } = await supabase.rpc('process_referral', {
        referrer_code: code,
        new_user_id: user.id
      });
      
      if (error) throw error;
      
      if (data) {
        // Get current coins and update
        const { data: profile } = await supabase
          .from('profiles')
          .select('coins')
          .eq('id', user.id)
          .maybeSingle();
        
        const newCoins = (profile?.coins || 0) + 200;
        
        // Update user's coins
        await supabase
          .from('profiles')
          .update({ coins: newCoins })
          .eq('id', user.id);
        
        // Record transaction for the user who applied the code
        await supabase
          .from('transactions')
          .insert({
            user_id: user.id,
            type: 'referral_applied',
            coins: 200,
            description: 'Applied referral code'
          });
        
        toast.success('200 coins मिले referral से!');
        setHasUsedReferral(true);
        setInputCode('');
      } else {
        toast.error('Invalid referral code!');
      }
    } catch (error: any) {
      toast.error(error.message || 'कुछ गलत हो गया!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="container max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Referral</h1>
        </div>

        {/* Your Referral Code */}
        <Card className="glass-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-accent" />
              Your Referral Code
            </CardTitle>
            <p className="text-sm text-muted-foreground">Share & earn 200 coins per referral!</p>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="flex-1 bg-background/50 rounded-lg px-4 py-3 font-mono font-bold text-xl text-accent text-center">
                {referralCode || '...'}
              </div>
              <Button onClick={handleCopyCode} variant="outline" size="lg" className="px-4" disabled={!referralCode}>
                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Referral Stats */}
        <Card className="glass-card mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Referral Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background/50 rounded-lg p-4 text-center">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{stats.totalReferrals}</p>
                <p className="text-sm text-muted-foreground">People Referred</p>
              </div>
              <div className="bg-background/50 rounded-lg p-4 text-center">
                <Coins className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="text-2xl font-bold text-accent">{stats.totalCoinsEarned}</p>
                <p className="text-sm text-muted-foreground">Coins Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Apply Referral Code */}
        {!hasUsedReferral && (
          <Card className="glass-card mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Enter Referral Code
              </CardTitle>
              <p className="text-sm text-muted-foreground">One time use - Get 200 coins!</p>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input 
                  value={inputCode} 
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())} 
                  placeholder="Enter code" 
                  className="font-mono text-lg bg-background/50" 
                  maxLength={10} 
                />
                <Button onClick={handleApplyReferral} className="btn-primary px-6" disabled={loading}>
                  {loading ? '...' : 'Apply'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Used Referral Status */}
        {hasUsedReferral && (
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="text-center py-4">
                <Check className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <p className="text-lg font-semibold text-foreground">Referral Applied!</p>
                <p className="text-sm text-muted-foreground">You've already used a referral code</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Referral;