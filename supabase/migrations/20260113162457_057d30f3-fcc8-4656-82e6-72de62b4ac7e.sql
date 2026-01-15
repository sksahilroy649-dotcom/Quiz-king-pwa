-- Drop the existing status check constraint
ALTER TABLE public.withdrawals DROP CONSTRAINT IF EXISTS withdrawals_status_check;

-- Add new check constraint that includes 'cancelled' status
ALTER TABLE public.withdrawals ADD CONSTRAINT withdrawals_status_check 
CHECK (status IN ('pending', 'approved', 'rejected', 'successful', 'cancelled'));