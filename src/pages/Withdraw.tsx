import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, IndianRupee, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Withdrawal {
  id: string;
  amount: number;
  status: string | null;
  upi_id: string | null;
  created_at: string | null;
  processed_at: string | null;
}

const Withdraw = () => {
  const navigate = useNavigate();
  const [cash, setCash] = useState(0);
  const [dbCash, setDbCash] = useState(0);
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [user, setUser] = useState<any>(null);

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
    fetchUserData(session.user.id);
    fetchWithdrawals(session.user.id);
  };

  const fetchUserData = async (userId: string) => {
    // Get cash from database
    const { data } = await supabase
      .from('profiles')
      .select('cash')
      .eq('id', userId)
      .single();
    
    const databaseCash = Number(data?.cash) || 0;
    setDbCash(databaseCash);
    
    // Also check localStorage for local cash
    const localCash = parseInt(localStorage.getItem('quiz_cash') || '0', 10);
    
    // Use the higher value (in case there's local cash not synced to DB)
    const totalCash = Math.max(databaseCash, localCash);
    setCash(totalCash);
    
    // Sync local cash to database if it's higher
    if (localCash > databaseCash) {
      await supabase
        .from('profiles')
        .update({ cash: localCash })
        .eq('id', userId);
    }
  };

  const cancelExpiredWithdrawals = async (userId: string, pendingWithdrawals: Withdrawal[]) => {
    const now = new Date();
    let refundTotal = 0;
    const expiredIds: string[] = [];

    for (const w of pendingWithdrawals) {
      if (w.status === 'pending' && w.created_at) {
        const createdAt = new Date(w.created_at);
        const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
        
        if (hoursDiff >= 24) {
          expiredIds.push(w.id);
          refundTotal += Number(w.amount);
        }
      }
    }

    if (expiredIds.length > 0) {
      // Update expired withdrawals to cancelled
      for (const id of expiredIds) {
        await supabase
          .from('withdrawals')
          .update({ status: 'cancelled', processed_at: new Date().toISOString() })
          .eq('id', id);
      }

      // Refund the amount to user's wallet
      const { data: profile } = await supabase
        .from('profiles')
        .select('cash')
        .eq('id', userId)
        .single();

      const currentCash = Number(profile?.cash) || 0;
      const newCash = currentCash + refundTotal;

      await supabase
        .from('profiles')
        .update({ cash: newCash })
        .eq('id', userId);

      // Update localStorage
      localStorage.setItem('quiz_cash', newCash.toString());
      setCash(newCash);

      // Record refund transaction
      await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          type: 'refund',
          cash: refundTotal,
          description: `Auto-refund: ${expiredIds.length} withdrawal(s) cancelled after 24h`
        });

      toast.info(`${expiredIds.length} withdrawal(s) cancelled - ₹${refundTotal} refunded to wallet!`);
    }
  };

  const fetchWithdrawals = async (userId: string) => {
    const { data } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (data) {
      // First cancel any expired pending withdrawals and refund
      await cancelExpiredWithdrawals(userId, data);
      
      // Refetch to get updated statuses
      const { data: updatedData } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      setWithdrawals(updatedData || data);
    }
  };

  const handleWithdraw = async () => {
    if (!user) return;
    
    const withdrawAmount = parseFloat(amount);
    
    if (!upiId.trim()) {
      toast.error('UPI ID डालें!');
      return;
    }
    
    if (!withdrawAmount || withdrawAmount < 10) {
      toast.error('Minimum ₹10 withdraw करें!');
      return;
    }
    
    if (withdrawAmount > cash) {
      toast.error('आपके पास इतना cash नहीं है!');
      return;
    }

    setLoading(true);
    
    try {
      // Create withdrawal request
      const { error: withdrawError } = await supabase
        .from('withdrawals')
        .insert({
          user_id: user.id,
          amount: withdrawAmount,
          upi_id: upiId.trim(),
          status: 'pending'
        });

      if (withdrawError) throw withdrawError;

      // Update user's cash balance in database
      const newCash = cash - withdrawAmount;
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ cash: newCash })
        .eq('id', user.id);

      if (updateError) throw updateError;
      
      // Also update localStorage
      localStorage.setItem('quiz_cash', newCash.toString());

      // Record transaction
      await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'withdrawal',
          cash: -withdrawAmount,
          description: `Withdrawal to ${upiId}`
        });

      toast.success('Withdrawal request submitted!');
      setCash(prev => prev - withdrawAmount);
      setAmount('');
      setUpiId('');
      fetchWithdrawals(user.id);
    } catch (error: any) {
      toast.error(error.message || 'कुछ गलत हो गया!');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (withdrawal: Withdrawal) => {
    const status = withdrawal.status;
    const createdAt = withdrawal.created_at ? new Date(withdrawal.created_at) : null;
    const now = new Date();
    
    // Show remaining time for pending withdrawals
    if (status === 'pending' && createdAt) {
      const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
      const remainingHours = Math.max(0, Math.ceil(24 - hoursDiff));
      return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30"><Clock className="w-3 h-3 mr-1" /> Pending ({remainingHours}h left)</Badge>;
    }
    
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      case 'approved':
      case 'successful':
        return <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/30"><CheckCircle className="w-3 h-3 mr-1" /> Successful</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-500/20 text-red-500 border-red-500/30"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-orange-500/20 text-orange-500 border-orange-500/30"><XCircle className="w-3 h-3 mr-1" /> Cancelled (Refunded)</Badge>;
      default:
        return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
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
          <h1 className="text-2xl font-bold text-foreground">Withdraw</h1>
        </div>

        {/* Balance Card */}
        <Card className="glass-card mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available Balance</p>
                  <p className="text-3xl font-bold text-green-500">₹{cash.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Withdraw Form */}
        <Card className="glass-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IndianRupee className="w-5 h-5" />
              Withdraw Cash
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">UPI ID</label>
              <Input
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="example@paytm"
                className="bg-background/50"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Amount (Min ₹10)</label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="10"
                min="10"
                max={cash}
                className="bg-background/50"
              />
            </div>
            <Button 
              onClick={handleWithdraw} 
              className="w-full btn-primary h-12"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Withdraw Now'}
            </Button>
          </CardContent>
        </Card>

        {/* Withdrawal History */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Withdrawal History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {withdrawals.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No withdrawals yet</p>
            ) : (
              <div className="space-y-3">
                {withdrawals.map((w) => (
                  <div key={w.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                    <div>
                      <p className="font-semibold">₹{Number(w.amount).toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">{w.upi_id}</p>
                      <p className="text-xs text-muted-foreground">
                        {w.created_at ? new Date(w.created_at).toLocaleDateString() : '-'}
                      </p>
                    </div>
                    {getStatusBadge(w)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Withdraw;
