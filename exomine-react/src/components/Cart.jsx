import React, { useEffect, useState } from "react";
import {
  fetchMineralById,
  fetchFacilityById,
  fetchColonyMinerals,
  fetchFacilityMinerals,
  putColonyMineral,
  postColonyMineral,
  patchFacilityMineral,
} from "../services/api";

const Cart = ({
  mineralId,
  facilityId,
  colonyId,
  setColonyTons,
  setFacilityTons,
  triggerColonyRefresh,
  triggerFacilityRefresh
}) => {
  const [mineralName, setMineralName] = useState("");
  const [facilityName, setFacilityName] = useState("");
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (mineralId && facilityId) {
      setDisabled(false);
      fetchMineralById(mineralId).then((data) => setMineralName(data.name));
      fetchFacilityById(facilityId).then((data) => setFacilityName(data.name));
    } else {
      setDisabled(true);
    }
  }, [mineralId, facilityId]);

  const handlePurchase = async () => {
    const colonyItems = await fetchColonyMinerals();
    const facilityItems = await fetchFacilityMinerals();

    const colonyMineralEntry = colonyItems.find(
      (entry) => entry.colonyId === colonyId && entry.mineralId === mineralId
    );
    let updatedColonyTons = colonyMineralEntry
      ? colonyMineralEntry.colonyTons + 1
      : 1;

    if (colonyMineralEntry) {
      await putColonyMineral(colonyMineralEntry.id, {
        colonyId,
        mineralId,
        colonyTons: updatedColonyTons,
      });
    } else {
      await postColonyMineral({
        colonyId,
        mineralId,
        colonyTons: updatedColonyTons,
      });
    }

    const facilityMineralEntry = facilityItems.find(
      (entry) =>
        entry.facilityId === facilityId && entry.mineralId === mineralId
    );
    const updatedFacilityTons = facilityMineralEntry.facilityTons - 1;

    await patchFacilityMineral(facilityMineralEntry.id, {
      facilityTons: updatedFacilityTons,
    });

    setColonyTons(updatedColonyTons);
    setFacilityTons(updatedFacilityTons);

    triggerColonyRefresh();
    triggerFacilityRefresh();
  };

  return (
    <article className="cart">
      <section className="spaceCart">
        <h2>Space Cart</h2>
        {!disabled && (
          <p>
            1 ton of <strong>{mineralName}</strong> from{" "}
            <strong>{facilityName}</strong>
          </p>
        )}
        <button disabled={disabled} onClick={handlePurchase}>
          Purchase Mineral
        </button>
      </section>
    </article>
  );
};

export default Cart;
