import { useState } from 'react';
import { Mail, Lock, Sparkles, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
interface LoginModalProps {
  onLogin: () => void;
}

const LoginModal = ({ onLogin }: LoginModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAuth = async () => {
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });

        if (error) {
          if (error.message.includes('already registered')) {
            setError('This email is already registered. Please login instead.');
          } else {
            setError(error.message);
          }
          toast.error('Sign up failed');
        } else if (data.session) {
          toast.success('Account created! Welcome!');
          onLogin();
        } else {
          toast.success('Account created! You can now login.');
          setIsSignUp(false);
          setPassword('');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setError('Wrong email or password. Try again or Sign Up.');
          } else {
            setError(error.message);
          }
          toast.error('Login failed');
        } else if (data.session) {
          toast.success('Login successful!');
          onLogin();
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-background/80 backdrop-blur-sm p-4">
      <div className="glass-card rounded-2xl p-8 w-full max-w-sm animate-scale-in shadow-card">
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-primary">
            <Sparkles className="w-10 h-10 text-foreground" />
          </div>
          <h2 className="text-2xl font-extrabold text-foreground mb-2">Welcome to Quiz King!</h2>
          <p className="text-muted-foreground text-sm">
            {isSignUp ? 'Create your account' : 'Login to start earning rewards'}
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              className="pl-11 h-12 bg-muted border-border text-foreground placeholder:text-muted-foreground rounded-xl"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="pl-11 pr-11 h-12 bg-muted border-border text-foreground placeholder:text-muted-foreground rounded-xl"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {error && (
            <p className="text-destructive text-sm text-center">{error}</p>
          )}

          <Button
            onClick={handleAuth}
            disabled={loading}
            className="w-full h-12 btn-primary rounded-xl text-lg"
          >
            {loading ? (isSignUp ? 'Creating...' : 'Logging in...') : (isSignUp ? 'Sign Up' : 'Login')}
          </Button>

          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setPassword('');
            }}
            className="w-full text-sm text-primary hover:underline"
          >
            {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
