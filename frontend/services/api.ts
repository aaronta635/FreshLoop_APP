import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================
// CONFIGURATION - LOCAL BACKEND
// ============================================

// Point the app to the deployed FastAPI backend by default; override via env for local
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'https://freshloopapp-production.up.railway.app/api';

// Token storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const USER_KEY = 'user_data';
const USER_ROLE_KEY = 'user_role';

// ============================================
// TYPE DEFINITIONS (matching local FastAPI)
// ============================================

export type UserRole = 'customer' | 'shop' | 'admin';

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

// For compatibility with existing auth context
export interface Tokens {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

export interface RegisterResponse {
  auth_user: AuthUser;
  tokens: Tokens;
}

// Deal (matches app.schemas.deal.DealResponse)
export interface Deal {
  id: string;
  vendor_id?: number | null;
  title: string;
  restaurant_name: string;
  description: string;
  price: number; // cents
  quantity: number;
  pickup_address: string;
  image_url: string | null;
  is_active: boolean;
  ready_time: string;
  created_at: string;
  updated_at: string | null;
}

export interface DealCreate {
  title: string;
  restaurant_name: string;
  description: string;
  price: number; // cents
  quantity: number;
  pickup_address: string;
  image_url?: string;
  ready_time: string; // ISO
}

export interface UploadImageResponse {
  image_url: string;
}

// Cart types (from /api/cart/items)
export interface CartItem {
  id: number;
  product_id: string;
  title: string;
  restaurant_name: string;
  price: number; // cents
  quantity: number;
  total: number; // cents
  image_url: string | null;
}

export interface CartSummary {
  items: CartItem[];
  total_items: number;
  total_amount: number; // cents
}

export type PaymentMethod = 'card';

// Order history (/api/cart/orders)
export interface OrderItem {
  product_id: string;
  title: string;
  restaurant_name: string;
  quantity: number;
  price: number;
  total: number;
  image_url: string | null;
}

export interface Order {
  id: number;
  payment_ref: string;
  total_amount: number;
  status: string;
  created_at: string | null;
  items: OrderItem[];
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

async function getAuthHeader(): Promise<{ Authorization: string } | {}> {
  const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = (errorData as any).detail || (errorData as any).message || 'An error occurred';
    throw new ApiError(
      typeof message === 'string' ? message : JSON.stringify(message),
      response.status
    );
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

async function storeTokens(tokenResponse: TokenResponse): Promise<void> {
  await AsyncStorage.setItem(ACCESS_TOKEN_KEY, tokenResponse.access_token);
  await AsyncStorage.setItem(USER_ROLE_KEY, tokenResponse.user.role);
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(tokenResponse.user));
}

async function clearAuthData(): Promise<void> {
  await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, USER_KEY, USER_ROLE_KEY]);
}

// ============================================
// AUTH API (local backend)
// ============================================

export const authApi = {
  async register(data: {
    email: string;
    password: string;
    name?: string;
    role?: UserRole;
  }): Promise<RegisterResponse> {
    const payload = {
      email: data.email,
      name: data.name ?? data.email.split('@')[0],
      password: data.password,
      role: data.role ?? 'customer',
    };

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const user = await handleResponse<AuthUser>(response);

    // Immediately log in to get tokens
    const tokens = await this.login({
      email: data.email,
      password: data.password,
      role: payload.role,
    });

    return {
      auth_user: user,
      tokens,
    };
  },

  async login(data: {
    email: string;
    password: string;
    role?: UserRole;
  }): Promise<Tokens> {
    const payload = {
      email: data.email,
      password: data.password,
      role: data.role ?? 'customer',
    };

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const tokenResponse = await handleResponse<TokenResponse>(response);
    await storeTokens(tokenResponse);
    return tokenResponse;
  },

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

  async logout(): Promise<void> {
    await clearAuthData();
  },

  async isLoggedIn(): Promise<boolean> {
    const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    return !!token;
  },

  async getStoredUser(): Promise<AuthUser | null> {
    const userData = await AsyncStorage.getItem(USER_KEY);
    return userData ? (JSON.parse(userData) as AuthUser) : null;
  },

  async getStoredRole(): Promise<UserRole | null> {
    const role = await AsyncStorage.getItem(USER_ROLE_KEY);
    return role as UserRole | null;
  },

  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  },
};

// ============================================
// DEALS API (local /api/deals)
// ============================================

export const dealsApi = {
  async getDeals(): Promise<Deal[]> {
    const response = await fetch(`${API_BASE_URL}/deals`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse<Deal[]>(response);
  },

  async getDeal(id: string): Promise<Deal> {
    const response = await fetch(`${API_BASE_URL}/deals/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse<Deal>(response);
  },

  async getMyDeals(): Promise<Deal[]> {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/deals/my-deals`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
    });
    return handleResponse<Deal[]>(response);
  },

  async createDeal(deal: DealCreate): Promise<Deal> {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/deals/authenticated`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify(deal),
    });
    return handleResponse<Deal>(response);
  },

  async uploadImage(localUri: string): Promise<UploadImageResponse> {
    const formData = new FormData();
    // @ts-ignore React Native file shape
    formData.append('file', {
      uri: localUri,
      name: 'deal.jpg',
      type: 'image/jpeg',
    });

    const response = await fetch(`${API_BASE_URL}/deals/upload-image/`, {
      method: 'POST',
      body: formData,
    });

    return handleResponse<UploadImageResponse>(response);
  },
};

// ============================================
// CART API (local /api/cart)
// ============================================

export const cartApi = {
  async addToCart(data: { product_id: string; quantity?: number }): Promise<void> {
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
    await handleResponse(response);
  },

  async updateCart(data: { product_id: string; quantity: number }): Promise<void> {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify(data),
    });
    await handleResponse(response);
  },

  async removeFromCart(productId: string): Promise<void> {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
      method: 'DELETE',
      headers: {
        ...authHeader,
      },
    });
    await handleResponse(response);
  },

  async clearCart(): Promise<void> {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'DELETE',
      headers: {
        ...authHeader,
      },
    });
    await handleResponse(response);
  },

  // Use /items which already returns items + totals
  async getCartSummary(): Promise<CartSummary> {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/cart/items`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
    });
    return handleResponse<CartSummary>(response);
  },

  async checkout(): Promise<any> {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/cart/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify({}),
    });
    return handleResponse(response);
  },
};

// ============================================
// ORDERS API (local /api/cart/orders)
// ============================================

export const ordersApi = {
  async getOrders(): Promise<Order[]> {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/cart/orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
    });
    return handleResponse<Order[]>(response);
  },
};

// ============================================
// VENDOR API (local /api/vendor)
// ============================================

export const vendorApi = {
  async createProfile(data: {
    business_name: string;
    business_type: string;
    description?: string;
    address: string;
    phone?: string;
    email?: string;
    website?: string;
  }): Promise<any> {
    // Backend currently uses a mock user; no auth required
    const response = await fetch(`${API_BASE_URL}/vendor/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
};


