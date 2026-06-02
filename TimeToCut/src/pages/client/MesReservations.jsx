import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_CONFIG from '../../config/apiConfig';
import './MesReservations.css';

const MesReservations = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const token = localStorage.getItem('clientToken');
  const userData = localStorage.getItem('clientData');

  if (!token || !userData) {
    navigate('/login');
    return;
  }

  const parsedUser = JSON.parse(userData);

  setUser(parsedUser);
  fetchReservations(parsedUser.id_client);
}, [navigate]);

  const fetchReservations = async (idClient) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RESERVATIONS}?id_client=${idClient}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du chargement');
      }

      setReservations(data);
    } catch (error) {
      console.error(error);
      alert('Impossible de charger vos réservations');
    } finally {
      setLoading(false);
    }
  };

  const cancelReservation = async (idReservation) => {
    if (!window.confirm('Voulez-vous vraiment annuler cette réservation ?')) {
      return;
    }

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RESERVATIONS}/${idReservation}/cancel`,
        {
          method: 'PUT',
          headers: API_CONFIG.DEFAULT_OPTIONS.headers,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l’annulation');
      }

      alert('Réservation annulée');

      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.id_reservation === idReservation
            ? { ...reservation, statut: 'annulée' }
            : reservation
        )
      );
    } catch (error) {
      console.error(error);
      alert('Impossible d’annuler la réservation');
    }
  };

  return (
    <div className="mes-reservations-container">
      <header className="mes-reservations-header">
        <h1>Mes réservations</h1>

        <button onClick={() => navigate('/booking')} className="btn-primary">
          Nouvelle réservation
        </button>
      </header>

      {loading ? (
        <p>Chargement...</p>
      ) : reservations.length === 0 ? (
        <div className="empty-card">
          <p>Vous n’avez aucune réservation.</p>
          <button onClick={() => navigate('/booking')} className="btn-primary">
            Réserver maintenant
          </button>
        </div>
      ) : (
        <div className="reservations-list">
          {reservations.map((reservation) => (
            <div key={reservation.id_reservation} className="reservation-card">
              <div>
                <h3>{reservation.prestation}</h3>
                <p>{reservation.salon}</p>
                <p>
                  {reservation.adresse} - {reservation.ville}
                </p>
                <p>
                  📅 {reservation.date_reservation} à{' '}
                  {reservation.heure_reservation?.slice(0, 5)}
                </p>
                <p>
                  ⏱️ {reservation.duree} min — {reservation.prix}€
                </p>
              </div>

              <div className="reservation-actions">
                <span className={`status ${reservation.statut}`}>
                  {reservation.statut}
                </span>

                {reservation.statut !== 'annulée' && (
                  <button
                    onClick={() => cancelReservation(reservation.id_reservation)}
                    className="btn-cancel"
                  >
                    Annuler
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MesReservations;