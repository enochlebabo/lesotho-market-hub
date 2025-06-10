
-- Create seller verification table
CREATE TABLE public.seller_verification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  verification_status TEXT CHECK (verification_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  verification_documents JSONB,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Create business accounts table
CREATE TABLE public.business_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  plan_type TEXT CHECK (plan_type IN ('basic', 'premium', 'enterprise')) DEFAULT 'basic',
  monthly_fee DECIMAL(10,2),
  plan_start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  plan_end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Create premium listings table
CREATE TABLE public.premium_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID NOT NULL, -- Reference to actual product listing
  premium_type TEXT CHECK (premium_type IN ('featured', 'top_search', 'category_highlight')) NOT NULL,
  fee_amount DECIMAL(10,2) NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create advertisements table
CREATE TABLE public.advertisements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ad_title TEXT NOT NULL,
  ad_description TEXT,
  ad_image_url TEXT,
  ad_type TEXT CHECK (ad_type IN ('home_screen', 'category', 'banner')) NOT NULL,
  target_category TEXT,
  monthly_fee DECIMAL(10,2) NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  click_count INTEGER DEFAULT 0,
  impression_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create categories table for better filtering
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_name TEXT,
  parent_category_id UUID REFERENCES public.categories(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default categories
INSERT INTO public.categories (name, description, icon_name) VALUES
('Vehicles', 'Cars, trucks, motorcycles', 'car'),
('Electronics', 'Laptops, phones, gadgets', 'laptop'),
('Furniture', 'Home & office furniture', 'building'),
('Fashion', 'Clothing & accessories', 'star'),
('Services', 'Professional services', 'users'),
('Business', 'Equipment & supplies', 'briefcase');

-- Enable RLS on all tables
ALTER TABLE public.seller_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premium_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- RLS policies for seller_verification
CREATE POLICY "Users can view their own verification" ON public.seller_verification
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own verification" ON public.seller_verification
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own verification" ON public.seller_verification
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for business_accounts
CREATE POLICY "Users can view their own business account" ON public.business_accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own business account" ON public.business_accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own business account" ON public.business_accounts
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for premium_listings
CREATE POLICY "Users can view their own premium listings" ON public.premium_listings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own premium listings" ON public.premium_listings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for advertisements
CREATE POLICY "Users can view their own advertisements" ON public.advertisements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own advertisements" ON public.advertisements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own advertisements" ON public.advertisements
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for categories (public read access)
CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (true);

-- Admin function to check if user is admin (you'll need to manually set admin users)
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id 
    AND (first_name = 'admin' OR last_name = 'admin')
  );
$$;

-- Admin policies for viewing all data
CREATE POLICY "Admins can view all verification requests" ON public.seller_verification
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update verification status" ON public.seller_verification
  FOR UPDATE USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can view all business accounts" ON public.business_accounts
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can view all premium listings" ON public.premium_listings
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can view all advertisements" ON public.advertisements
  FOR SELECT USING (public.is_admin(auth.uid()));
