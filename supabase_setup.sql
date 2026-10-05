-- =======================================================
-- TWIZIE | ROSETTE CROCHET — SUPABASE INITIAL SETUP
-- Run this in the Supabase SQL Editor (SQL icon on left menu)
-- =======================================================

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'ready-made',
  price NUMERIC NOT NULL DEFAULT 0,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'available',
  stock INTEGER NOT NULL DEFAULT 1,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Allow anyone to view products (Storefront)
CREATE POLICY "Allow public read on products" 
  ON public.products FOR SELECT 
  USING (true);

-- Allow insert, update, delete for products
CREATE POLICY "Allow write on products" 
  ON public.products FOR ALL 
  USING (true)
  WITH CHECK (true);

-- 4. Create Public Storage Bucket for Product Photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read of images
CREATE POLICY "Allow public read on product images" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'product-images');

-- Allow image uploads
CREATE POLICY "Allow public uploads on product images" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Allow update and delete on product images" 
  ON storage.objects FOR ALL 
  USING (bucket_id = 'product-images');

-- 5. Insert All 19 Current Default Products
INSERT INTO public.products (id, name, category, type, price, description, status, stock, image)
VALUES
  -- Ready-made Bags
  ('ready_001', 'Rosette Pink Blossom Bag', 'bags', 'ready-made', 1600, 'Charming cream crochet shoulder bag adorned with vibrant pink granny squares and a matching pink zip closure.', 'available', 2, 'images/BAG 2.jpg'),
  ('ready_002', 'Pink Blossom Mocha Bag', 'bags', 'ready-made', 1600, 'Delightful blend of soft pink, mocha brown, and cream crochet squares, styled with a cute flower clip.', 'available', 1, 'images/BAG 4.jpg'),
  ('ready_003', 'Black Cherry Chevron Bag', 'bags', 'ready-made', 1600, 'Striking black and white zigzag crochet bag accented with a cute handmade cherry charm.', 'available', 2, 'images/BAG 5.jpg'),
  ('ready_004', 'Sunset Blossom Tote', 'bags', 'ready-made', 2000, 'Warm and cozy cream shoulder bag featuring vibrant floral granny squares in sunset orange and red tones.', 'available', 1, 'images/BAG 1.jpg'),
  ('ready_005', 'Mocha Checkered Tote', 'bags', 'ready-made', 2000, 'Trendy checkerboard pattern in rich mocha brown and cream, sturdy and spacious for everyday outings.', 'available', 2, 'images/BAG 3.jpg'),
  ('ready_006', 'Striped Black Tote', 'bags', 'ready-made', 2000, 'Bold black-and-white striped crochet tote with elegant contrast lines and comfortable handles.', 'available', 1, 'images/strip black.jpg'),

  -- Ready-made Tops
  ('ready_007', 'Magenta Striped Crop Top', 'tops', 'ready-made', 2500, 'Stunning magenta pink and black striped crochet top with flattering V-neck cut.', 'available', 1, 'images/TOP 2.jpg'),

  -- Ready-made Accessories
  ('ready_011', 'Cream Ribbon Bow Keychain', 'accessories', 'ready-made', 150, 'Minimalist cream crochet bow charm with silver keychain ring. Adds a sweet aesthetic touch to any bag or backpack.', 'available', 5, 'images/cream bow keychain.jpg'),
  ('ready_008', 'Jellyfish Charm Keychain', 'accessories', 'ready-made', 150, 'Super cute pink and white crochet jellyfish keychain with ruffled tentacles and pearl accents. Perfect for bags or keys.', 'available', 4, 'images/jellyfish keychain.jpg'),
  ('ready_019', 'Pastel Tie-Back Headbands', 'accessories', 'ready-made', 150, 'Handmade ribbed crochet tie-back headbands available in vibrant shades including magenta, royal blue, lavender, pastel yellow, orange, and sky blue.', 'available', 6, 'images/pastel tie headbands.jpg'),
  ('ready_013', 'Ruffle Blossom Scrunchies', 'accessories', 'ready-made', 250, 'Fluffy ruffled crochet hair scrunchies handmade with soft yarn that protects your hair. Available in dual-tone and pastel colors.', 'available', 6, 'images/crochet scrunchies.jpg'),
  ('ready_010', 'Cozy Ribbed Twist Headbands', 'accessories', 'ready-made', 400, 'Handmade ribbed twist-knot crochet ear warmer headbands, cozy and stylish in warm autumn tones.', 'available', 6, 'images/crochet headbands.jpg'),
  ('ready_012', 'Crimson Spiderweb Waist Drape', 'accessories', 'ready-made', 600, 'Edgy crimson-red crochet spiderweb waist scarf/drape with adjustable tie cords. Style it over jeans, skirts, or dresses.', 'available', 2, 'images/spiderweb hip drape.jpg'),
  ('ready_009', 'Coquette Ruffle Hair Bow', 'accessories', 'ready-made', 800, 'Delicate baby pink crochet hair bow with ruffled white lace edging. Perfect styling piece for braids, ponytails, or half-up hair.', 'available', 3, 'images/pink ruffle hair bow.jpg'),

  -- Ready-made Hats & Beanies
  ('ready_015', 'Spider-Man Ribbed Beanie', 'hats', 'ready-made', 1000, 'Handcrafted crimson-red ribbed beanie featuring bold Spider-Man eye masks in black and white.', 'available', 4, 'images/spiderman beanie.jpg'),
  ('ready_014', 'Sky Blue Cat-Ear Beanie', 'hats', 'ready-made', 1500, 'Super cute pastel sky blue and white granny square cat-ear beanie with a cozy fold-over brim.', 'available', 3, 'images/cat ear beanie blue.jpg'),
  ('ready_018', 'Slouchy Grey Striped Beanie', 'hats', 'ready-made', 1500, 'Cozy relaxed-fit slouchy beanie in clean grey and white stripes, perfect for cool days and effortless style.', 'available', 3, 'images/striped slouchy beanie.jpg'),
  ('ready_017', 'Coquette Ruffle Bonnet Bucket Hat', 'hats', 'ready-made', 1800, 'Romantic flared ruffle brim crochet bonnet hat, available in baby pink and chocolate brown.', 'available', 3, 'images/ruffle bonnet bucket hats.jpg'),
  ('ready_016', 'Sunburst Floral Ruffle Bucket Hat', 'hats', 'ready-made', 2000, 'Chic cream and sunburst-yellow floral granny square bucket hat with a dramatic wavy ruffle brim.', 'available', 2, 'images/yellow blossom ruffle bucket hat.jpg'),

  -- Reference / Custom Designs
  ('ref_001', 'Black & White Shrug Sleeves', 'tops', 'reference', 2000, 'Statement black and white granny square shrug with flared sleeves. Made to your exact measurements.', 'custom', 1, 'images/TOP.jpg'),
  ('ref_002', 'Spider-Man Wall Tapestry', 'accessories', 'reference', 2500, 'Decorative handmade Spider-Man wall hanging tapestry with web patterns and detailed face mask.', 'custom', 1, 'images/SPIDER.jpg'),
  ('ref_003', 'Sunset Orange & Black Tote', 'bags', 'reference', 2000, 'Spacious shoulder tote blending vibrant burnt orange squares with bold black granny patterns and sturdy straps.', 'custom', 1, 'images/orange black 1.jpg')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  type = EXCLUDED.type,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  status = EXCLUDED.status,
  stock = EXCLUDED.stock,
  image = EXCLUDED.image;
