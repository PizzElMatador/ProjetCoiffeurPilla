// Fetch available time slots for a prestation
export const fetchCreneaux = async (prestationId, date) => {
  try {
    const response = await fetch(`/api/prestations/${prestationId}/creneaux?date=${date}`);
    if (!response.ok) throw new Error('Créneau non trouvés');
    return await response.json();
  } catch (error) {
    console.error('Erreur fetchCreneaux:', error);
    throw error;
  }
};

// Book a time slot
export const bookCreneau = async (creneauId, clientData) => {
  try {
    const response = await fetch(`/api/creneaux/${creneauId}/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clientData),
    });
    if (!response.ok) throw new Error('Erreur lors de la réservation');
    return await response.json();
  } catch (error) {
    console.error('Erreur bookCreneau:', error);
    throw error;
  }
};
