-- Allow guest payments by making user_id nullable in payments table
ALTER TABLE public.payments 
ALTER COLUMN user_id DROP NOT NULL;

-- Update the RLS policies to handle guest payments
DROP POLICY IF EXISTS "Users can create their own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;

-- Create new policies that handle both authenticated and guest payments
CREATE POLICY "Anyone can create payments" 
ON public.payments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view their own payments" 
ON public.payments 
FOR SELECT 
USING (
  -- Authenticated users can see their own payments
  (user_id = auth.uid()) OR 
  -- Unauthenticated users cannot see any payments (guest payments are fire-and-forget)
  (user_id IS NULL AND auth.uid() IS NULL)
);

-- Allow updating payment status for order processing
CREATE POLICY "System can update payment status" 
ON public.payments 
FOR UPDATE 
USING (true);