import axios from 'axios';

// In production (Amplify) set REACT_APP_API_URL to the HTTPS backend URL,
// e.g. the CloudFront domain https://xxxx.cloudfront.net. Falls back to
// localhost for dev. (Terraform injects this value automatically.)
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001',
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use((config) => {
  const stored = localStorage.getItem('user');
  const user = stored ? JSON.parse(stored) : null;
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default axiosInstance;
