import API_CONFIG from '../config/apiConfig';

// ============ ADMIN AUTHENTICATION ============

// Admin login
export const loginAdmin = async (credentials) => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN_LOGIN}`, {
      method: 'POST',
      headers: API_CONFIG.DEFAULT_OPTIONS.headers,
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error('Erreur d\'authentification');
    return await response.json(); // Returns { token, user }
  } catch (error) {
    console.error('Erreur loginAdmin:', error);
    throw error;
  }
};

// Verify token
export const verifyToken = async (token) => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN_VERIFY}`, {
      headers: { ...API_CONFIG.DEFAULT_OPTIONS.headers, 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Token invalide');
    return await response.json();
  } catch (error) {
    console.error('Erreur verifyToken:', error);
    throw error;
  }
};

// Logout
export const logoutAdmin = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN_LOGOUT}`, { 
      method: 'POST' 
    });
    return await response.json();
  } catch (error) {
    console.error('Erreur logoutAdmin:', error);
    throw error;
  }
};

// ============ CLIENT AUTHENTICATION ============

// Client login
export const loginClient = async (credentials) => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CLIENT_LOGIN}`, {
      method: 'POST',
      headers: API_CONFIG.DEFAULT_OPTIONS.headers,
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur d\'authentification');
    }
    return await response.json(); // Returns { token, user }
  } catch (error) {
    console.error('Erreur loginClient:', error);
    throw error;
  }
};

// Client signup
export const signupClient = async (userData) => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CLIENT_SIGNUP}`, {
      method: 'POST',
      headers: API_CONFIG.DEFAULT_OPTIONS.headers,
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de l\'inscription');
    }
    return await response.json(); // Returns { token, user }
  } catch (error) {
    console.error('Erreur signupClient:', error);
    throw error;
  }
};

// Verify client token
export const verifyClientToken = async (token) => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CLIENT_VERIFY}`, {
      headers: { ...API_CONFIG.DEFAULT_OPTIONS.headers, 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Token invalide');
    return await response.json();
  } catch (error) {
    console.error('Erreur verifyClientToken:', error);
    throw error;
  }
};

// Client logout
export const logoutClient = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CLIENT_LOGOUT}`, {
      method: 'POST',
      headers: { ...API_CONFIG.DEFAULT_OPTIONS.headers, 'Authorization': `Bearer ${localStorage.getItem('clientToken')}` },
    });
    return await response.json();
  } catch (error) {
    console.error('Erreur logoutClient:', error);
    throw error;
  }
};
