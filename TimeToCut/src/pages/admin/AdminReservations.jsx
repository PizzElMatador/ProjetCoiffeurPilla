import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const response = await fetch('/api/admin/reservations', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setReservations(data);
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) loadReservations();
  }, [token]);

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="admin-reservations">
      <h1>Réservations</h1>
      <table>
        <thead>
          <tr>
            <th>Client</th>
            <th>Prestation</th>
            <th>Salon</th>
            <th>Créneau</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.id}>
              <td>{reservation.clientName}</td>
              <td>{reservation.prestation}</td>
              <td>{reservation.salon}</td>
              <td>{reservation.slot}</td>
              <td>{reservation.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminReservations;
