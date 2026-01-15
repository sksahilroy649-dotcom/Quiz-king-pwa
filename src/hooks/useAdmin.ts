import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  coins: number;
  cash: number;
  referral_code: string | null;
  created_at: string;
}

interface Withdrawal {
  id: string;
  user_id: string;
  amount: number;
  status: string | null;
  upi_id: string | null;
  created_at: string | null;
  processed_at: string | null;
}

interface Transaction {
  id: string;
  user_id: string;
  type: string;
  coins: number;
  cash: number;
  description: string | null;
  created_at: string;
}

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<Profile[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      setIsAdmin(!!roleData);
      if (roleData) {
        await fetchAllData();
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    await Promise.all([
      fetchUsers(),
      fetchWithdrawals(),
      fetchTransactions(),
    ]);
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setUsers(data);
    }
  };

  const fetchWithdrawals = async () => {
    const { data, error } = await supabase
      .from('withdrawals')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setWithdrawals(data);
    }
  };

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (!error && data) {
      setTransactions(data);
    }
  };

  const updateUserCoins = async (userId: string, coins: number, description: string) => {
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ coins })
      .eq('id', userId);

    if (updateError) {
      throw updateError;
    }

    // Log transaction
    await supabase.from('transactions').insert({
      user_id: userId,
      type: 'admin_credit',
      coins,
      description,
    });

    await fetchUsers();
  };

  const updateUserCash = async (userId: string, cash: number, description: string) => {
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ cash })
      .eq('id', userId);

    if (updateError) {
      throw updateError;
    }

    // Log transaction
    await supabase.from('transactions').insert({
      user_id: userId,
      type: 'admin_credit',
      cash,
      description,
    });

    await fetchUsers();
  };

  const processWithdrawal = async (withdrawalId: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('withdrawals')
      .update({ 
        status, 
        processed_at: new Date().toISOString() 
      })
      .eq('id', withdrawalId);

    if (error) {
      throw error;
    }

    await fetchWithdrawals();
  };

  return {
    isAdmin,
    loading,
    users,
    withdrawals,
    transactions,
    updateUserCoins,
    updateUserCash,
    processWithdrawal,
    refreshData: fetchAllData,
  };
};
