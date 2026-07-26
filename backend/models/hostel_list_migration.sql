-- Updates the valid hostel list to match this college's actual hostels.
-- Widens the column since some hostel names are longer than the old VARCHAR(10).

ALTER TABLE users ALTER COLUMN hostel TYPE VARCHAR(30);
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_hostel_check;
ALTER TABLE users ADD CONSTRAINT users_hostel_check
  CHECK (hostel IN ('TH1', 'TH2', 'TH3', 'TH4', 'MA Saraswati', 'Panini', 'Nagarjuna Hostel'));
