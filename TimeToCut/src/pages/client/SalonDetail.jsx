import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSalonById } from '../../api/fetchSalons';
import { fetchPrestationsBySalon } from '../../api/fetchPrestations';
import './SalonDetail.css';

const SalonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [salon, setSalon] = useState(null);
  const [prestations, setPrestations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const salonData = await fetchSalonById(id);
        setSalon(salonData);

        const prestationsData = await fetchPrestationsBySalon(id);
        setPrestations(Array.isArray(prestationsData) ? prestationsData : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (isLoading) return <div className="salon-detail-loading">Chargement...</div>;
  if (error) return <div className="salon-detail-error">Erreur: {error}</div>;
  if (!salon) return <div className="salon-detail-error">Salon non trouvé</div>;

  return (
    <div className="salon-detail-page">
      {/* Header avec bouton retour */}
      <div className="salon-detail-header">
        <button className="btn-back" onClick={() => navigate('/salons')}>
          ← Retour aux salons
        </button>
      </div>

      {/* Info du salon */}
      <section className="salon-info">
        <div className="salon-info-content">
          <h1>{salon.nom}</h1>
          <div className="salon-details">
            <div className="detail-item">
              <span className="icon">📍</span>
              <span>{salon.adresse}</span>
            </div>
            <div className="detail-item">
              <span className="icon">🏙️</span>
              <span>{salon.ville}</span>
            </div>
            {salon.telephone && (
              <div className="detail-item">
                <span className="icon">📞</span>
                <a href={`tel:${salon.telephone}`}>{salon.telephone}</a>
              </div>
            )}
            {salon.email && (
              <div className="detail-item">
                <span className="icon">✉️</span>
                <a href={`mailto:${salon.email}`}>{salon.email}</a>
              </div>
            )}
          </div>
          {salon.description && (
            <p className="salon-description">{salon.description}</p>
          )}
        </div>
      </section>

      {/* Prestations du salon */}
      <section className="prestations-section">
        <h2>Nos prestations</h2>
        {prestations.length === 0 ? (
          <p className="no-prestations">Aucune prestation disponible pour ce salon</p>
        ) : (
          <div className="prestations-list">
            {prestations.map((prestation) => (
              <div key={prestation.id_prestation} className="prestation-item">
                <div className="prestation-header">
                  <h3>{prestation.nom}</h3>
                  <span className="prestation-price">{prestation.prix}€</span>
                </div>
                {prestation.description && (
                  <p className="prestation-description">{prestation.description}</p>
                )}
                <div className="prestation-footer">
                  <span className="prestation-duration">
                    ⏱️ {prestation.duree} min
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default SalonDetail;
