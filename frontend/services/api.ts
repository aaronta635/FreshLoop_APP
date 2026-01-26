import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================
// CONFIGURATION
// ============================================

// API Base URL - Your production FreshLoop API
export const API_BASE_URL = 'https://susannah-nondiscountable-maxton.ngrok-free.dev';

// Enable/disable API logging
const ENABLE_API_LOGGING = true;

// Log API calls
function logApiCall(method: string, url: string, options?: RequestInit) {
  if (!ENABLE_API_LOGGING) return;
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🌐 API ${method}: ${url}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  if (options?.headers) {
    const headers = { ...options.headers } as any;
    // Hide sensitive data
    if (headers['Authorization']) {
      headers['Authorization'] = headers['Authorization'].replace(/Bearer .+/, 'Bearer ***');
    }
    console.log('📤 Headers:', JSON.stringify(headers, null, 2));
  }
  
  if (options?.body) {
    try {
      const body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
      console.log('📤 Body:', JSON.stringify(body, null, 2));
    } catch {
      console.log('📤 Body:', options.body);
    }
  }
}

// Log API responses
function logApiResponse(url: string, response: Response, data?: any, error?: any) {
  if (!ENABLE_API_LOGGING) return;
  
  if (error) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`❌ API ERROR: ${url}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Status:', response?.status || 'No Response');
    console.log('Error:', error);
    if (data) {
      console.log('Response Data:', JSON.stringify(data, null, 2));
    }
  } else {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ API SUCCESS: ${url}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Status:', response.status, response.statusText);
    if (data) {
      console.log('Response:', JSON.stringify(data, null, 2).substring(0, 500)); // Limit length
    }
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// Token storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';
const USER_ROLE_KEY = 'user_role';

// ============================================
// TYPE DEFINITIONS (matching your OpenAPI spec)
// ============================================


// Roles enum
export type UserRole = 'customer' | 'vendor';

// Auth User (from /auth/me)
export interface AuthUser {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  email_verified: boolean | null;
  phone_verified: boolean | null;
  default_role: UserRole;
  is_superuser: boolean;
  created_timestamp: string | null;
  updated_timestamp: string | null;
}

// Token response (from /auth/login and /auth/register)
export interface Tokens {
  access_token: string;
  refresh_token: string;
  default_role: UserRole;
}

// Register response
export interface RegisterResponse {
  auth_user: AuthUser;
  tokens: Tokens;
}

// Customer profile
export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  phone_number: string;
  auth_id: number | null;
  country: string;
  state: string;
  address: string;
  is_superuser: boolean | null;
  created_timestamp: string | null;
  updated_timestamp: string | null;
}

// Vendor profile
export interface Vendor {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  phone_number: string;
  auth_id: number | null;
  country: string;
  state: string;
  address: string;
  bio: string;
  profile_picture: string | null;
  ratings: number | null;
  is_superuser: boolean | null;
  created_timestamp: string | null;
  updated_timestamp: string | null;
}

// Product category
export type ProductCategoryEnum = 
  | 'electronics' | 'fashion' | 'home' | 'toys' | 'books'
  | 'beauty' | 'sports' | 'food' | 'health' | 'automotive'
  | 'pets' | 'software' | 'jewelry' | 'baby' | 'grocery'
  | 'furniture' | 'art' | 'games';

export interface ProductCategory {
  id: number;
  category_name: ProductCategoryEnum;
  created_timestamp: string | null;
  updated_timestamp: string | null;
}

// Product image
export interface ProductImage {
  id: number;
  product_image: string;
  product_id: number;
  created_timestamp: string | null;
  updated_timestamp: string | null;
}

// Product review
export interface ProductReview {
  id: number;
  product_id: number;
  review: string;
  rating: number;
  created_timestamp: string | null;
  updated_timestamp: string | null;
}

// Vendor location info (for product display)
export interface VendorLocationInfo {
  id: number;
  username: string;
  address: string;
  state: string;
  country: string;
  order_time: string | null;
}

// Product (main entity - replaces "Deal")
export interface Product {
  id: number;
  sku: string | null;
  product_category_id: number | null;
  vendor_id: number | null;
  product_name: string;
  product_images: ProductImage[];
  category: ProductCategory;
  short_description: string;
  long_description: string;
  product_status: boolean;
  stock: number;
  price: number; // in cents
  reviews?: ProductReview[];
  created_timestamp: string | null;
  updated_timestamp: string | null;
  pickup_time: string | null;
  vendor?: VendorLocationInfo | null;
}

// Product create payload
export interface ProductCreate {
  product_name: string;
  product_images: string[]; // Array of image URLs
  category: ProductCategoryEnum;
  short_description: string;
  long_description: string;
  stock: number;
  price: number;
  sku?: string;
  pickup_time: string;
}

// Product update payload
export interface ProductUpdate {
  product_name?: string;
  short_description?: string;
  long_description?: string;
  category?: ProductCategoryEnum;
  product_status?: boolean;
  stock?: number;
  price?: number;
  sku?: string;
  pickup_time: string;
}

export interface ProductTemplate {
  id: number;
  vendor_id: number;
  template_name: string;
  product_name: string;
  short_description: string;
  long_description: string;
  price: number;
  category_id?: number;
  template_image?: string;
  is_default: boolean;
  created_timestamp: string;
  updated_timestamp: string;
}

export interface ProductTemplateCreate {
  template_name: string;
  product_name: string;
  short_description: string;
  long_description: string;
  price: number;
  category_id?: number;
  template_image?: string;
  is_default?: boolean;
}

// Cart item (from cart summary)
export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  customer_id: number;
  total_amount: number | null;
  product: Product;
  customer: Customer;
  created_timestamp: string | null;
  updated_timestamp: string | null;
}

// Cart summary
export interface CartSummary {
  total_items_quantity: number;
  total_amount: number;
  cart_items: CartItem[];
}

// Order status
export type OrderStatus = 'processing' | 'shipped' | 'refunded' | 'pending' | 'confirmed' | 'cancelled' | 'completed';

// Payment method
export type PaymentMethod = 'cash' | 'bank_transfer' | 'card';

// Order Item
export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  vendor_id: number;
  quantity: number;
  price: number;
  status: OrderStatus;
  created_timestamp: string | null;
  updated_timestamp: string | null;
  product?: {
    id: number;
    product_name: string;
    product_images?: ProductImage[];
  };
  vendor?: {
    id: number;
    username: string;
    address: string;
    state: string;
    country: string;
  }
}

// Payment Details
export interface PaymentDetails {
  payment_method?: PaymentMethod;
  payment_ref?: string;
  [key: string]: any;
}

// Shipping Details
export interface ShippingDetails {
  address?: string;
  state?: string;
  country?: string;
  additional_note?: string;
  contact_information?: string;
  [key: string]: any;
}

// Order
export interface Order {
  id: number;
  pickup_code: string;
  order_date: string;
  customer_id: number;
  customer_order_number: number,
  total_amount: number;
  status: OrderStatus;
  updated_timestamp: string | null;
  customer: Customer;
  order_items: OrderItem[];
  payment_details: PaymentDetails | null;
  shipping_details: ShippingDetails[];
}

// Vendor order item
export interface VendorOrderItem {
  id: number;
  vendor_id: number;
  price: number;
  product_id: number;
  order_id: number;
  quantity: number;
  status: OrderStatus;
  order: Order;
  created_timestamp: string | null;
  updated_timestamp: string | null;
}

// Checkout payload
export interface CheckoutCreate {
  payment_details: {
    payment_method: PaymentMethod;
    payment_ref?: string;
  };
  shipping_details?: {
    address?: string;
    state?: string;
    country?: string;
    additional_note?: string;
    contact_information?: string;
  };
}

// ============================================
// API ERROR CLASS
// ============================================

export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get auth header with access token
async function getAuthHeader(): Promise<{ Authorization: string } | {}> {
  const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Handle API responses
async function handleResponse<T>(response: Response, url?: string): Promise<T> {
  let responseData: any = null;
  
  try {
    // Try to get response text first (for error logging)
    const responseText = await response.clone().text();
    
    // Parse JSON if possible
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText || {};
    }
  } catch (e) {
    console.warn('Could not read response body:', e);
  }
  
  if (!response.ok) {
    const errorData = responseData || {};
    const message = errorData.detail || errorData.message || errorData.error || 'An error occurred';
    
    // Log error details
    if (url) {
      logApiResponse(url, response, errorData, message);
    } else {
      console.error('❌ API Error:', {
        url: response.url,
        status: response.status,
        statusText: response.statusText,
        error: message,
        data: errorData,
      });
    }
    
    throw new ApiError(
      typeof message === 'string' ? message : JSON.stringify(message),
      response.status
    );
  }
  
  // Log success
  if (url) {
    logApiResponse(url, response, responseData);
  }
  
  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }
  
  return responseData;
}

// Enhanced fetch wrapper with logging
async function apiFetch(url: string, options?: RequestInit): Promise<Response> {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  
  logApiCall(options?.method || 'GET', fullUrl, options);
  
  try {
    const response = await fetch(fullUrl, options);
    return response;
  } catch (error: any) {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error(`❌ FETCH ERROR: ${fullUrl}`);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('Network Error:', error.message);
    console.error('Error Type:', error.name);
    console.error('Full Error:', error);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    throw error;
  }
}

// Store tokens after login/register
async function storeTokens(tokens: Tokens): Promise<void> {
  await AsyncStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
  await AsyncStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
  await AsyncStorage.setItem(USER_ROLE_KEY, tokens.default_role);
}

// Clear all stored auth data
async function clearAuthData(): Promise<void> {
  await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY, USER_ROLE_KEY]);
}

// ============================================
// AUTH API
// ============================================

export const authApi = {
  // Register new user
  async register(data: {
    email: string;
    password: string;
    default_role: UserRole;
  }): Promise<RegisterResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const result = await handleResponse<RegisterResponse>(response);
    
    // Store tokens
    await storeTokens(result.tokens);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(result.auth_user));
    
    return result;
  },

  // Login user (OAuth2 form format)
  async login(data: {
    email: string;
    password: string;
  }): Promise<Tokens> {
    // Your API uses OAuth2 form-urlencoded format
    const formData = new URLSearchParams();
    formData.append('username', data.email); // OAuth2 uses 'username'
    formData.append('password', data.password);

    const url = '/auth/login';
    const response = await apiFetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const tokens = await handleResponse<Tokens>(response, url);
    
    // Store tokens
    await storeTokens(tokens);
    
    // Fetch and store user data
    const user = await this.getCurrentUser();
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    
    return tokens;
  },

  // Verify email or phone with OTP
  async verifyOTP(data: {
    auth_id: number;
    token: string;
    otp_type: 'email_verification' | 'phone_number_verification' | 'reset_password';
  }): Promise<{ verified: boolean }> {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Get current user
  async getCurrentUser(): Promise<AuthUser> {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
    });
    return handleResponse<AuthUser>(response);
  },

  // Logout
  async logout(): Promise<void> {
    try {
      const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
      if (token) {
        const authHeader = await getAuthHeader();
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...authHeader,
          },
          body: JSON.stringify({ access_token: token }),
        });
      }
    } catch (error) {
      console.log('Logout API call failed, clearing local data anyway');
    }
    await clearAuthData();
  },

  // Forgot password
  async forgotPassword(email: string): Promise<{ reset_password_link_sent: boolean }> {
    const response = await fetch(`${API_BASE_URL}/auth/forget-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    return handleResponse(response);
  },

  // Reset password
  async resetPassword(token: string, password: string): Promise<{ password_reset: boolean }> {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password?token=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });
    return handleResponse(response);
  },

  // Change password
  async changePassword(oldPassword: string, newPassword: string): Promise<{ password_changed: boolean }> {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
    });
    return handleResponse(response);
  },

  // Refresh access token
  async refreshToken(): Promise<Tokens> {
    const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      throw new ApiError('No refresh token available', 401);
    }

    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    
    const tokens = await handleResponse<Tokens>(response);
    await storeTokens(tokens);
    return tokens;
  },

  // Check if username exists
  async checkUsername(username: string): Promise<{ username_exists: boolean }> {
    const response = await fetch(`${API_BASE_URL}/auth/check-username`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });
    return handleResponse(response);
  },

  // Check if user is logged in
  async isLoggedIn(): Promise<boolean> {
    const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    return !!token;
  },

  // Get stored user
  async getStoredUser(): Promise<AuthUser | null> {
    const userData = await AsyncStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  // Get stored role
  async getStoredRole(): Promise<UserRole | null> {
    const role = await AsyncStorage.getItem(USER_ROLE_KEY);
    return role as UserRole | null;
  },

  // Get stored token
  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  },
};

// ============================================
// CUSTOMER API
// ============================================

export const customerApi = {
  // Create customer profile (call after registration)
  async createProfile(data: {
    first_name: string;
    last_name: string;
    username: string;
    phone_number: string;
    country: string;
    state: string;
    address: string;
  }): Promise<Customer> {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/customer/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Customer>(response);
  },
};

// ============================================
// VENDOR API
// ============================================

export const vendorApi = {
  // Create vendor profile (call after registration)
  async createProfile(data: {
    first_name: string;
    last_name: string;
    username: string;
    phone_number: string;
    country: string;
    state: string;
    address: string;
    bio: string;
    profile_picture?: string;
    ratings?: number;
  }): Promise<Vendor> {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/vendor/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify({
        ...data,
        ratings: data.ratings ?? 0,
      }),
    });
    return handleResponse<Vendor>(response);
  },
};

// ============================================
// PRODUCTS API (replaces Deals API)
// ============================================

export const productsApi = {
  // Get all products (public, for customers)
  async getProducts(params?: {
    search?: string;
    skip?: number;
    limit?: number;
  }): Promise<Product[]> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString();
    const url = `/products${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiFetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse<Product[]>(response, url);
  },

  // Get single product by ID
  async getProduct(id: number): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse<Product>(response);
  },

  // Get vendor's own products (authenticated)
  async getMyProducts(params?: {
    search?: string;
    skip?: number;
    limit?: number;
  }): Promise<Product[]> {
    const authHeader = await getAuthHeader();
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/products/me${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
    });
    return handleResponse<Product[]>(response);
  },

  // Get products sorted by price
  async getProductsByPrice(params?: {
    skip?: number;
    limit?: number;
  }): Promise<Product[]> {
    const queryParams = new URLSearchParams();
    if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/products/price${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse<Product[]>(response);
  },

  // Create new product (for vendors)
  async createProduct(product: ProductCreate): Promise<Product> {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify(product),
    });
    return handleResponse<Product>(response);
  },

  // Update product
  async updateProduct(id: number, product: ProductUpdate): Promise<Product> {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify(product),
    });
    return handleResponse<Product>(response);
  },

  // Delete product
  async deleteProduct(id: number): Promise<void> {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        ...authHeader,
      },
    });
    await handleResponse(response);
  },

  async uploadImage(imageUri: string): Promise<{ image_url: string }> {
    const authHeader = await getAuthHeader();

    const formData = new FormData();

    // Get file execution
    const uriParts = imageUri.split('.');
    const fileType = uriParts[uriParts.length -1];

    formData.append('file', {
      uri: imageUri,
      type: `image/${fileType}`,
      name: `product_${Date.now()}.${fileType}`,
    } as any);

    const response = await fetch(`${API_BASE_URL}/products/upload-image`, {
      method: 'POST',
      headers: {
        ...authHeader,
      },
      body: formData,
    });

    return handleResponse<{ image_url: string }>(response);

  },

  // Update product image
  async updateProductImage(productImageId: number, imageUrl: string): Promise<{
    product_image: string;
    updated_timestamp: string;
  }> {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/products/image/${productImageId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify({ product_image: imageUrl }),
    });
    return handleResponse(response);
  },

  // Add product review
  async addReview(data: {
    product_id: number;
    review: string;
    rating: number;
  }): Promise<ProductReview> {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/products/add-review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify(data),
    });
    return handleResponse<ProductReview>(response);
  },

  // Update product review
  async updateReview(reviewId: number, data: {
    review?: string;
    rating?: number;
  }): Promise<ProductReview> {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/products/edit-review/${reviewId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify(data),
    });
    return handleResponse<ProductReview>(response);
  },

  // Helper: Get first image URL from product
  getImageUrl(product: Product): string {
    if (product.product_images && product.product_images.length > 0) {
      return product.product_images[0].product_image;
    }
    return 'https://via.placeholder.com/300x200?text=No+Image';
  },

  // Helper: Format price from cents to dollars
  formatPrice(cents: number): string {
    return `$${(cents / 100).toFixed(2)}`;
  },
};

// =============
// TEMPLATE API
// =============

export const templatesApi = {
  async getMyTemplates(): Promise<ProductTemplate[]> {
    const authHeader = await getAuthHeader();
    const url = '/templates/me';
    const response = await apiFetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
    });
    return handleResponse<ProductTemplate[]>(response, url);
  },

  async createTemplate(template: ProductTemplateCreate): Promise<ProductTemplate> {
    const authHeader = await getAuthHeader();
    const url = '/templates';
    const response = await apiFetch(url, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      }, 
      body: JSON.stringify(template),
    });
    return handleResponse<ProductTemplate>(response, url);
  },

  async updateTemplate(id: number, template: Partial<ProductTemplateCreate>): Promise<ProductTemplate> {
    const authHeader = await getAuthHeader();
    const url = `/templates/${id}`;
    const response = await apiFetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify(template),
    });
    return handleResponse<ProductTemplate>(response, url)
  },

  async deleteTemplate(id: number): Promise<void> {
    const authHeader = await getAuthHeader();
    const url = `/templates/${id}`;
    const response = await apiFetch(url, {
      method: 'DELETE',
      headers: {
        ...authHeader,
      },
    });
    return handleResponse<void>(response, url);
  },

  async createProductFromTemplate(templateId: number, overrides?: {
    stock?: number;
    pickup_time?: string;
  }): Promise<Product> {
    const authHeader = await getAuthHeader();
    const url = `/templates/${templateId}/create-product`;
    const response = await apiFetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify(overrides || {}),
    });
    return handleResponse<Product>(response, url);
  },
};

// ============================================
// CART API
// ============================================

export const cartApi = {
  // Add item to cart
  async addToCart(data: {
    product_id: number;
    quantity?: number;
  }): Promise<CartItem> {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify({
        product_id: data.product_id,
        quantity: data.quantity ?? 1,
      }),
    });
    return handleResponse<CartItem>(response);
  },

  // Update cart item quantity
  async updateCart(data: {
    product_id: number;
    quantity: number;
  }): Promise<{
    product_id: number;
    quantity: number;
    updated_timestamp: string;
  }> {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/cart/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Remove item from cart
  async removeFromCart(productId: number): Promise<void> {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
      method: 'DELETE',
      headers: {
        ...authHeader,
      },
    });
    await handleResponse(response);
  },

  // Clear entire cart
  async clearCart(): Promise<void> {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/cart/`, {
      method: 'DELETE',
      headers: {
        ...authHeader,
      },
    });
    await handleResponse(response);
  },

  // Get cart summary
  async getCartSummary(): Promise<CartSummary> {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/cart/summary`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
    });
    return handleResponse<CartSummary>(response);
  },

  // Checkout
  async checkout(data: CheckoutCreate): Promise<any> {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/cart/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Verify payment
  async verifyPayment(paymentRef: string): Promise<{ payment_verified: boolean }> {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/cart/verify-payment/${paymentRef}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
    });
    return handleResponse(response);
  },
};

// ============================================
// ORDERS API
// ============================================

export const ordersApi = {
  // Get all orders for current user
  async getAllOrders(): Promise<Order[]> {
    const authHeader = await getAuthHeader();
    const url = '/order/';

    const response = await apiFetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
    });
    return handleResponse<Order[]>(response, url);
  },

  // Get vendor dashboard stats
  async getVendorDashboard(): Promise<{
    total_sales: number;
    total_orders: number;
  }> {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/order/vendor/activity`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
    });
    return handleResponse(response);
  },

  // Get sales activity by date
  async getSalesByDate(days: number = 7): Promise<{
    total_sales: number;
    total_orders: number;
  }> {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/order/vendor/sales/date?days=${days}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
    });
    return handleResponse(response);
  },

  // Get vendor's order items
  async getVendorOrders(): Promise<VendorOrderItem[]> {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/order/vendor/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
    });
    return handleResponse<VendorOrderItem[]>(response);
  },

  // Update order item status
  async updateOrderStatus(orderItemId: number, status: OrderStatus): Promise<any> {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/order/order-items/${orderItemId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },
};

// ============================================
// HEALTH CHECK API
// ============================================

export const healthApi = {
  async check(): Promise<{ msg: string }> {
    const response = await fetch(`${API_BASE_URL}/monitoring/health`, {
      method: 'GET',
    });
    return handleResponse(response);
  },
};

// ============================================
// BACKWARD COMPATIBILITY (for gradual migration)
// ============================================

// API_BASE_URL is already exported at the top of the file

