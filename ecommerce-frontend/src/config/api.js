const API_BASE_URL = 'http://localhost:5000/api';

export const ENDPOINTS = {
  PRODUCTS: `${API_BASE_URL}/products`,
  PRODUCT_BY_ID: (id) => `${API_BASE_URL}/products/${id}`,
  PRODUCT_BY_CATEGORY: (category) => `${API_BASE_URL}/products/category/${category}`,
  PRODUCT_REVIEW: (id) => `${API_BASE_URL}/products/${id}/review`,
};

export default API_BASE_URL;
