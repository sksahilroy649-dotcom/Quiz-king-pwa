import { Check, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';

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

interface WithdrawalManagementProps {
  withdrawals: Withdrawal[];
  users: Profile[];
  onProcess: (id: string, status: 'approved' | 'rejected') => Promise<void>;
}

const WithdrawalManagement = ({ withdrawals, users, onProcess }: WithdrawalManagementProps) => {
  const getUserEmail = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.email || userId.slice(0, 8);
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-500/20 text-green-500"><Check className="w-3 h-3 mr-1" /> Approved</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-500/20 text-red-500"><X className="w-3 h-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await onProcess(id, 'approved');
      toast.success('Withdrawal approved');
    } catch (error) {
      toast.error('Failed to approve withdrawal');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await onProcess(id, 'rejected');
      toast.success('Withdrawal rejected');
    } catch (error) {
      toast.error('Failed to reject withdrawal');
    }
  };

  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');
  const processedWithdrawals = withdrawals.filter(w => w.status !== 'pending');

  return (
    <div className="space-y-6">
      {/* Pending Withdrawals */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Pending Withdrawals ({pendingWithdrawals.length})</h3>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>UPI ID</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingWithdrawals.map((withdrawal) => (
                <TableRow key={withdrawal.id}>
                  <TableCell className="font-medium">
                    {getUserEmail(withdrawal.user_id)}
                  </TableCell>
                  <TableCell className="text-green-500 font-semibold">
                    ₹{Number(withdrawal.amount).toFixed(2)}
                  </TableCell>
                  <TableCell className="font-mono">{withdrawal.upi_id || '-'}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {withdrawal.created_at 
                      ? new Date(withdrawal.created_at).toLocaleString() 
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-green-500/10 hover:bg-green-500/20 text-green-500 border-green-500/30"
                        onClick={() => handleApprove(withdrawal.id)}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/30"
                        onClick={() => handleReject(withdrawal.id)}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {pendingWithdrawals.length === 0 && (
          <div className="text-center py-8 text-muted-foreground border border-border rounded-lg">
            No pending withdrawals
          </div>
        )}
      </div>

      {/* Processed Withdrawals */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Processed Withdrawals</h3>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>UPI ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Processed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedWithdrawals.map((withdrawal) => (
                <TableRow key={withdrawal.id}>
                  <TableCell className="font-medium">
                    {getUserEmail(withdrawal.user_id)}
                  </TableCell>
                  <TableCell className="font-semibold">
                    ₹{Number(withdrawal.amount).toFixed(2)}
                  </TableCell>
                  <TableCell className="font-mono">{withdrawal.upi_id || '-'}</TableCell>
                  <TableCell>{getStatusBadge(withdrawal.status || 'pending')}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {withdrawal.processed_at 
                      ? new Date(withdrawal.processed_at).toLocaleString() 
                      : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {processedWithdrawals.length === 0 && (
          <div className="text-center py-8 text-muted-foreground border border-border rounded-lg">
            No processed withdrawals
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawalManagement;
