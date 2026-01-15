import { Coins, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Transaction {
  id: string;
  user_id: string;
  type: string;
  coins: number;
  cash: number;
  description: string | null;
  created_at: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory = ({ transactions }: TransactionHistoryProps) => {
  const getTypeBadge = (type: string) => {
    const typeMap: Record<string, { label: string; className: string }> = {
      quiz_reward: { label: 'Quiz', className: 'bg-blue-500/20 text-blue-500' },
      spin_reward: { label: 'Spin', className: 'bg-purple-500/20 text-purple-500' },
      referral_bonus: { label: 'Referral', className: 'bg-green-500/20 text-green-500' },
      admin_credit: { label: 'Admin', className: 'bg-yellow-500/20 text-yellow-500' },
      withdrawal: { label: 'Withdrawal', className: 'bg-red-500/20 text-red-500' },
    };

    const config = typeMap[type] || { label: type, className: 'bg-muted text-muted-foreground' };
    return <Badge variant="secondary" className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Type</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Coins</TableHead>
              <TableHead>Cash</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>{getTypeBadge(tx.type)}</TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {tx.user_id.slice(0, 8)}...
                </TableCell>
                <TableCell>
                  {tx.coins !== 0 && (
                    <span className={`flex items-center gap-1 ${tx.coins > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {tx.coins > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      <Coins className="w-4 h-4 text-yellow-500" />
                      {Math.abs(tx.coins)}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {tx.cash !== 0 && (
                    <span className={`flex items-center gap-1 ${Number(tx.cash) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {Number(tx.cash) > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      ₹{Math.abs(Number(tx.cash)).toFixed(2)}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {tx.description || '-'}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(tx.created_at).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {transactions.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No transactions found
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
