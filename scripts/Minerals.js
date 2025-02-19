import { setMineral, mineralsAmount, state } from "./TransientState.js"

export const mineralOptions = async () => {
    let facilityId = state.facilityId
    let mineralId = state.mineralId

    if (facilityId === 0 && mineralId === 0) {
        return "<h2>Facility Minerals</h2>"
    } else {
        document.addEventListener("change", handleMineralChoice)

        // Fetching the selected facility's data
        const res = await fetch(`http://localhost:8088/facilities/${facilityId}`)
        const facilityData = await res.json()  // Note: this contains information about the facility itself
        
        // Fetching the minerals available at this facility
        const response = await fetch(`http://localhost:8088/facilityMinerals?facilitiesId=${facilityId}&_expand=mineral`)
        const mineralsData = await response.json()

        let mineralsHTML = ""

        // Add the Facility Minerals header with the selected facility name
        mineralsHTML += `<h2>Facility Minerals for ${facilityData.name}</h2>`

        if (facilityData.active) {
            mineralsData.forEach(mineralEntry => {
                // Check if the mineral is available in this facility (i.e., quantity > 0)
                if (mineralEntry.facilityTons > 0) {
                    const isChecked = state.mineralId === mineralEntry.mineralId ? "checked" : ""
                    mineralsHTML += `
                        <div>
                            <input 
                                type="radio" 
                                name="mineral" 
                                value="${mineralEntry.mineralId}" 
                                data-amount="${mineralEntry.facilityTons}" 
                                ${isChecked} />
                            ${mineralEntry.facilityTons} tons of ${mineralEntry.mineral.name}
                        </div>
                    `
                }
            })
        }

        // Return the generated HTML for the minerals
        return mineralsHTML;
    }
}

const handleMineralChoice = (event) => {
    if (event.target.name === "mineral") {
        const selectedMineralId = parseInt(event.target.value);
        const mineralAmount = parseInt(event.target.dataset.amount);
        setMineral(selectedMineralId);  // Update the mineralId in the state
        mineralsAmount(mineralAmount); // Update the mineral amount in the state
    }
};


document.addEventListener("stateChanged", async () => {
    const mineralChangeHTML = await mineralOptions()
    const mineralsContainer = document.getElementById("minerals-container")
    mineralsContainer.innerHTML = mineralChangeHTML
    
    
})
