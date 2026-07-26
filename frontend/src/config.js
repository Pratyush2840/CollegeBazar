const rawApiUrl = import.meta.env.VITE_API_URL || "https://collegebazaar-04q6.onrender.com";
export const API_URL = rawApiUrl.replace(/\/+$/, "");