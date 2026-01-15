import { useState } from 'react';
import { Coins, DollarSign, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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

interface UserManagementProps {
  users: Profile[];
  onUpdateCoins: (userId: string, coins: number, description: string) => Promise<void>;
  onUpdateCash: (userId: string, cash: number, description: string) => Promise<void>;
}

const UserManagement = ({ users, onUpdateCoins, onUpdateCash }: UserManagementProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [coinAmount, setCoinAmount] = useState('');
  const [cashAmount, setCashAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.referral_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCoins = async () => {
    if (!selectedUser || !coinAmount) return;
    
    try {
      const newCoins = selectedUser.coins + parseInt(coinAmount);
      await onUpdateCoins(selectedUser.id, newCoins, description || 'Admin credit');
      toast.success(`Added ${coinAmount} coins to user`);
      setCoinAmount('');
      setDescription('');
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Failed to update coins');
    }
  };

  const handleAddCash = async () => {
    if (!selectedUser || !cashAmount) return;
    
    try {
      const newCash = Number(selectedUser.cash) + parseFloat(cashAmount);
      await onUpdateCash(selectedUser.id, newCash, description || 'Admin credit');
      toast.success(`Added ₹${cashAmount} to user`);
      setCashAmount('');
      setDescription('');
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Failed to update cash');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by email, name, or referral code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Coins</TableHead>
              <TableHead>Cash</TableHead>
              <TableHead>Referral Code</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.email || '-'}</TableCell>
                <TableCell>{user.display_name || '-'}</TableCell>
                <TableCell>
                  <span className="flex items-center gap-1">
                    <Coins className="w-4 h-4 text-yellow-500" />
                    {user.coins}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-1 text-green-500">
                    ₹{Number(user.cash).toFixed(2)}
                  </span>
                </TableCell>
                <TableCell className="font-mono text-sm">{user.referral_code || '-'}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Dialog open={isDialogOpen && selectedUser?.id === user.id} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (open) setSelectedUser(user);
                  }}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Manage User: {user.email}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground mb-2">Current Balance</p>
                          <div className="flex gap-4">
                            <span className="flex items-center gap-1">
                              <Coins className="w-4 h-4 text-yellow-500" />
                              {user.coins} coins
                            </span>
                            <span className="text-green-500">₹{Number(user.cash).toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Add Coins</label>
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              placeholder="Amount"
                              value={coinAmount}
                              onChange={(e) => setCoinAmount(e.target.value)}
                            />
                            <Button onClick={handleAddCoins} className="shrink-0">
                              <Coins className="w-4 h-4 mr-2" />
                              Add
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Add Cash (₹)</label>
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Amount"
                              value={cashAmount}
                              onChange={(e) => setCashAmount(e.target.value)}
                            />
                            <Button onClick={handleAddCash} className="shrink-0">
                              <DollarSign className="w-4 h-4 mr-2" />
                              Add
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Description (optional)</label>
                          <Input
                            placeholder="Reason for credit..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                          />
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No users found
        </div>
      )}
    </div>
  );
};

export default UserManagement;
