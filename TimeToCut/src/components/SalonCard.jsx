const SalonCard = ({ salon, onClick, clickable = true }) => {
  return (
    <div className="salon-card" onClick={clickable ? onClick : undefined} role={clickable ? "button" : undefined} tabIndex={clickable ? 0 : -1} style={{ cursor: clickable ? 'pointer' : 'default' }}>
      <div className="salon-card-icon">🏪</div>
      <h3>{salon.nom}</h3>
      <p className="address">{salon.adresse}</p>
      <p className="city">{salon.ville}</p>
      {salon.telephone && <p className="phone">📞 {salon.telephone}</p>}
      {salon.email && <p className="email">✉️ {salon.email}</p>}
      {salon.description && <p className="description">{salon.description}</p>}
    </div>
  );
};

export default SalonCard;
