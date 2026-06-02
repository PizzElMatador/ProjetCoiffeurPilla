import { useState, useEffect } from 'react';
import { fetchPrestations, createPrestation } from '../../api/fetchPrestations';
import { useAuth } from '../../context/AuthContext';

const AdminPrestations = () => {
  const [prestations, setPrestations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
  });

  useEffect(() => {
    const loadPrestations = async () => {
      try {
        const data = await fetchPrestations();
        setPrestations(data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPrestations();
  }, []);

  const handleAddPrestation = async (e) => {
    e.preventDefault();
    try {
      const newPrestation = await createPrestation(token, formData);
      setPrestations([...prestations, newPrestation]);
      setFormData({ name: '', description: '', price: '', duration: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="admin-prestations">
      <h1>Gestion des Prestations</h1>
      <button onClick={() => setShowForm(!showForm)}>Ajouter une prestation</button>

      {showForm && (
        <form onSubmit={handleAddPrestation}>
          <input
            type="text"
            placeholder="Nom"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Prix"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Durée (minutes)"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            required
          />
          <button type="submit">Créer</button>
        </form>
      )}

      <div className="prestations-list">
        {prestations.map((prestation) => (
          <div key={prestation.id} className="prestation-item">
            <h3>{prestation.name}</h3>
            <p>{prestation.description}</p>
            <p>Prix: ${prestation.price}</p>
            <p>Durée: {prestation.duration} min</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPrestations;
