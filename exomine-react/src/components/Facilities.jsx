import React, { useEffect, useState } from "react";
import { fetchFacilities } from "../services/api";

const Facilities = ({ setFacilityId, governorId, refreshTrigger }) => {
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    fetchFacilities()
      .then((data) => {
        const filtered = data.filter(f => f.active);
        
        setFacilities(filtered);
      })
      .catch((error) =>
        console.error("Error fetching facilities data:", error)
      );
  }, [refreshTrigger]);

  useEffect(() => {
    setEnabled(governorId !== 0);
  }, [governorId]);

  const handleChange = (event) => {
    const selectedId = parseInt(event.target.value);
    setFacilityId(selectedId);

  const facility = facilities.find(f => f.id === selectedId)
  setSelectedFacility(facility)
  };

  useEffect(() => {
    if (selectedFacility) {
      const updatedFacility = facilities.find(f => f.id === selectedFacility.id);
      setSelectedFacility(updatedFacility || null);
    }
  }, [facilities, selectedFacility]);

  return (
    <div id="facilities-container">
      <label htmlFor="facility-select"><strong>Facilities</strong></label>
      <select
        id="facility-select"
        disabled={!enabled}
        onChange={handleChange}
        defaultValue="0"
      >
        <option value="0">Choose A Facility:</option>
        {facilities.map((facility) => (
          <option key={facility.id} value={facility.id}>
            {facility.name}
          </option>
        ))}
        
      </select>

      {selectedFacility && (
        <div className="facility-balance">
          <p>Facility Balance: {selectedFacility.currency}</p>
        </div>
      )}
      </div>
  );
};

export default Facilities;
