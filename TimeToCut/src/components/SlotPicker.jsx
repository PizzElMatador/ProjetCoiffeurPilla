import { useState } from 'react';

const SlotPicker = ({ slots, onSelectSlot }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleSelect = (slot) => {
    setSelectedSlot(slot);
    onSelectSlot(slot);
  };

  return (
    <div className="slot-picker">
      <h3>Sélectionnez un créneau</h3>
      <div className="slots-grid">
        {slots.map((slot) => (
          <button
            key={slot.id}
            className={`slot ${selectedSlot?.id === slot.id ? 'selected' : ''}`}
            onClick={() => handleSelect(slot)}
            disabled={!slot.available}
          >
            {slot.time}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SlotPicker;
