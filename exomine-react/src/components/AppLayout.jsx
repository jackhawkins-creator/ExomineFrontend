import React, { useState } from "react";
import Governors from "./Governors";
import Facilities from "./Facilities";
import Minerals from "./Minerals";
import Colonies from "./Colonies";
import Cart from "./Cart";
import { waitOneHour } from "../services/api";

const AppLayout = () => {
  const [governorId, setGovernorId] = useState(0);
  const [colonyId, setColonyId] = useState(0);
  const [facilityId, setFacilityId] = useState(0);
  const [mineralId, setMineralId] = useState(0);
  const [colonyTons, setColonyTons] = useState(0);
  const [facilityTons, setFacilityTons] = useState(0);
  const [colonyRefreshTrigger, setColonyRefreshTrigger] = useState(0);
  const [facilityRefreshTrigger, setFacilityRefreshTrigger] = useState(0);
  const [selectedCartQuantity, setSelectedCartQuantity] = useState(1);

  return (
    <>
      <h1>Solar System Marketplace</h1>
      <article className="choices">
        <Governors setGovernorId={setGovernorId} setColonyId={setColonyId} />
        <Facilities setFacilityId={setFacilityId} governorId={governorId} refreshTrigger={facilityRefreshTrigger} />
      </article>
      <Minerals
        facilityId={facilityId}
        setMineralId={setMineralId}
        refreshTrigger={facilityRefreshTrigger}
        setSelectedCartQuantity={setSelectedCartQuantity}
      />
      <Colonies colonyId={colonyId} refreshTrigger={colonyRefreshTrigger} />
      <Cart
        mineralId={mineralId}
        selectedQuantity={selectedCartQuantity}
        facilityId={facilityId}
        colonyId={colonyId}
        setColonyTons={setColonyTons}
        setFacilityTons={setFacilityTons}
        triggerColonyRefresh={() => setColonyRefreshTrigger(prev => prev + 1)}
        triggerFacilityRefresh={() => setFacilityRefreshTrigger(prev => prev + 1)}
      />
      <button onClick={() => {waitOneHour().then(() => {setFacilityRefreshTrigger(prev => prev + 1)})}}>Wait One Hour To Increase Facility Resources</button>
    </>
  );
};

export default AppLayout;
