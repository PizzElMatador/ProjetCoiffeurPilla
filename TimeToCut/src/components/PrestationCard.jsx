const PrestationCard = ({ prestation, onClick }) => {
  return (
    <div className="prestation-card" onClick={onClick} role="button" tabIndex={0}>
      <h4>{prestation.name}</h4>
      <p>{prestation.description}</p>
      <div className="prestation-footer">
        <span className="price">${prestation.price}</span>
        <span className="duration">{prestation.duration} min</span>
      </div>
    </div>
  );
};

export default PrestationCard;
