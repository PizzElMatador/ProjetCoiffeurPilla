import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSalons } from '../../api/fetchSalons';
import SalonCard from '../../components/SalonCard';
import './Salons.css';

const Salons = () => {
  const navigate = useNavigate();
  const [salons, setSalons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSalons = async () => {
      try {
        const data = await fetchSalons();
        setSalons(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadSalons();
  }, []);

  if (isLoading) return <div className="salons-loading">Chargement des salons...</div>;
  if (error) return <div className="salons-error">Erreur: {error}</div>;

  return (
    <div className="salons-page">
      <div className="salons-header">
        <h1>Nos Salons</h1>
        <p>Découvrez nos {salons.length} emplacements disponibles</p>
      </div>
      <div className="salons-grid">
        {salons.map((salon) => (
          <SalonCard 
            key={salon.id_salon} 
            salon={salon} 
            onClick={() => navigate(`/salons/${salon.id_salon}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default Salons;
