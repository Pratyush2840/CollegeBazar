import bcrypt from 'bcrypt';
import db from '../config/db.js';
import jwt from 'jsonwebtoken';
import sendMail from '../config/mailer.js';
import { otpEmail, signupSuccess, loginNotification } from '../utils/emailTemplates.js';

export const requestOtp = async (req, res) => {

  const { email } = req.body;

  if (!email)
    return res.status(400).json({ error: 'Email is required' });

  try {

    const existingUser = await db.query(
      `SELECT 1 FROM users WHERE email = $1`,
      [email]
    );

    if (existingUser.rows.length > 0)
      return res.status(400).json({ error: 'Email already registered' });

    const recentAttempts = await db.query(
      `SELECT COUNT(*) FROM signup_otps
       WHERE email = $1 AND created_at > NOW() - INTERVAL '30 minutes'`,
      [email]
    );

    if (parseInt(recentAttempts.rows[0].count) >= 5)
      return res.status(429).json({ error: 'Too many OTP requests. Try later.' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await db.query(
      `INSERT INTO signup_otps (email, otp, expires_at, created_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (email) DO UPDATE SET otp = EXCLUDED.otp, expires_at = EXCLUDED.expires_at, created_at = NOW()`,
      [email, otp, expiresAt]
    );

    const { subject, html } = otpEmail(otp);
    await sendMail(email, subject, html);

    res.status(200).json({ message: 'OTP sent to email' });

  } 
  catch (err) {
    console.error('Error requesting OTP:', err);
    res.status(500).json({ error: 'Server error while sending OTP' });
  }

};

export const verifyOtpAndSignup = async (req, res) => {

  const { name, roll_no, phone_no, email, password, hostel, otp } = req.body;

  if (!name || !roll_no || !phone_no || !email || !password || !hostel || !otp) {
    return res.status(400).json({ error: 'All fields including OTP are required' });
  }

  try {

    const otpRecord = await db.query(
      `SELECT * FROM signup_otps WHERE email = $1`,
      [email]
    );

    if (otpRecord.rows.length === 0 || otpRecord.rows[0].otp !== otp) {
      return res.status(401).json({ error: 'Invalid OTP' });
    }

    if (new Date() > new Date(otpRecord.rows[0].expires_at)) {
      return res.status(401).json({ error: 'OTP expired' });
    }

    const existing = await db.query(
      `SELECT * FROM users WHERE roll_no = $1 OR email = $2 OR phone_no = $3`,
      [roll_no, email, phone_no]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists with same roll_no, email or phone number' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users (name, roll_no, phone_no, email, password, hostel)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [name, roll_no, phone_no, email, hashedPassword, hostel]
    );

    await db.query(`DELETE FROM signup_otps WHERE email = $1`, [email]);

    const {subject, html} = signupSuccess(name);
    sendMail(email, subject, html);

    res.status(201).json({ message: 'User signed up successfully' });

  } 
  catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error during signup' });
  }

};

export const login = async (req, res) => {

  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });

  try {

    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0)
      return res.status(401).json({ error: 'Invalid credentials' });

    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ 
      user_id: user.user_id,
      username: user.name
    }, process.env.JWT_SECRET, { expiresIn: '7d' });

    const loginTime = new Date().toLocaleString('en-US', {
      dateStyle: 'long',
      timeStyle: 'short',
      hour12: true,
    });
    const ipAddress = req.ip || 'Unknown IP';
    const {subject, html} = loginNotification(email, loginTime, ipAddress);
    sendMail(email, subject, html);

    res.status(200).json({ token });

  } 
  catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
  
};

export const editProfile = async (req, res) => {
 
  const { name, phone_no, hostel } = req.body;
  const userId = req.user.user_id; 

  if (!name && !phone_no && !hostel) {
    return res.status(400).json({ error: 'At least one field is required to update' });
  }

  try {

    const fields = [];
    const values = [];

    if (name) {
      fields.push('name');
      values.push(name);
    }
    if (phone_no) {
      fields.push('phone_no');
      values.push(phone_no);
    }
    if (hostel) {
      fields.push('hostel');
      values.push(hostel);
    }

    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const query = `
      UPDATE users
      SET ${setClause}
      WHERE user_id = $${fields.length + 1}
      RETURNING user_id, roll_no, name, email, phone_no, hostel
    `;

    values.push(userId);

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = result.rows[0];
    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });

  } 
  catch (err) {

    console.error('Error updating profile:', err);

    if (err.code === '23505') {
      return res.status(400).json({ error: 'Phone number already exists' });
    }

    if (err.code === '23514') {
      return res.status(400).json({ error: 'Invalid hostel value' });
    }

    res.status(500).json({ error: 'Server error during profile update' });

  }
  
};

export const getProfile = async (req, res) => {

  const userId = req.user.user_id;

  try {

    const query = `
      SELECT user_id, roll_no, name, email, phone_no, hostel
      FROM users
      WHERE user_id = $1
    `;

    const result = await db.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    res.status(200).json({
      message: 'Profile fetched successfully',
      user: user,
    });

  } 
  catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Server error during profile fetch' });
  }
  
};


