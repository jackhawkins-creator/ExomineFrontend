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
    const colonyItems = await fetch(`http://localhost:8088/colonyMinerals/${colonyId}`)
    const mineralItems = await fetch(`http://localhost:8088/facilityMinerals/${facilityId}`)
    const colonies = await colonyItems.json()
    const minerals = await mineralItems.json()


     if(colonyTons && colonies.mineralId  === minerals.mineralId) {
               const postOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "colonyId": state.colonyId,
                    "mineralId": state.mineralId,
                    "colonyTons": colonies.colonyTons + 1
                })
           }
             const response = await fetch("http://localhost:8088/colonyMinerals", postOptions)
             } else {     
                const putOptions = {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({                 
                        "colonyId": state.colonyId,
                        "mineralId": state.mineralId,
                        "colonyTons": colonies.colonyTons + 1

                    })
                }
          const value = await fetch(`http://localhost:8088/colonyMinerals/${colonies.id}?_expand`, putOptions)     
                }
                const newfacilityTons = --state.facilityTons
                const patchReplace = {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "facilityTons": newfacilityTons
                    })
                };
                const value = await fetch(`http://localhost:8088/facilityMinerals/${state.facilityId}`, patchReplace)

         
                 
                }
