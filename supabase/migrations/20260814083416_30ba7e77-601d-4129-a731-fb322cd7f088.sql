
CREATE TABLE public.scans (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  crop_type text NOT NULL,
  disease_name text NOT NULL,
  confidence numeric NOT NULL DEFAULT 90,
  severity text NOT NULL DEFAULT 'Medium',
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  village_name text NOT NULL,
  farmer_name text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.scans TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.scans TO authenticated;
GRANT ALL ON public.scans TO service_role;

ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view scans" ON public.scans FOR SELECT USING (true);
CREATE POLICY "Anyone can add a scan" ON public.scans FOR INSERT WITH CHECK (true);

CREATE INDEX scans_created_at_idx ON public.scans (created_at DESC);

INSERT INTO public.scans (crop_type, disease_name, confidence, severity, latitude, longitude, village_name, farmer_name, status, created_at)
SELECT
  d.crop,
  d.disease,
  round((82 + random() * 16)::numeric, 1),
  (ARRAY['Low','Medium','High','Critical'])[1 + floor(random() * 4)::int],
  v.lat + (random() - 0.5) * 0.045,
  v.lng + (random() - 0.5) * 0.045,
  v.village,
  f.name,
  CASE WHEN random() < 0.28 THEN 'treated' ELSE 'active' END,
  now() - (random() * interval '6 days')
FROM generate_series(1, 56) AS g(i)
CROSS JOIN LATERAL (
  SELECT * FROM (VALUES
    ('Srirangapatna', 12.4181, 76.6947),
    ('Pandavapura', 12.5010, 76.6650),
    ('Mandya Town', 12.5242, 76.8958),
    ('Maddur', 12.5847, 77.0433),
    ('Malavalli', 12.3847, 77.0611),
    ('Nagamangala', 12.8180, 76.7550)
  ) AS t(village, lat, lng)
  ORDER BY random() LIMIT 1
) v
CROSS JOIN LATERAL (
  SELECT * FROM (VALUES
    ('Rice','Rice Blast'),
    ('Rice','Bacterial Leaf Blight'),
    ('Rice','Brown Spot'),
    ('Sugarcane','Red Rot'),
    ('Sugarcane','Sugarcane Smut'),
    ('Tomato','Late Blight'),
    ('Tomato','Early Blight'),
    ('Tomato','Leaf Curl Virus'),
    ('Cotton','Bacterial Blight'),
    ('Wheat','Yellow Rust'),
    ('Maize','Fall Armyworm Damage')
  ) AS t(crop, disease)
  ORDER BY random() LIMIT 1
) d
CROSS JOIN LATERAL (
  SELECT * FROM (VALUES
    ('Ramesh Gowda'),('Lakshmamma B'),('Suresh Kumar'),('Manjunath H R'),
    ('Shivanna M'),('Devaraju N'),('Kavitha S'),('Prakash Gowda'),
    ('Nagaraj K'),('Basavaraju T'),('Yashoda Bai'),('Chandrashekar P')
  ) AS t(name)
  ORDER BY random() LIMIT 1
) f;
