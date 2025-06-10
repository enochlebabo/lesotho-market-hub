
-- Enhanced seller verification with badges
ALTER TABLE public.seller_verification 
ADD COLUMN government_id_url TEXT,
ADD COLUMN mobile_verified BOOLEAN DEFAULT false,
ADD COLUMN social_media_link TEXT,
ADD COLUMN verification_badges JSONB DEFAULT '[]'::jsonb;

-- Create seller ratings and reviews table
CREATE TABLE public.seller_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  transaction_id UUID NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  review_text TEXT,
  response_time_rating INTEGER CHECK (response_time_rating >= 1 AND response_time_rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(transaction_id, buyer_id)
);

-- Create transactions table for receipts and escrow
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID NOT NULL,
  product_name TEXT NOT NULL,
  agreed_price DECIMAL(10,2) NOT NULL,
  reservation_fee DECIMAL(10,2) DEFAULT 0,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'delivered', 'completed', 'cancelled', 'disputed')) DEFAULT 'pending',
  delivery_option TEXT CHECK (delivery_option IN ('pickup', 'seller_delivery', 'app_delivery')) DEFAULT 'pickup',
  delivery_address TEXT,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  delivery_distance_km DECIMAL(5,2),
  receipt_generated BOOLEAN DEFAULT false,
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE
);

-- Create delivery options table
CREATE TABLE public.delivery_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL,
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  delivery_type TEXT CHECK (delivery_type IN ('seller_delivery', 'app_delivery', 'pickup_only')) NOT NULL,
  delivery_radius_km DECIMAL(5,2),
  base_delivery_fee DECIMAL(10,2),
  per_km_rate DECIMAL(10,2),
  estimated_delivery_time TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create escrow/reservation system table
CREATE TABLE public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES public.transactions(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reservation_amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('ecocash', 'mpesa', 'card')) NOT NULL,
  payment_reference TEXT,
  status TEXT CHECK (status IN ('pending', 'paid', 'released', 'refunded')) DEFAULT 'pending',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  released_at TIMESTAMP WITH TIME ZONE,
  refunded_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on all new tables
ALTER TABLE public.seller_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- RLS policies for seller_reviews
CREATE POLICY "Users can view reviews for sellers" ON public.seller_reviews
  FOR SELECT USING (true);

CREATE POLICY "Buyers can create reviews" ON public.seller_reviews
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Sellers can view their reviews" ON public.seller_reviews
  FOR SELECT USING (auth.uid() = seller_id);

-- RLS policies for transactions
CREATE POLICY "Users can view their own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can create transactions as buyer" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Users can update their transactions" ON public.transactions
  FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- RLS policies for delivery_options
CREATE POLICY "Anyone can view delivery options" ON public.delivery_options
  FOR SELECT USING (true);

CREATE POLICY "Sellers can manage their delivery options" ON public.delivery_options
  FOR ALL USING (auth.uid() = seller_id);

-- RLS policies for reservations
CREATE POLICY "Users can view their own reservations" ON public.reservations
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Buyers can create reservations" ON public.reservations
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Admin policies
CREATE POLICY "Admins can view all transactions" ON public.transactions
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all transactions" ON public.transactions
  FOR UPDATE USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can view all reservations" ON public.reservations
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all reservations" ON public.reservations
  FOR UPDATE USING (public.is_admin(auth.uid()));

-- Function to calculate seller rating
CREATE OR REPLACE FUNCTION public.get_seller_rating(seller_user_id UUID)
RETURNS TABLE (
  average_rating DECIMAL(3,2),
  total_reviews INTEGER,
  response_time_rating DECIMAL(3,2)
)
LANGUAGE SQL
STABLE
AS $$
  SELECT 
    COALESCE(AVG(rating), 0)::DECIMAL(3,2) as average_rating,
    COUNT(*)::INTEGER as total_reviews,
    COALESCE(AVG(response_time_rating), 0)::DECIMAL(3,2) as response_time_rating
  FROM public.seller_reviews 
  WHERE seller_id = seller_user_id;
$$;

-- Function to update seller badges based on performance
CREATE OR REPLACE FUNCTION public.update_seller_badges(seller_user_id UUID)
RETURNS JSONB
LANGUAGE PLPGSQL
AS $$
DECLARE
  badges JSONB := '[]'::JSONB;
  rating_data RECORD;
  transaction_count INTEGER;
BEGIN
  -- Get seller rating data
  SELECT * INTO rating_data FROM public.get_seller_rating(seller_user_id);
  
  -- Count completed transactions
  SELECT COUNT(*) INTO transaction_count 
  FROM public.transactions 
  WHERE seller_id = seller_user_id AND status = 'completed';
  
  -- Award badges based on criteria
  IF rating_data.average_rating >= 4.5 AND rating_data.total_reviews >= 10 THEN
    badges := badges || '["Top Seller"]'::JSONB;
  END IF;
  
  IF rating_data.response_time_rating >= 4.0 THEN
    badges := badges || '["Fast Responder"]'::JSONB;
  END IF;
  
  IF transaction_count >= 50 THEN
    badges := badges || '["Experienced Seller"]'::JSONB;
  END IF;
  
  -- Update seller verification with new badges
  UPDATE public.seller_verification 
  SET verification_badges = badges
  WHERE user_id = seller_user_id;
  
  RETURN badges;
END;
$$;
