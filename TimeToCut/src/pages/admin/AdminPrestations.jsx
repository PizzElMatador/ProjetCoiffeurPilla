import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_CONFIG from '../../config/apiConfig';
import './AdminPrestations.css';

const AdminPrestations = () => {
  const navigate = useNavigate();

  const [prestations, setPrestations] = useState([]);
  const [salons, setSalons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPrestation, setEditingPrestation] = useState(null);

  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prix: '',
    duree: '',
    id_salon: '',
  });

  const user = JSON.parse(localStorage.getItem('adminData'));
  const token = localStorage.getItem('adminToken');

  const dashboardPath =
    user?.role === 'coiffeur' ? '/coiffeur/dashboard' : '/admin/dashboard';

  const reservationsPath =
    user?.role === 'coiffeur' ? '/coiffeur/reservations' : '/admin/reservations';

  const prestationsPath =
    user?.role === 'coiffeur' ? '/coiffeur/prestations' : '/admin/prestations';

  useEffect(() => {
    if (!token || !user) {
      navigate('/admin/login');
      return;
    }

    loadData();
  }, []);

  const loadData = async () => {
    try {
      let prestationsUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRESTATIONS}`;

      if (user.role === 'coiffeur') {
        prestationsUrl += `?salon=${user.id_salon}`;
      }

      const prestationsResponse = await fetch(prestationsUrl, {
        headers: {
          ...API_CONFIG.DEFAULT_OPTIONS.headers,
          Authorization: `Bearer ${token}`,
        },
      });

      const prestationsData = await prestationsResponse.json();

      if (!prestationsResponse.ok) {
        throw new Error(prestationsData.error || 'Erreur prestations');
      }

      setPrestations(prestationsData);

      if (user.role === 'admin') {
        const salonsResponse = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SALONS}`, {
          headers: {
            ...API_CONFIG.DEFAULT_OPTIONS.headers,
            Authorization: `Bearer ${token}`,
          },
        });

        const salonsData = await salonsResponse.json();

        if (!salonsResponse.ok) {
          throw new Error(salonsData.error || 'Erreur salons');
        }

        setSalons(salonsData);
      }

      if (user.role === 'coiffeur') {
        setFormData((prev) => ({
          ...prev,
          id_salon: user.id_salon,
        }));
      }
    } catch (error) {
      console.error(error);
      alert(error.message || 'Impossible de charger les données');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEditingPrestation(null);

    setFormData({
      nom: '',
      description: '',
      prix: '',
      duree: '',
      id_salon: user.role === 'coiffeur' ? user.id_salon : '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const isEditing = Boolean(editingPrestation);

      const payload = {
        nom: formData.nom,
        description: formData.description,
        prix: Number(formData.prix),
        duree: Number(formData.duree),
        id_salon: user.role === 'coiffeur' ? user.id_salon : Number(formData.id_salon),
      };

      const url = isEditing
        ? `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRESTATIONS}/${editingPrestation.id_prestation}`
        : `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRESTATIONS}`;

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          ...API_CONFIG.DEFAULT_OPTIONS.headers,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l’enregistrement');
      }

      await loadData();
      resetForm();

      alert(isEditing ? 'Prestation modifiée' : 'Prestation ajoutée');
    } catch (error) {
      console.error(error);
      alert(error.message || 'Erreur serveur');
    }
  };

  const handleEdit = (prestation) => {
    setEditingPrestation(prestation);

    setFormData({
      nom: prestation.nom || '',
      description: prestation.description || '',
      prix: prestation.prix || '',
      duree: prestation.duree || '',
      id_salon: prestation.id_salon || user.id_salon || '',
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (idPrestation) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette prestation ?')) {
      return;
    }

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRESTATIONS}/${idPrestation}`,
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

      setPrestations((prev) =>
        prev.filter((prestation) => prestation.id_prestation !== idPrestation)
      );

      alert('Prestation supprimée');
    } catch (error) {
      console.error(error);
      alert(error.message || 'Impossible de supprimer cette prestation');
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
    <div className="admin-prestations">
      <header>
        <h1>
          {user.role === 'admin'
            ? 'Gestion des prestations'
            : 'Prestations de mon salon'}
        </h1>

        <div className="admin-actions">
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

      <form className="prestation-form" onSubmit={handleSubmit}>
        <h2>{editingPrestation ? 'Modifier la prestation' : 'Ajouter une prestation'}</h2>

        <input
          type="text"
          placeholder="Nom de la prestation"
          value={formData.nom}
          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
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
          min="0"
          step="0.01"
          value={formData.prix}
          onChange={(e) => setFormData({ ...formData, prix: e.target.value })}
          required
        />

        <input
          type="number"
          placeholder="Durée en minutes"
          min="1"
          value={formData.duree}
          onChange={(e) => setFormData({ ...formData, duree: e.target.value })}
          required
        />

        {user.role === 'admin' && (
          <select
            value={formData.id_salon}
            onChange={(e) => setFormData({ ...formData, id_salon: e.target.value })}
            required
          >
            <option value="">Choisir un salon</option>
            {salons.map((salon) => (
              <option key={salon.id_salon} value={salon.id_salon}>
                {salon.nom} - {salon.ville}
              </option>
            ))}
          </select>
        )}

        <div className="form-actions">
          <button type="submit">
            {editingPrestation ? 'Modifier' : 'Ajouter'}
          </button>

          {editingPrestation && (
            <button type="button" className="btn-secondary" onClick={resetForm}>
              Annuler
            </button>
          )}
        </div>
      </form>

      {prestations.length === 0 ? (
        <p className="empty-message">Aucune prestation trouvée.</p>
      ) : (
        <div className="prestations-table-card">
          <table className="prestations-table">
            <thead>
              <tr>
                <th>Prestation</th>
                <th>Description</th>
                <th>Prix</th>
                <th>Durée</th>
                <th>Salon</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {prestations.map((prestation) => (
                <tr key={prestation.id_prestation}>
                  <td className="prestation-name">{prestation.nom}</td>
                  <td>{prestation.description}</td>
                  <td>
                    <span className="badge-price">{prestation.prix}€</span>
                  </td>
                  <td>
                    <span className="badge-duration">{prestation.duree} min</span>
                  </td>
                  <td>{prestation.salon || '—'}</td>
                  <td>
                    <div className="table-actions">
                      <button onClick={() => handleEdit(prestation)}>
                        Modifier
                      </button>

                      <button
                        className="btn-danger"
                        onClick={() => handleDelete(prestation.id_prestation)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPrestations;