import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_CONFIG from '../../config/apiConfig';
import './AdminSalons.css';

const AdminSalons = () => {
  const navigate = useNavigate();

  const [salons, setSalons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSalon, setEditingSalon] = useState(null);

  const [formData, setFormData] = useState({
    nom: '',
    adresse: '',
    ville: '',
  });

  const user = JSON.parse(localStorage.getItem('adminData'));
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token || !user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }

    loadSalons();
  }, []);

  const loadSalons = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SALONS}`, {
        headers: {
          ...API_CONFIG.DEFAULT_OPTIONS.headers,
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du chargement des salons');
      }

      setSalons(data);
    } catch (error) {
      console.error(error);
      alert(error.message || 'Impossible de charger les salons');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const isEditing = Boolean(editingSalon);

      const url = isEditing
        ? `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SALONS}/${editingSalon.id_salon}`
        : `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SALONS}`;

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          ...API_CONFIG.DEFAULT_OPTIONS.headers,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l’enregistrement');
      }

      setFormData({
        nom: '',
        adresse: '',
        ville: '',
      });

      setEditingSalon(null);
      await loadSalons();

      alert(isEditing ? 'Salon modifié' : 'Salon ajouté');
    } catch (error) {
      console.error(error);
      alert(error.message || 'Erreur serveur');
    }
  };

  const handleEdit = (salon) => {
    setEditingSalon(salon);

    setFormData({
      nom: salon.nom || '',
      adresse: salon.adresse || '',
      ville: salon.ville || '',
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingSalon(null);

    setFormData({
      nom: '',
      adresse: '',
      ville: '',
    });
  };

  const handleDelete = async (idSalon) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce salon ?')) {
      return;
    }

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SALONS}/${idSalon}`,
        {
          method: 'DELETE',
          headers: {
            ...API_CONFIG.DEFAULT_OPTIONS.headers,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la suppression');
      }

      setSalons((prev) => prev.filter((salon) => salon.id_salon !== idSalon));
      alert('Salon supprimé');
    } catch (error) {
      console.error(error);
      alert(error.message || 'Impossible de supprimer ce salon');
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
    <div className="admin-salons">
      <header>
        <h1>Gestion des salons</h1>

        <div className="admin-actions">
          <button onClick={() => navigate('/admin/dashboard')}>
            Dashboard
          </button>

          <button onClick={() => navigate('/admin/reservations')}>
            Réservations
          </button>

          <button onClick={() => navigate('/admin/prestations')}>
            Prestations
          </button>

          <button onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </header>

      <form className="salon-form" onSubmit={handleSubmit}>
        <h2>{editingSalon ? 'Modifier le salon' : 'Ajouter un salon'}</h2>

        <input
          type="text"
          placeholder="Nom du salon"
          value={formData.nom}
          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Adresse"
          value={formData.adresse}
          onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Ville"
          value={formData.ville}
          onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
          required
        />

        <div className="form-actions">
          <button type="submit">
            {editingSalon ? 'Modifier' : 'Ajouter'}
          </button>

          {editingSalon && (
            <button type="button" className="btn-secondary" onClick={handleCancelEdit}>
              Annuler
            </button>
          )}
        </div>
      </form>

      {salons.length === 0 ? (
        <p className="empty-message">Aucun salon trouvé.</p>
      ) : (
        <div className="salons-grid">
          {salons.map((salon) => (
            <div key={salon.id_salon} className="salon-card">
              <div className="salon-icon">🏪</div>

              <h3>{salon.nom}</h3>

              <p>
                <strong>Adresse :</strong> {salon.adresse}
              </p>

              <p>
                <strong>Ville :</strong> {salon.ville}
              </p>

              <div className="card-actions">
                <button onClick={() => handleEdit(salon)}>
                  Modifier
                </button>

                <button className="btn-danger" onClick={() => handleDelete(salon.id_salon)}>
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSalons;