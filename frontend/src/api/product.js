import { API_URL } from '../config.js';
const BASE_URL = API_URL + "/api/products";

export async function getProductByName(name) {
  try {
    const response = await fetch(`${BASE_URL}/${encodeURIComponent(name)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch product");
    }

    return data;
  } catch (error) {
    console.error("Error fetching product:", error.message);
    throw error;
  }
}