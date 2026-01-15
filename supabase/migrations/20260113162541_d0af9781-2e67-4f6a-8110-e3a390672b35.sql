-- Allow users to update their own withdrawals (for auto-cancel feature)
CREATE POLICY "Users can update own withdrawals" 
ON public.withdrawals 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);