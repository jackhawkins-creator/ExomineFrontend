import React, { useEffect, useState } from "react";
import { fetchColonyMinerals, fetchGovernors } from "../services/api";

const Colonies = ({ colonyId, refreshTrigger }) => {
  const [colonyName, setColonyName] = useState("");
  const [minerals, setMinerals] = useState([]);

  useEffect(() => {
    const loadColonyData = async () => {
      if (!colonyId) {
        setColonyName("");
        setMinerals([]);
        return;
      }

      // Fetch the governor to get colony name
      const governors = await fetchGovernors();
      const governor = governors.find((g) => g.colonyId === colonyId);
      if (!governor) return;

      const colonyResponse = await fetch(`http://localhost:5223/api/governors/${governor.id}`);
      const governorData = await colonyResponse.json();

      if (governorData?.colonies?.length > 0) {
        setColonyName(governorData.colonies[0].name);
      }

      // Fetch minerals for this colony
      const res = await fetch(
        `http://localhost:5223/api/colonyMinerals?colonyId=${colonyId}&expand=mineral`
      );
      const data = await res.json();
      setMinerals(data);
    };

    loadColonyData();
  }, [colonyId, refreshTrigger]);

  if (!colonyId || !colonyName) {
    return <h2>Colony Minerals</h2>;
  }

  return (
    <section className="colony-info">
      <h2>{colonyName} Minerals</h2>
      {minerals.length === 0 ? (
        <p>No minerals available</p>
      ) : (
        minerals.map((mineral) => (
          <p key={mineral.id}>
            {mineral.mineral.name}: {mineral.colonyTons} tons
          </p>
        ))
      )}
    </section>
  );
};

export default Colonies;
