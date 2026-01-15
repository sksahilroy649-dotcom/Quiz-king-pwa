-- Add social_followed column to profiles table to track one-time social rewards
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS social_followed text[] DEFAULT '{}';

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON public.profiles(referral_code);