import { Users, Coins, Wallet, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  amount: number;
  status: string;
}

interface AdminDashboardProps {
  users: Profile[];
  withdrawals: Withdrawal[];
}

const AdminDashboard = ({ users, withdrawals }: AdminDashboardProps) => {
  const totalUsers = users.length;
  const totalCoins = users.reduce((sum, u) => sum + (u.coins || 0), 0);
  const totalCash = users.reduce((sum, u) => sum + Number(u.cash || 0), 0);
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending').length;
  const pendingAmount = withdrawals
    .filter(w => w.status === 'pending')
    .reduce((sum, w) => sum + Number(w.amount), 0);

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Total Coins',
      value: totalCoins.toLocaleString(),
      icon: Coins,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'Total Cash',
      value: `₹${totalCash.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Pending Withdrawals',
      value: `${pendingWithdrawals} (₹${pendingAmount.toFixed(2)})`,
      icon: Wallet,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Quick Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground">New users today</span>
              <span className="font-semibold">
                {users.filter(u => 
                  new Date(u.created_at).toDateString() === new Date().toDateString()
                ).length}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground">Approved withdrawals</span>
              <span className="font-semibold text-green-500">
                {withdrawals.filter(w => w.status === 'approved').length}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground">Rejected withdrawals</span>
              <span className="font-semibold text-red-500">
                {withdrawals.filter(w => w.status === 'rejected').length}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
