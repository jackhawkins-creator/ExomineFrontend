import React, { useEffect, useState } from "react";
import { fetchFacilityById, fetchFacilityMinerals } from "../services/api";

const Minerals = ({ facilityId, setMineralId, refreshTrigger }) => {
  const [minerals, setMinerals] = useState([]);
  const [facilityName, setFacilityName] = useState("");
  const [active, setActive] = useState(false);

  useEffect(() => {
    const loadMinerals = async () => {
      if (facilityId === 0) {
        setMinerals([]);
        setFacilityName("");
        setActive(false);
        return;
      }

      const facility = await fetchFacilityById(facilityId);
      setFacilityName(facility.name);
      setActive(facility.active);

      if (facility.active) {
        const data = await fetchFacilityMinerals();
        const filtered = data.filter(m => m.facilityId === facilityId && m.facilityTons > 0);
        setMinerals(filtered);
      }
    };

    loadMinerals();
  }, [facilityId, refreshTrigger]);

  const handleChange = (event) => {
    const selectedId = parseInt(event.target.value);
    const tons = parseInt(event.target.dataset.amount);
    setMineralId(selectedId);
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
              <input
                type="radio"
                name="mineral"
                value={m.mineralId}
                data-amount={m.facilityTons}
                onChange={handleChange}
              />
              {m.facilityTons} tons of {m.mineral?.name || "FAILURE FAILURE FAILURE"}
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
