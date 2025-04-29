import React, { useEffect, useState } from "react";
import { fetchGovernors } from "../services/api";

const Governors = ({ setGovernorId, setColonyId }) => {
  const [governors, setGovernors] = useState([]);

  useEffect(() => {
    fetchGovernors()
      .then(data => setGovernors(data.filter(g => g.active)))
      .catch(error => console.error("Failed to fetch governors", error));
  }, []);

  const handleChange = (e) => {
    const selectedOption = e.target.selectedOptions[0];
    const governorId = parseInt(e.target.value);
    const colonyId = parseInt(selectedOption.getAttribute("colonyid"));

    setGovernorId(governorId);
    setColonyId(colonyId);
  };

  return (
    <div id="governor-container">
      <label htmlFor="governor-select"><strong>Governors</strong></label>
      <select id="governor-select" onChange={handleChange} defaultValue="0">
        <option value="0">Choose A Governor:</option>
        {governors.map(g => (
          <option
            key={g.id}
            value={g.id}
            colonyid={g.colonyId}
          >
            {g.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Governors;
