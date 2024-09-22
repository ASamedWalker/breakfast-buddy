// src/utils/uberEatsApi.ts

import axios from 'axios';

const UBER_API_URL = 'https://sandbox-api.uber.com/v1.2/products?';
const UBER_TOKEN_URL = 'https://sandbox-login.uber.com/oauth/v2/token';

let cachedToken: string | null = null;
let tokenExpiration: number | null = null;

const getAccessToken = async () => {
  if (cachedToken && tokenExpiration && Date.now() < tokenExpiration) {
    return cachedToken;
  }

  try {
    const response = await axios.post(UBER_TOKEN_URL, null, {
      params: {
        client_id: process.env.UBER_CLIENT_ID,
        client_secret: process.env.UBER_CLIENT_SECRET,
        grant_type: 'client_credentials',
        scope: 'eats.get_feed_by_id', // Adjust this scope as needed
      },
    });

    cachedToken = response?.data.access_token;
    tokenExpiration = Date.now() + (response?.data.expires_in * 1000);
    return cachedToken;
  } catch (error) {
    console.error('Error getting access token:', error.response?.data || error.message);
    throw error;
  }
};

export const searchRestaurants = async (latitude: number, longitude: number) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.get(`${UBER_API_URL}/restaurants`, {
      params: { latitude, longitude },
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error in searchRestaurants:', error.response?.data || error.message);
    throw error;
  }
};

// Add other Uber Eats API functions as needed