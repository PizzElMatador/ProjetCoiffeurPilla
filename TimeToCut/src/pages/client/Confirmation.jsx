import { useState } from 'react';
import { bookCreneau } from '../../api/fetchCreneaux';

const Confirmation = ({ bookingData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState(null);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const result = await bookCreneau(bookingData.creneauId, {
        clientName: bookingData.clientName,
        clientEmail: bookingData.clientEmail,
        clientPhone: bookingData.clientPhone,
      });
      setConfirmationMessage('Réservation confirmée!');
      // Store confirmation number or redirect
    } catch (error) {
      setConfirmationMessage(`Erreur: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="confirmation-page">
      <h1>Confirmez votre réservation</h1>
      <div className="booking-summary">
        <p>Salon: {bookingData.salon}</p>
        <p>Prestation: {bookingData.prestation}</p>
        <p>Créneau: {bookingData.slot}</p>
        <p>Client: {bookingData.clientName}</p>
      </div>
      <button
        onClick={handleConfirm}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Traitement...' : 'Confirmer la réservation'}
      </button>
      {confirmationMessage && <p>{confirmationMessage}</p>}
    </div>
  );
};

export default Confirmation;
