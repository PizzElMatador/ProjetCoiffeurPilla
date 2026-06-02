import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const AdminProfil = () => {
  const { user, logout, token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/profil', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setIsEditing(false);
        // Update user context
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div className="admin-profil">
      <h1>Mon Profil</h1>
      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            placeholder="Nom"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <button type="submit">Sauvegarder</button>
          <button type="button" onClick={() => setIsEditing(false)}>Annuler</button>
        </form>
      ) : (
        <div>
          <p>Nom: {user?.name}</p>
          <p>Email: {user?.email}</p>
          <button onClick={() => setIsEditing(true)}>Modifier</button>
        </div>
      )}
      <button onClick={logout} className="logout-btn">Déconnexion</button>
    </div>
  );
};

export default AdminProfil;
