import { Routes, Route, Navigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useAdmin } from '@/hooks/useAdmin';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminDashboard from '@/components/admin/AdminDashboard';
import UserManagement from '@/components/admin/UserManagement';
import WithdrawalManagement from '@/components/admin/WithdrawalManagement';
import TransactionHistory from '@/components/admin/TransactionHistory';
import { Loader2, ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();
  const {
    isAdmin,
    loading,
    users,
    withdrawals,
    transactions,
    updateUserCoins,
    updateUserCash,
    processWithdrawal,
  } = useAdmin();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <ShieldX className="w-16 h-16 mx-auto text-destructive" />
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">You don't have admin privileges.</p>
          <Button onClick={() => navigate('/')}>Go Back Home</Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <Routes>
            <Route
              index
              element={<AdminDashboard users={users} withdrawals={withdrawals} />}
            />
            <Route
              path="users"
              element={
                <UserManagement
                  users={users}
                  onUpdateCoins={updateUserCoins}
                  onUpdateCash={updateUserCash}
                />
              }
            />
            <Route
              path="withdrawals"
              element={
                <WithdrawalManagement
                  withdrawals={withdrawals}
                  users={users}
                  onProcess={processWithdrawal}
                />
              }
            />
            <Route
              path="transactions"
              element={<TransactionHistory transactions={transactions} />}
            />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
