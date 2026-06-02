/**
 * Configuration de l'API
 * À modifier selon votre environnement
 */

const API_CONFIG = {
  // URL de base de l'API PHP
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',

  // Endpoints
  ENDPOINTS: {
    // Client Authentication
    CLIENT_LOGIN: '/api/client/login',
    CLIENT_SIGNUP: '/api/client/signup',
    CLIENT_VERIFY: '/api/client/verify',
    CLIENT_LOGOUT: '/api/client/logout',

    // Admin Authentication
    ADMIN_LOGIN: '/api/admin/login',
    ADMIN_VERIFY: '/api/admin/verify',
    ADMIN_LOGOUT: '/api/admin/logout',

    // Prestations
    PRESTATIONS: '/api/prestations',
    PRESTATIONS_BY_SALON: '/api/prestations?salon=',

    // Salons
    SALONS: '/api/salons',

    // Creneaux
    CRENEAUX: '/api/creneaux',

    // Reservations
    RESERVATIONS: '/api/reservations',

    // Stats
    STATS: '/api/stats',
  },

  // Timeout des requêtes (en ms)
  TIMEOUT: 30000,

  // Options de fetch par défaut
  DEFAULT_OPTIONS: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
};

export default API_CONFIG;
