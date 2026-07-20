
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Map of endpoints for autocomplete clarity across files
export const ENDPOINTS = {
  SEND_OTP: '/api/auth/send-otp',
  CREATE_BOOKING: '/api/bookings/create-verified',
  HALL_BOOKINGS: '/hall-bookings',
  SPA_BOOKINGS: '/spa-bookings',
  GYM_MEMBERSHIPS: '/gym-memberships',
  VENDOR_INVITES: '/vendor-invites',
};
