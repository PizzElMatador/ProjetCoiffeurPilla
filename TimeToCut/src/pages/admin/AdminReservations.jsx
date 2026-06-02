import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_CONFIG from '../../config/apiConfig';
import './AdminReservations.css';

const AdminReservations = () => {
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      let url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RESERVATIONS}`;

      if (user.role === 'coiffeur') {
        url += `?id_salon=${user.id_salon}`;
      }

      const response = await fetch(url, {
        headers: {
          ...API_CONFIG.DEFAULT_OPTIONS.headers,
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du chargement');
      }

      setReservations(data);
    } catch (error) {
      console.error(error);
      alert(error.message || 'Impossible de charger les réservations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    navigate('/admin/login');
  };

  if (isLoading) {
    return <div className="admin-loading">Chargement...</div>;
  }

  return (
    <div className="admin-reservations">
      <header>
        <h1>
          {user.role === 'admin'
            ? 'Toutes les réservations'
            : 'Réservations de mon salon'}
        </h1>

        <div className="admin-actions">
          <span>
            Connecté : {user.prenom} {user.nom} ({user.role})
          </span>

          <button onClick={() => navigate(dashboardPath)}>
            Dashboard
          </button>

          <button onClick={() => navigate(reservationsPath)}>
            Réservations
          </button>

          <button onClick={() => navigate(prestationsPath)}>
            Prestations
          </button>

          {user.role === 'admin' && (
            <button onClick={() => navigate('/admin/salons')}>
              Salons
            </button>
          )}

          <button onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </header>

      {reservations.length === 0 ? (
        <p>Aucune réservation trouvée.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Client</th>
              <th>Prestation</th>
              <th>Salon</th>
              <th>Date</th>
              <th>Heure</th>
              <th>Statut</th>
            </tr>
          </thead>

          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id_reservation}>
                <td>
                  {reservation.client_prenom} {reservation.client_nom}
                </td>
                <td>{reservation.prestation}</td>
                <td>{reservation.salon}</td>
                <td>{reservation.date_reservation}</td>
                <td>{reservation.heure_reservation?.slice(0, 5)}</td>
                <td>{reservation.statut}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminReservations;