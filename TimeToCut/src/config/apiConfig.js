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

    // Utilisateur Salon (Admin / Coiffeur)
    UTILISATEUR_SALON_LOGIN: '/api/utilisateur-salon/login',
    UTILISATEUR_SALON_VERIFY: '/api/utilisateur-salon/verify',
    UTILISATEUR_SALON_LOGOUT: '/api/utilisateur-salon/logout',

    // Prestations
    PRESTATIONS: '/api/prestations',
    PRESTATIONS_BY_SALON: '/api/prestations?salon=',

    // Salons
    SALONS: '/api/salons',

    // Créneaux
    CRENEAUX: '/api/creneaux',

    // Réservations
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