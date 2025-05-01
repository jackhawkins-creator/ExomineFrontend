import React, { useEffect, useState } from "react";
import { fetchFacilityById, fetchFacilityMinerals } from "../services/api";

const Minerals = ({ facilityId, setMineralId, refreshTrigger, setSelectedCartQuantity }) => {
  const [minerals, setMinerals] = useState([]);
  const [facilityName, setFacilityName] = useState("");
  const [selectedMineral, setSelectedMineral] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const loadMinerals = async () => {
      if (facilityId === 0) {
        setMinerals([]);
        setFacilityName("");
        setActive(false);
        setSelectedMineral(null);
        return;
      }

      const facility = await fetchFacilityById(facilityId);
      setFacilityName(facility.name);
      setActive(facility.active);

      if (facility.active) {
        const data = await fetchFacilityMinerals();
        const filtered = data.filter(m => m.facilityId === facilityId && m.facilityTons > 0);
        setMinerals(filtered);
        setSelectedMineral(null);

      }
    };

    loadMinerals();
  }, [facilityId, refreshTrigger]);

  const handleChange = (event) => {
    const selectedId = parseInt(event.target.value);
   
    const mineral = minerals.find(m => m.mineralId === selectedId);
    
    if (mineral) {
      setSelectedMineral(mineral);
      setMineralId(selectedId);
      setSelectedQuantity(1)
    };

    
  };
  const handleQuantityChange = (event) => {
    const quantity = parseInt(event.target.value);
    setSelectedQuantity(quantity);
    setSelectedCartQuantity(quantity);
  };


  
  if (!facilityId) return <h2>Facility Minerals</h2>;

  
  return (
    <section id="minerals-container">
      <h2>Facility Minerals for {facilityName}</h2>
    
      {active ? (
        minerals.length === 0 ? (
          <p>No minerals available</p>
        ) : (
          minerals.map((m) => (
            <div key={m.id}>
              <select 
                  id="mineral-select" 
                  onChange={handleChange}
                  value={selectedMineral ? selectedMineral.mineralId : "0"}
                >
                  <option value="0">Choose a mineral</option>
                  {minerals.map((m) => (
                    <option key={m.id} value={m.mineralId}>
                      {m.mineral?.name || "Unknown"} ({m.facilityTons} tons available)
                    </option>
                  ))}
                </select>

                {selectedMineral && (
                <div className="quantity-dropdown">
                  <label htmlFor="quantity-select">Quantity:</label>
                  <select 
                    id="quantity-select" 
                    onChange={handleQuantityChange} 
                    value={selectedQuantity}
                  >
                  {(() => {
                 
                  const numberOfOptions = Math.min(10, selectedMineral.facilityTons);
                  const optionElements = [];
                  for (let i = 1; i <= numberOfOptions; i++) {
                  optionElements.push(
                  <option key={i} value={i}>
                  {i}
                  </option>
                   );
                  }
                  return optionElements;
                  })()}
                  </select>
                </div>
              )}
                  {selectedMineral && (
              <div className="mineral-details">
                <p>
                  <strong>Selected:</strong> {selectedQuantity} {selectedQuantity === 1 ? "ton" : "tons"} of {selectedMineral.mineral?.name}
                </p>
                <p className="mineral-price">
                  <strong>Price:</strong> {selectedMineral.mineralPrice} per ton 
                  (Total: {selectedMineral.mineralPrice * selectedQuantity})
                </p>
                <p>
                  <strong>Available:</strong> {selectedMineral.facilityTons} tons
                </p>
              </div>
            )}
            </div>
          ))
        )
      ) : (
        <p>This facility is not active</p>
      )}
    </section>
  );
};

export default Minerals;
