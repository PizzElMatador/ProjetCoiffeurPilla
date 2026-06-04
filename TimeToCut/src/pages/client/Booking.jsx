import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutClient } from '../../api/authAPI';
import API_CONFIG from '../../config/apiConfig';
import './Booking.css';

const Booking = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [user, setUser] = useState(null);

  const [salons, setSalons] = useState([]);
  const [services, setServices] = useState([]);
  const [occupiedSlots, setOccupiedSlots] = useState([]);

  const [loadingSalons, setLoadingSalons] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);
  const [sending, setSending] = useState(false);

  const [booking, setBooking] = useState({
    salon: null,
    service: null,
    date: '',
    time: '',
  });

  const timeSlots = [
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
  ];

  useEffect(() => {
    const token = localStorage.getItem('clientToken');
    const userData = localStorage.getItem('clientData');

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchSalons();
  }, [navigate]);

  useEffect(() => {
    if (!booking.date || !booking.service) return;

    fetchOccupiedSlots(booking.date, booking.service.id_prestation);
  }, [booking.date, booking.service]);

  const fetchSalons = async () => {
    try {
      setLoadingSalons(true);

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SALONS}`);

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des salons');
      }

      const data = await response.json();
      setSalons(data);
    } catch (error) {
      console.error(error);
      alert('Impossible de charger les salons');
    } finally {
      setLoadingSalons(false);
    }
  };

  const fetchPrestationsBySalon = async (idSalon) => {
    try {
      setLoadingServices(true);

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRESTATIONS_BY_SALON}${idSalon}`
      );

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des prestations');
      }

      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error(error);
      alert('Impossible de charger les prestations');
    } finally {
      setLoadingServices(false);
    }
  };

  const fetchOccupiedSlots = async (date, idPrestation) => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RESERVATIONS}/occupied?date=${date}&id_prestation=${idPrestation}`
    );

    if (!response.ok) {
      throw new Error('Erreur lors du chargement des créneaux occupés');
    }

    const data = await response.json();

    const formattedSlots = data.map((slot) => {
      if (typeof slot === 'string') {
        return slot.substring(0, 5);
      }

      if (slot.heure_reservation) {
        return slot.heure_reservation.substring(0, 5);
      }

      if (slot.heure) {
        return slot.heure.substring(0, 5);
      }

      return String(slot).substring(0, 5);
    });

    setOccupiedSlots(formattedSlots);
  } catch (error) {
    console.error(error);
    setOccupiedSlots([]);
  }
};

  const handleSelectSalon = (salon) => {
    setBooking({
      ...booking,
      salon,
      service: null,
      date: '',
      time: '',
    });

    setServices([]);
    setOccupiedSlots([]);
    fetchPrestationsBySalon(salon.id_salon);
  };

  const handleLogout = async () => {
    try {
      await logoutClient();
    } catch (error) {
      console.error('Erreur:', error);
    }

    localStorage.clear();
    navigate('/login', { replace: true });
  };

  const handleNext = () => {
    if (step === 1 && booking.salon) {
      setStep(2);
      return;
    }

    if (step === 2 && booking.service) {
      setStep(3);
      return;
    }

    if (step === 3 && booking.date && booking.time) {
      setStep(4);
      return;
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleConfirm = async () => {
    try {
      if (!user || !booking.service || !booking.date || !booking.time) {
        alert('Informations de réservation incomplètes');
        return;
      }

      if (occupiedSlots.includes(booking.time)) {
        alert('Ce créneau vient déjà d’être réservé. Veuillez en choisir un autre.');
        setBooking({
          ...booking,
          time: '',
        });

        await fetchOccupiedSlots(booking.date, booking.service.id_prestation);
        setStep(3);
        return;
      }

      setSending(true);

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RESERVATIONS}`, {
        method: 'POST',
        headers: API_CONFIG.DEFAULT_OPTIONS.headers,
        body: JSON.stringify({
          id_client: user.id_client,
          id_prestation: booking.service.id_prestation,
          date_reservation: booking.date,
          heure_reservation: `${booking.time}:00`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la réservation');
      }

      alert('Réservation confirmée !');
      navigate('/confirmation');
    } catch (error) {
      console.error(error);
      alert(error.message || 'Erreur serveur');
    } finally {
      setSending(false);
    }
  };

  const availableSlots = timeSlots.filter((time) => !occupiedSlots.includes(time));

  return (
    <div className="booking-container">
      <header className="booking-header">
        <h1>Time To Cut</h1>

        <div className="user-menu">
  <button onClick={() => navigate('/')} className="nav-link-btn">
    🏠 Accueil
  </button>

  <button onClick={() => navigate('/booking')} className="nav-link-btn">
    Réserver
  </button>

  <button onClick={() => navigate('/mes-reservations')} className="nav-link-btn">
    Mes réservations
  </button>

  <span>{user?.prenom}</span>

  <button onClick={handleLogout} className="logout-link">
    Déconnexion
  </button>
</div>
      </header>

      <div className="booking-wrapper">
        <div className="progress-bar">
          <div className="progress-item" style={{ opacity: step >= 1 ? 1 : 0.3 }}>
            <div className="progress-dot">1</div>
            <span>Salon</span>
          </div>

          <div className="progress-line" style={{ opacity: step >= 2 ? 1 : 0.3 }} />

          <div className="progress-item" style={{ opacity: step >= 2 ? 1 : 0.3 }}>
            <div className="progress-dot">2</div>
            <span>Service</span>
          </div>

          <div className="progress-line" style={{ opacity: step >= 3 ? 1 : 0.3 }} />

          <div className="progress-item" style={{ opacity: step >= 3 ? 1 : 0.3 }}>
            <div className="progress-dot">3</div>
            <span>Créneau</span>
          </div>

          <div className="progress-line" style={{ opacity: step >= 4 ? 1 : 0.3 }} />

          <div className="progress-item" style={{ opacity: step >= 4 ? 1 : 0.3 }}>
            <div className="progress-dot">4</div>
            <span>Confirmation</span>
          </div>
        </div>

        {step === 1 && (
          <div className="step-content">
            <h2>Sélectionnez un salon</h2>

            {loadingSalons ? (
              <p>Chargement des salons...</p>
            ) : (
              <div className="options-grid">
                {salons.map((salon) => (
                  <div
                    key={salon.id_salon}
                    className={`option-card ${
                      booking.salon?.id_salon === salon.id_salon ? 'selected' : ''
                    }`}
                    onClick={() => handleSelectSalon(salon)}
                  >
                    <div className="option-icon">🏪</div>
                    <div className="option-name">{salon.nom}</div>
                    <div className="option-desc">
                      {salon.adresse} - {salon.ville}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="step-content">
            <h2>Choisissez un service</h2>

            {loadingServices ? (
              <p>Chargement des prestations...</p>
            ) : services.length === 0 ? (
              <p>Aucune prestation disponible pour ce salon.</p>
            ) : (
              <div className="services-list">
                {services.map((service) => (
                  <div
                    key={service.id_prestation}
                    className={`service-card ${
                      booking.service?.id_prestation === service.id_prestation ? 'selected' : ''
                    }`}
                    onClick={() =>
                      setBooking({
                        ...booking,
                        service,
                        date: '',
                        time: '',
                      })
                    }
                  >
                    <div className="service-info">
                      <div className="service-name">{service.nom}</div>
                      <div className="service-time">⏱️ {service.duree} min</div>
                    </div>

                    <div className="service-price">{service.prix}€</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="step-content">
            <h2>Sélectionnez une date et une heure</h2>

            <div className="datetime-section">
              <div className="date-input-wrapper">
                <label>Date :</label>
                <input
                  type="date"
                  value={booking.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) =>
                    setBooking({
                      ...booking,
                      date: e.target.value,
                      time: '',
                    })
                  }
                  className="date-input"
                />
              </div>

              {booking.date && (
                <div className="times-grid">
                  <label>Créneaux disponibles :</label>

                  <div className="times-list">
                    {availableSlots.length > 0 ? (
                      availableSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          className={`time-slot ${booking.time === time ? 'selected' : ''}`}
                          onClick={() => setBooking({ ...booking, time })}
                        >
                          {time}
                        </button>
                      ))
                    ) : (
                      <p>Aucun créneau disponible pour cette date.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="step-content">
            <h2>Vérifiez votre réservation</h2>

            <div className="summary-card">
              <div className="summary-item">
                <span className="label">Salon :</span>
                <span className="value">{booking.salon?.nom}</span>
              </div>

              <div className="summary-item">
                <span className="label">Adresse :</span>
                <span className="value">
                  {booking.salon?.adresse} - {booking.salon?.ville}
                </span>
              </div>

              <div className="summary-item">
                <span className="label">Service :</span>
                <span className="value">{booking.service?.nom}</span>
              </div>

              <div className="summary-item">
                <span className="label">Date :</span>
                <span className="value">{booking.date}</span>
              </div>

              <div className="summary-item">
                <span className="label">Heure :</span>
                <span className="value">{booking.time}</span>
              </div>

              <div className="summary-item price">
                <span className="label">Total :</span>
                <span className="value">{booking.service?.prix}€</span>
              </div>
            </div>
          </div>
        )}

        <div className="button-group">
          <button
            onClick={handlePrev}
            disabled={step === 1}
            className="btn btn-secondary"
          >
            Précédent
          </button>

          {step === 4 ? (
            <button
              onClick={handleConfirm}
              disabled={sending}
              className="btn btn-primary btn-confirm"
            >
              {sending ? 'Envoi...' : 'Confirmer la réservation'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={
                (step === 1 && !booking.salon) ||
                (step === 2 && !booking.service) ||
                (step === 3 && (!booking.date || !booking.time))
              }
              className="btn btn-primary"
            >
              Suivant
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Booking;