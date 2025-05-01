import React, { useEffect, useState } from "react";
import { fetchColonyMinerals, fetchGovernors, fetchColonies } from "../services/api"; // fetchColonies might not be strictly necessary here but keep it for now

const Colonies = ({ colonyId, refreshTrigger }) => {
  const [colonyName, setColonyName] = useState("");
  const [colonyCurrency, setColonyCurrency] = useState(0); // Add state for currency
  const [minerals, setMinerals] = useState([]);
  // const [colonies, setColonies] = useState([]) // This state is not used in the current rendering

  useEffect(() => {
   
  }, []);


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

      // Fetch the specific governor data which includes the colony expansion
      // This is slightly inefficient if you only need the colony, but matches the current API usage pattern.
      // A direct fetch to /api/colonies/{colonyId} could also work if that endpoint is available and includes currency.
      // Based on the provided API code, /api/colonies/{id} *does* return currency, which would be more direct.
      // Let's use the existing governor fetch as it's what's currently implemented to get the colony name.
      const colonyResponse = await fetch(`http://localhost:5223/api/governors/${governor.id}`);
      const governorData = await colonyResponse.json();

      if (governorData?.colonies?.length > 0) {
        const colony = governorData.colonies[0];
        setColonyName(colony.name);
        setColonyCurrency(colony.currency); // Set the currency state
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
      <p>Currency: {colonyCurrency}</p> {/* Display the colony currency */}
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