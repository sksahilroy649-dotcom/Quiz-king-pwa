import { useState, useEffect } from 'react';
import { Settings, LogOut, Bell, Moon, Sun, Palette, Shield, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SUPPORT_EMAIL = 'Quizkinghelp@gmail.com';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface SettingsMenuProps {
  userId: string | undefined;
  onLogout: () => void;
}

type ThemeMode = 'dark' | 'light' | 'gradient';

const SettingsMenu = ({ userId, onLogout }: SettingsMenuProps) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('app-theme') as ThemeMode) || 'gradient';
  });

  useEffect(() => {
    applyTheme(theme);
  }, []);

  useEffect(() => {
    if (!userId) return;
    
    fetchNotifications();
    
    const channel = supabase
      .channel('notifications-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          toast.success(newNotification.title, {
            description: newNotification.message
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const fetchNotifications = async () => {
    if (!userId) return;
    
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (data) {
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.is_read).length);
    }
  };

  const markAsRead = async (notificationId: string) => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
    
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    if (!userId) return;
    
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const applyTheme = (newTheme: ThemeMode) => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('dark', 'light');
    
    if (newTheme === 'dark') {
      root.classList.add('dark');
      document.body.style.background = 'hsl(220, 50%, 6%)';
    } else if (newTheme === 'light') {
      root.classList.add('light');
      document.body.style.background = 'hsl(0, 0%, 98%)';
    } else {
      // Gradient theme (default) - uses base :root styles
      document.body.style.background = 'linear-gradient(135deg, hsl(340, 80%, 55%) 0%, hsl(280, 70%, 50%) 50%, hsl(220, 80%, 50%) 100%)';
    }
    
    setTheme(newTheme);
    localStorage.setItem('app-theme', newTheme);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Settings className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {/* Notifications */}
        <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
          <PopoverTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-auto bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </DropdownMenuItem>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" side="left" align="start">
            <div className="flex items-center justify-between p-3 border-b border-border">
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                  Mark all read
                </Button>
              )}
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-center text-muted-foreground py-6 text-sm">
                  No notifications yet
                </p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => !notification.is_read && markAsRead(notification.id)}
                    className={`p-3 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${
                      !notification.is_read ? 'bg-accent/10' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {!notification.is_read && (
                        <div className="w-2 h-2 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      )}
                      <div className={!notification.is_read ? '' : 'ml-4'}>
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-xs text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(notification.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenuSeparator />

        {/* Theme Settings */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Palette className="w-4 h-4 mr-2" />
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => applyTheme('gradient')} className="cursor-pointer">
              <div className="w-4 h-4 mr-2 rounded-full bg-gradient-to-br from-primary to-secondary" />
              Gradient
              {theme === 'gradient' && <span className="ml-auto">✓</span>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => applyTheme('dark')} className="cursor-pointer">
              <Moon className="w-4 h-4 mr-2" />
              Dark
              {theme === 'dark' && <span className="ml-auto">✓</span>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => applyTheme('light')} className="cursor-pointer">
              <Sun className="w-4 h-4 mr-2" />
              Light
              {theme === 'light' && <span className="ml-auto">✓</span>}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Customer Help */}
        <DropdownMenuItem 
          onClick={() => {
            window.open(`mailto:${SUPPORT_EMAIL}`, '_blank');
            toast.success('Email app खुल रहा है');
          }} 
          className="cursor-pointer"
        >
          <Mail className="w-4 h-4 mr-2" />
          Help & Support
        </DropdownMenuItem>

        {/* Privacy Policy */}
        <DropdownMenuItem onClick={() => navigate('/privacy-policy')} className="cursor-pointer">
          <Shield className="w-4 h-4 mr-2" />
          Privacy Policy
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SettingsMenu;
