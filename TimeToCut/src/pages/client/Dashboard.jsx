import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutClient } from '../../api/authAPI';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('clientData');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutClient();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
    
    localStorage.removeItem('clientToken');
    localStorage.removeItem('clientData');
    navigate('/login');
  };

  if (isLoading) return <div className="loading">Chargement...</div>;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Time To Cut</h1>
          <div className="header-actions">
            <span className="user-name">
              Bienvenue, {user?.prenom} {user?.nom}
            </span>
            <button className="logout-btn" onClick={handleLogout}>
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>Prêt à réserver votre rendez-vous ?</h2>
          <p>Sélectionnez une étape ci-dessous pour commencer</p>
        </div>

        {/* Steps */}
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Choisir un salon</h3>
            <p>Sélectionnez le salon le plus proche de vous</p>
            <button 
              className="step-btn"
              onClick={() => navigate('/salons')}
            >
              Voir les salons
            </button>
          </div>

          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Sélectionner une prestation</h3>
            <p>Parcourez nos services et tarifs</p>
            <button 
              className="step-btn"
              onClick={() => navigate('/prestations')}
            >
              Voir les prestations
            </button>
          </div>

          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Réserver un créneau</h3>
            <p>Choisissez la date et l'heure qui vous convient</p>
            <button 
              className="step-btn"
              onClick={() => navigate('/creneaux')}
            >
              Voir les créneaux
            </button>
          </div>

          <div className="step-card">
  <div className="step-number">📅</div>
  <h3>Mes réservations</h3>
  <p>Consultez ou annulez vos rendez-vous</p>
  <button 
    className="step-btn"
    onClick={() => navigate('/mes-reservations')}
  >
    Voir mes réservations
  </button>
</div>

          <div className="step-card">
            <div className="step-number">4</div>
            <h3>Confirmer la réservation</h3>
            <p>Finalisez votre rendez-vous</p>
            <button 
              className="step-btn"
              onClick={() => navigate('/confirmation')}
            >
              Confirmez
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="user-info-section">
          <h3>Vos informations</h3>
          <div className="user-info-card">
            <div className="info-row">
              <span className="label">Nom :</span>
              <span className="value">{user?.nom}</span>
            </div>
            <div className="info-row">
              <span className="label">Prénom :</span>
              <span className="value">{user?.prenom}</span>
            </div>
            <div className="info-row">
              <span className="label">Email :</span>
              <span className="value">{user?.email}</span>
            </div>
            {user?.telephone && (
              <div className="info-row">
                <span className="label">Téléphone :</span>
                <span className="value">{user?.telephone}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
