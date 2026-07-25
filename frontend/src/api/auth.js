import { API_URL } from '../config.js';
const BASE_URL = API_URL + "/api/auth";

export async function login(email, password) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Login failed');
  return data;
}

export async function requestOtp(email) {
  const response = await fetch(`${BASE_URL}/request-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'OTP request failed');
  return data;
}

export async function verifyOtpAndSignup(formData) {
  const response = await fetch(`${BASE_URL}/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Signup failed');
  return data;
}

export async function getUserProfile() {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`${BASE_URL}/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    throw new Error(error.message || 'Failed to fetch user profile');
  }
}

export async function editProfile(updatedData) {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`${BASE_URL}/edit-profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update profile');
    }

    return data;
  } catch (error) {
    console.error("Error updating profile:", error.message);
    throw new Error(error.message || 'Failed to update profile');
  }
}