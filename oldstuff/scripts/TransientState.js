export const state = {
    "governorId": 0,
    "colonyId": 0,
    "facilityId": 0,
    "mineralId": 0,
    "facilityTons": 0,
    "colonyTons": 0
}

export const setFacility = (updatedFacilityId) => {
    state.facilityId = updatedFacilityId
    state.mineralId = 0
    document.dispatchEvent(new CustomEvent("stateChanged"))
}
export const setGovernor = (updatedGovernorsId) => {
    state.governorId = updatedGovernorsId
    document.dispatchEvent(new CustomEvent("stateChanged"))
}
export const setColony = (updatedColonyId) => {
    state.colonyId = updatedColonyId
    document.dispatchEvent(new CustomEvent("stateChanged"))
}

export const setMineral = (updatedMineralId) => {
    state.mineralId = updatedMineralId
    document.dispatchEvent(new CustomEvent("stateChanged"))
}
export const facilityAmount = (updatedMineralAmount) => {
    state.facilityTons = updatedMineralAmount
    document.dispatchEvent(new CustomEvent("stateChanged"))
}

export const colonyTons = (colonyAmount) => {
    state.colonyTons = colonyAmount
    document.dispatchEvent(new CustomEvent("stateChanged"))
}

export const purchaseMineral = async () => {
    const facilityId = state.facilityId;
    const colonyId = state.colonyId;
    const mineralId = state.mineralId;

    const colonyItemsResponse = await fetch(`http://localhost:5223/api/colonyMinerals`);
    const facilityItemsResponse = await fetch(`http://localhost:5223/api/facilityMinerals`);
    const colonyItems = await colonyItemsResponse.json();
    const facilityItems = await facilityItemsResponse.json();
   
    const colonyMineralEntry = colonyItems.find(entry => entry.colonyId === colonyId && entry.mineralId === mineralId)
    let updatedColonyTons = colonyMineralEntry ? colonyMineralEntry.colonyTons + 1 : 1;
    if (colonyMineralEntry) {
        await fetch(`http://localhost:5223/api/colonyMinerals/${colonyMineralEntry.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "colonyId": colonyId,
                "mineralId": mineralId,
                "colonyTons": updatedColonyTons
            })
        });
    } else {
        await fetch(`http://localhost:5223/api/colonyMinerals`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "colonyId": colonyId,
                "mineralId": mineralId,
                "colonyTons": updatedColonyTons
            })
        });
    }
    const facilityMineralEntry = facilityItems.find(entry => entry.facilityId === facilityId && entry.mineralId === mineralId)
    const updatedFacilityTons = facilityMineralEntry.facilityTons - 1;
    await fetch(`http://localhost:5223/api/facilityMinerals/${facilityMineralEntry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "facilityTons": updatedFacilityTons
        })
    })
    state.facilityTons = updatedFacilityTons;
    state.colonyTons = updatedColonyTons;
    document.dispatchEvent(new CustomEvent("stateChanged"));
};