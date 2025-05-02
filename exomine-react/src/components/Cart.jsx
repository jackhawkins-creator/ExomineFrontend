import React, { useEffect, useState } from "react";
import {
  fetchMineralById,
  fetchColonyMinerals,
  fetchFacilityMinerals,
  putColonyMineral,
  postColonyMineral,
  patchFacilityMineral,
  updateColony,
  updateFacility,
  fetchColonyById,
  fetchFacilityById
} from "../services/api";

const Cart = ({
  mineralId,
  facilityId,
  colonyId,
  setColonyTons,
  setFacilityTons,
  triggerColonyRefresh,
  triggerFacilityRefresh,
  selectedQuantity
}) => {
  const [mineralName, setMineralName] = useState("");
  const [facilityName, setFacilityName] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [bodyGuards, setBodyGuards] = useState(false)

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
      ? colonyMineralEntry.colonyTons + selectedQuantity
      : selectedQuantity;


    const facilityMineralEntry = facilityItems.find(
      (entry) => entry.facilityId === facilityId && entry.mineralId === mineralId
    );

    if (!facilityMineralEntry) {
      alert("Mineral not available at this facility.");
      return;
    }

    const mineralPrice = parseFloat(facilityMineralEntry.mineralPrice);
    let totalPrice = mineralPrice * selectedQuantity;
    totalPrice = bodyGuards ? totalPrice + 15 : totalPrice

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

    const updatedFacilityTons = facilityMineralEntry.facilityTons - selectedQuantity;

    await patchFacilityMineral(facilityMineralEntry.id, {
      facilityTons: updatedFacilityTons,
    });

    setColonyTons(updatedColonyTons);
    setFacilityTons(updatedFacilityTons);



    const colony = await fetchColonyById(colonyId);
    const facility = await fetchFacilityById(facilityId);

    const updatedFacilityCurrency = parseFloat(facility.currency) + parseFloat(totalPrice)
    await updateFacility(facilityId, { ...facility, currency: updatedFacilityCurrency });

    const updatedColonyCurrency = parseFloat(colony.currency) - parseFloat(totalPrice);
    await updateColony(colonyId, { ...colony, currency: updatedColonyCurrency });

    triggerFacilityRefresh();
    triggerColonyRefresh();
    setBodyGuards(false)
  };

  const pirates = async () => {
    alert("PIRATES!!!!!")

    const facilityItems = await fetchFacilityMinerals();

    const facilityMineralEntry = facilityItems.find(
      (entry) => entry.facilityId === facilityId && entry.mineralId === mineralId
    );

    const mineralPrice = parseFloat(facilityMineralEntry.mineralPrice);
    const totalPrice = mineralPrice * selectedQuantity;

    const updatedFacilityTons = facilityMineralEntry.facilityTons - selectedQuantity;

    await patchFacilityMineral(facilityMineralEntry.id, {
      facilityTons: updatedFacilityTons,
    });

    setFacilityTons(updatedFacilityTons);

    const colony = await fetchColonyById(colonyId);
    const facility = await fetchFacilityById(facilityId);

    const updatedFacilityCurrency = parseFloat(facility.currency) + parseFloat(totalPrice)
    await updateFacility(facilityId, { ...facility, currency: updatedFacilityCurrency });

    const updatedColonyCurrency = parseFloat(colony.currency) - parseFloat(totalPrice);
    await updateColony(colonyId, { ...colony, currency: updatedColonyCurrency });

    triggerFacilityRefresh();
    triggerColonyRefresh();
  }

  return (
    <article className="cart">
      <section className="spaceCart">
        <h2>Space Cart</h2>
        {!disabled && (
          <p>
            {selectedQuantity} ton of <strong>{mineralName}</strong> from{" "}
            <strong>{facilityName}</strong>
          </p>
        )}
        <button disabled={disabled} onClick={() => { bodyGuards ? handlePurchase() : ((Math.floor(Math.random() * 3) + 1) == 1 ? handlePurchase() : pirates())}}>
          Purchase Mineral
        </button>
        <button onClick={() => {setBodyGuards(!bodyGuards)}}>Hired Body Guards: {bodyGuards ? "True +15 additional credits on purchase" : "False"} </button>
      </section>
    </article>
  );
};

export default Cart;
