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
    console.log(state)
    document.dispatchEvent(new CustomEvent("stateChanged"))
}
export const setGovernor = (updatedGovernorsId) => {
    state.governorId = updatedGovernorsId
    console.log(state)
    document.dispatchEvent(new CustomEvent("stateChanged"))
}
export const setColony = (updatedColonyId) => {
    state.colonyId = updatedColonyId
    console.log(state)
    document.dispatchEvent(new CustomEvent("stateChanged"))
}

export const setMineral = (updatedMineralId) => {
    state.mineralId = updatedMineralId
    console.log(state)
    document.dispatchEvent(new CustomEvent("stateChanged"))
}
export const facilityAmount = (updatedMineralAmount) => {
    updatedMineralAmount
    state.facilityTons = updatedMineralAmount
    console.log(state)
    document.dispatchEvent(new CustomEvent("stateChanged"))
}

export const colonyTons = (colonyAmount) => {
    state.colonyTons = colonyAmount
    console.log(state)
    document.dispatchEvent(new CustomEvent("stateChanged"))
}

export const purchaseMineral = async () => {
    const facilityId = state.facilityId;
    const colonyId = state.colonyId;
    const mineralId = state.mineralId;

    console.log("State values before lookup:", { facilityId, colonyId, mineralId });

    if (!facilityId || !colonyId || !mineralId) {
        console.error("Invalid state: One or more required IDs are missing!");
        return;
    }

    // Fetch existing data
    const colonyItemsResponse = await fetch(`http://localhost:8088/colonyMinerals`);
    const facilityItemsResponse = await fetch(`http://localhost:8088/facilityMinerals`);
    
    const colonyItems = await colonyItemsResponse.json();
    const facilityItems = await facilityItemsResponse.json();

    console.log("Facility Minerals Data:", facilityItems);

    // Fix: Use "facilitiesId" instead of "facilityId"
    const facilityMineralEntry = facilityItems.find(entry => entry.facilitiesId === facilityId && entry.mineralId === mineralId);

    if (!facilityMineralEntry) {
        console.error("No matching facilityMinerals entry found!");
        console.log("Looking for facilityId:", facilityId, "mineralId:", mineralId);
        console.log("Available facilityMinerals entries:", facilityItems);
        return;
    }

    console.log("Found facilityMineralEntry:", facilityMineralEntry);

    if (facilityMineralEntry.facilityTons < 1) {
        console.error("Insufficient minerals in facility:", facilityMineralEntry.facilityTons);
        return;
    }

    // Find existing colonyMineral entry
    const colonyMineralEntry = colonyItems.find(entry => entry.colonyId === colonyId && entry.mineralId === mineralId);
    let updatedColonyTons = colonyMineralEntry ? colonyMineralEntry.colonyTons + 1 : 1;

    if (colonyMineralEntry) {
        await fetch(`http://localhost:8088/colonyMinerals/${colonyMineralEntry.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "colonyId": colonyId,
                "mineralId": mineralId,
                "colonyTons": updatedColonyTons
            })
        });
    } else {
        await fetch(`http://localhost:8088/colonyMinerals`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "colonyId": colonyId,
                "mineralId": mineralId,
                "colonyTons": updatedColonyTons
            })
        });
    }

    // Update facilityMineral entry (PATCH)
    const updatedFacilityTons = facilityMineralEntry.facilityTons - 1;
    await fetch(`http://localhost:8088/facilityMinerals/${facilityMineralEntry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "facilityTons": updatedFacilityTons
        })
    });

    state.facilityTons = updatedFacilityTons;
    state.colonyTons = updatedColonyTons;
    
    document.dispatchEvent(new CustomEvent("stateChanged"));
    console.log("Transaction successful:", state);
};