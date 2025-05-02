import React, { useEffect, useState } from "react";
import { fetchColonyMinerals, fetchGovernors, fetchColonies } from "../services/api"; 

const Colonies = ({ colonyId, refreshTrigger }) => {
  const [colonyName, setColonyName] = useState("");
  const [colonyCurrency, setColonyCurrency] = useState(0);
  const [minerals, setMinerals] = useState([]);



  useEffect(() => {
    const loadColonyData = async () => {
      if (!colonyId) {
        setColonyName("");
        setColonyCurrency(0); // Reset currency when no colony is selected
        setMinerals([]);
        return;
      }

      // Fetch the governor to get colony name and currency
      const governors = await fetchGovernors();
      const governor = governors.find((g) => g.colonyId === colonyId);
      if (!governor) {
        setColonyName("");
        setColonyCurrency(0);
        setMinerals([]);
        return;
      }


      const colonyResponse = await fetch(`http://localhost:5223/api/governors/${governor.id}`);
      const governorData = await colonyResponse.json();

      if (governorData?.colonies?.length > 0) {
        const colony = governorData.colonies[0];
        setColonyName(colony.name);
        const parsedCurrency = parseFloat(colony.currency);
       
        setColonyCurrency(parsedCurrency); // Set the currency state
      } else {
         setColonyName("");
         setColonyCurrency(0);
      }

      // Fetch minerals for this colony
      const res = await fetch(
        `http://localhost:5223/api/colonyMinerals?colonyId=${colonyId}&expand=mineral`
      );
      const data = await res.json();
      setMinerals(data);
    };

    loadColonyData();
  }, [colonyId, refreshTrigger]); // Depend on colonyId and refreshTrigger

  if (!colonyId || !colonyName) {
    return <h2>Colony Minerals</h2>;
  }

  return (
    <section className="colony-info">
      <h2>{colonyName} Minerals</h2>
      <p>Currency: {colonyCurrency}</p> 
      {minerals.length === 0  ? (
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
