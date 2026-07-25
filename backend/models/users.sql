CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  roll_no VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  phone_no VARCHAR(15) UNIQUE,
  password TEXT NOT NULL,
  hostel VARCHAR(10) CHECK (hostel IN ('BH1', 'BH2', 'BH3', 'BH4', 'BH5', 'GH1', 'GH2', 'GH3'))
);
