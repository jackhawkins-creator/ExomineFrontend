import React, { useEffect, useState } from "react";
import { fetchFacilities } from "../services/api";

const Facilities = ({ setFacilityId, governorId }) => {
  const [facilities, setFacilities] = useState([]);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    fetchFacilities()
      .then((data) => setFacilities(data.filter(f => f.active)))
      .catch((error) =>
        console.error("Error fetching facilities data:", error)
      );
  }, []);

  useEffect(() => {
    setEnabled(governorId !== 0);
  }, [governorId]);

  const handleChange = (event) => {
    const selectedId = parseInt(event.target.value);
    setFacilityId(selectedId);
  };

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
    </div>
  );
};

export default Facilities;
