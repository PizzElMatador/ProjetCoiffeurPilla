import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const clientToken = localStorage.getItem('clientToken');

  const handleViewAllSalons = () => {
    navigate('/salons');
  };

  return (
    <div className="home-page">
      <header className="header">
        <div className="header-content">
          <h1
            className="logo"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          >
            Time To Cut
          </h1>

          <nav className="nav">
            <button
              className="nav-link"
              onClick={() => navigate('/salons')}
            >
              Salons
            </button>

            {clientToken && (
              <button
                className="nav-link"
                onClick={() => navigate('/mes-reservations')}
              >
                Mes réservations
              </button>
            )}
          </nav>

          <div className="header-actions">
  {clientToken ? (
    <>
      <button
        className="nav-link"
        onClick={() => navigate('/booking')}
      >
        Réserver
      </button>

      <button
        className="btn-link"
        onClick={() => {
          localStorage.clear();
          navigate('/login', { replace: true });
        }}
      >
        Déconnexion
      </button>
    </>
  ) : (
    <>
      <button
        className="btn-link"
        onClick={() => navigate('/login')}
      >
        Connexion
      </button>

      <button
        className="btn-primary-header"
        onClick={() => navigate('/signup')}
      >
        S'inscrire
      </button>
    </>
  )}
</div>
        </div>
      </header>

      <section className="hero">
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <h2 className="hero-title">
            Réservez votre coiffeur en beauté
          </h2>

          <p className="hero-subtitle">
            Simple • Immédiat • 24h/24
          </p>

          <button
            className="cta-button"
            onClick={handleViewAllSalons}
          >
            Voir les salons
          </button>
        </div>
      </section>

      <section className="quick-links">
        <div className="quick-link">
          <div className="link-icon">💇</div>
          <h3>Services</h3>
          <p>Découvrez tous nos services</p>
        </div>

        <div className="quick-link">
          <div className="link-icon">🏪</div>
          <h3>Nos salons</h3>
          <p>Plusieurs adresses près de chez vous</p>
        </div>

        <div className="quick-link">
          <div className="link-icon">⏱️</div>
          <h3>Réservation rapide</h3>
          <p>En quelques clics seulement</p>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Prêt à réserver ?</h2>

          {!clientToken ? (
            <>
              <p>
                Créez un compte et accédez à toutes nos prestations
              </p>

              <button
                className="btn-large"
                onClick={() => navigate('/signup')}
              >
                Commencer maintenant
              </button>
            </>
          ) : (
            <>
              <p>
                Accédez à votre espace de réservation
              </p>

              <button
                className="btn-large"
                onClick={() => navigate('/booking')}
              >
                Réserver un rendez-vous
              </button>
            </>
          )}
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2026 Time To Cut. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default Home;