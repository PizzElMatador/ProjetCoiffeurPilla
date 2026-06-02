import { useState, useEffect } from 'react';
import { fetchPrestationsBySalon } from '../../api/fetchPrestations';
import PrestationCard from '../../components/PrestationCard';

const Prestations = ({ salonId }) => {
  const [prestations, setPrestations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPrestations = async () => {
      try {
        const data = await fetchPrestationsBySalon(salonId);
        setPrestations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (salonId) loadPrestations();
  }, [salonId]);

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="prestations-page">
      <h1>Prestations</h1>
      <div className="prestations-grid">
        {prestations.map((prestation) => (
          <PrestationCard key={prestation.id} prestation={prestation} />
        ))}
      </div>
    </div>
  );
};

export default Prestations;
