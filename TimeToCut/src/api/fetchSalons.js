import API_CONFIG from '../config/apiConfig';

// Fetch all salons from PHP backend
export const fetchSalons = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SALONS}`, {
      headers: API_CONFIG.DEFAULT_OPTIONS.headers,
    });
    if (!response.ok) throw new Error('Erreur lors de la récupération des salons');
    return await response.json();
  } catch (error) {
    console.error('Erreur fetchSalons:', error);
    throw error;
  }
};

// Fetch salon by ID
export const fetchSalonById = async (id) => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SALONS}/${id}`, {
      headers: API_CONFIG.DEFAULT_OPTIONS.headers,
    });
    if (!response.ok) throw new Error('Salon non trouvé');
    return await response.json();
  } catch (error) {
    console.error('Erreur fetchSalonById:', error);
    throw error;
  }
};
