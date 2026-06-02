import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_CONFIG from '../../config/apiConfig';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    salons: 0,
    prestations: 0,
    reservations: 0,
    chiffreAffaires: 0,
  });

  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('adminData'));
  const token = localStorage.getItem('adminToken');

  const dashboardPath = user?.role === 'coiffeur' ? '/coiffeur/dashboard' : '/admin/dashboard';
  const reservationsPath = user?.role === 'coiffeur' ? '/coiffeur/reservations' : '/admin/reservations';
  const prestationsPath = user?.role === 'coiffeur' ? '/coiffeur/prestations' : '/admin/prestations';

  useEffect(() => {
    if (!token || !user) {
      navigate('/admin/login');
      return;
    }

    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      let prestationsUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRESTATIONS}`;
      let reservationsUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RESERVATIONS}`;

      if (user.role === 'coiffeur') {
        prestationsUrl += `?salon=${user.id_salon}`;
        reservationsUrl += `?id_salon=${user.id_salon}`;
      }

      const requests = [
        fetch(prestationsUrl),
        fetch(reservationsUrl),
      ];

      if (user.role === 'admin') {
        requests.unshift(fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SALONS}`));
      }

      const responses = await Promise.all(requests);

      let salons = [];
      let prestations = [];
      let reservations = [];

      if (user.role === 'admin') {
        salons = await responses[0].json();
        prestations = await responses[1].json();
        reservations = await responses[2].json();
      } else {
        prestations = await responses[0].json();
        reservations = await responses[1].json();
        salons = user.id_salon ? [user.id_salon] : [];
      }

      const ca = reservations.reduce((total, reservation) => {
        return total + Number(reservation.prix || 0);
      }, 0);

      setStats({
        salons: salons.length || 0,
        prestations: prestations.length || 0,
        reservations: reservations.length || 0,
        chiffreAffaires: ca,
      });
    } catch (error) {
      console.error(error);
      alert('Impossible de charger les statistiques');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    navigate('/admin/login');
  };

  if (loading) {
    return <div className="dashboard-loading">Chargement...</div>;
  }

  return (
    <div className="admin-dashboard">
      <nav className="dashboard-navbar">
        <h2>Time To Cut</h2>

        <div>
          <button onClick={() => navigate(dashboardPath)}>Dashboard</button>
          <button onClick={() => navigate(reservationsPath)}>Réservations</button>
          <button onClick={() => navigate(prestationsPath)}>Prestations</button>

          {user.role === 'admin' && (
            <button onClick={() => navigate('/admin/salons')}>Salons</button>
          )}

          <button className="logout-btn" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </nav>

      <section className="dashboard-hero">
        <h1>Bienvenue {user.prenom} 👋</h1>
        <p>
          {user.role === 'admin'
            ? 'Gérez tous vos salons, prestations et réservations.'
            : 'Gérez les prestations et réservations de votre salon.'}
        </p>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <span>🏪</span>
          <h3>{stats.salons}</h3>
          <p>{user.role === 'admin' ? 'Salons' : 'Mon salon'}</p>
        </div>

        <div className="stat-card">
          <span>✂️</span>
          <h3>{stats.prestations}</h3>
          <p>Prestations</p>
        </div>

        <div className="stat-card">
          <span>📅</span>
          <h3>{stats.reservations}</h3>
          <p>Réservations</p>
        </div>

        <div className="stat-card">
          <span>💰</span>
          <h3>{stats.chiffreAffaires}€</h3>
          <p>Chiffre d’affaires</p>
        </div>
      </section>

      <section className="dashboard-actions">
        <div onClick={() => navigate(reservationsPath)} className="action-card">
          <span>📅</span>
          <h3>Réservations</h3>
          <p>Voir les rendez-vous clients</p>
        </div>

        <div onClick={() => navigate(prestationsPath)} className="action-card">
          <span>✂️</span>
          <h3>Prestations</h3>
          <p>Ajouter, modifier ou supprimer une prestation</p>
        </div>

        {user.role === 'admin' && (
          <div onClick={() => navigate('/admin/salons')} className="action-card">
            <span>🏪</span>
            <h3>Salons</h3>
            <p>Gérer les salons Time To Cut</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;