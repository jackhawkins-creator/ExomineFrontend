export const state = {
    "governorId": 0,
    "colonyId": 0,
    "facilityId": 0,
    "mineralId": 0,
    "mineralAmount": 0
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
export const mineralsAmount = (updatedMineralAmount) => {
    updatedMineralAmount += 1
    state.mineralAmount = updatedMineralAmount
    console.log(state)
    document.dispatchEvent(new CustomEvent("stateChanged"))
}

 export const purchaseMineral = async () => {
     const facilityId = state.facilityId;
   const colonyId = state.colonyId;
    const colonyItems = await fetch(`http://localhost:8088/colonyMinerals/${colonyId}?_expand=colony`)
    const mineralItems = await fetch(`http://localhost:8088/facilityMinerals/${facilityId}?_expand=mineral`)
    const colonies = await colonyItems.json()
    const minerals = await mineralItems.json()
    console.table(colonies)
        if(state.amount === 0 && minerals.mineralId !== colonyCheck.mineralId) {
               const postOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(state)
           }
             const response = await fetch("http://localhost:8088/purchases", postOptions)
             } else {
                 const putOptions = {
                         method: "PUT",
                         headers: {
                             "Content-Type": "application/json"
                         },
                        body: JSON.stringify(state)
                     }
                     const response = await fetch("http://localhost:8088/purchases", putOptions)
                 }
              document.dispatchEvent(new CustomEvent("stateChanged"))
             }

            
    /*
        Does the chosen governor's colony already own some of this mineral?
            - If yes, what should happen?
            - If no, what should happen?
        Defining the algorithm for this method is traditionally the hardest
        task for teams during this group project. It will determine when you
        should use the method of POST, and when you should use PUT.
        Only the foolhardy try to solve this problem with code.
    */