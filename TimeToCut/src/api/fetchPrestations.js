import API_CONFIG from '../config/apiConfig';

// Fetch all prestations
export const fetchPrestations = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRESTATIONS}`, {
      headers: API_CONFIG.DEFAULT_OPTIONS.headers,
    });
    if (!response.ok) throw new Error('Erreur lors de la récupération des prestations');
    return await response.json();
  } catch (error) {
    console.error('Erreur fetchPrestations:', error);
    throw error;
  }
};

// Fetch prestations by salon ID
export const fetchPrestationsBySalon = async (salonId) => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRESTATIONS}?salon=${salonId}`, {
      headers: API_CONFIG.DEFAULT_OPTIONS.headers,
    });
    if (!response.ok) throw new Error('Prestations non trouvées');
    return await response.json();
  } catch (error) {
    console.error('Erreur fetchPrestationsBySalon:', error);
    throw error;
  }
};

// Create prestation (admin)
export const createPrestation = async (token, data) => {
  try {
    const response = await fetch('/api/prestations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erreur lors de la création');
    return await response.json();
  } catch (error) {
    console.error('Erreur createPrestation:', error);
    throw error;
  }
};
