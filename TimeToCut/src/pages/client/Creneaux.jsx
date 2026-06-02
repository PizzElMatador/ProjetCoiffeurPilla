import { useState, useEffect } from 'react';
import { fetchCreneaux } from '../../api/fetchCreneaux';
import SlotPicker from '../../components/SlotPicker';

const Creneaux = ({ prestationId, date }) => {
  const [creneaux, setCreneaux] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCreneaux = async () => {
      try {
        const data = await fetchCreneaux(prestationId, date);
        setCreneaux(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (prestationId && date) loadCreneaux();
  }, [prestationId, date]);

  const handleSelectSlot = (slot) => {
    console.log('Créneau sélectionné:', slot);
    // Navigate to confirmation page
  };

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="creneaux-page">
      <h1>Sélectionnez un créneau</h1>
      <SlotPicker slots={creneaux} onSelectSlot={handleSelectSlot} />
    </div>
  );
};

export default Creneaux;
