-- Create notifications table for referral bonuses
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- System can insert notifications (via service role or trigger)
CREATE POLICY "System can insert notifications"
ON public.notifications
FOR INSERT
WITH CHECK (true);

-- Create function to handle referral bonus when someone applies a code
CREATE OR REPLACE FUNCTION public.process_referral(
  referrer_code TEXT,
  new_user_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  referrer_id UUID;
  referrer_coins INTEGER;
  bonus_amount INTEGER := 200;
BEGIN
  -- Find the referrer by their code
  SELECT id, coins INTO referrer_id, referrer_coins
  FROM public.profiles
  WHERE referral_code = referrer_code;
  
  -- If referrer not found, return false
  IF referrer_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Can't refer yourself
  IF referrer_id = new_user_id THEN
    RETURN FALSE;
  END IF;
  
  -- Give bonus to referrer
  UPDATE public.profiles
  SET coins = COALESCE(coins, 0) + bonus_amount
  WHERE id = referrer_id;
  
  -- Record transaction for referrer
  INSERT INTO public.transactions (user_id, type, coins, description)
  VALUES (referrer_id, 'referral_bonus', bonus_amount, 'Referral bonus - someone used your code');
  
  -- Create notification for referrer
  INSERT INTO public.notifications (user_id, type, title, message)
  VALUES (referrer_id, 'referral_bonus', '🎉 Referral Bonus!', 'Someone used your referral code! You earned ' || bonus_amount || ' coins!');
  
  -- Update referred_by for new user
  UPDATE public.profiles
  SET referred_by = referrer_code
  WHERE id = new_user_id;
  
  RETURN TRUE;
END;
$$;