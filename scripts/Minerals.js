import { setMineral, facilityAmount, state } from "./TransientState.js"


export const mineralOptions = async () => {
    let facilityId = state.facilityId
    let mineralId = state.mineralId

    if (facilityId === 0 && mineralId === 0) {
        return "<h2>Facility Minerals</h2>"
    } else {
        document.addEventListener("change", handleMineralChoice)

        const res = await fetch(`http://localhost:5223/api/facilities/${facilityId}`)
        const facilityData = await res.json()  

        const response = await fetch(`http://localhost:5223/api/facilityMinerals?facilitiesId=${facilityId}&_expand=mineral`)
        const mineralsData = await response.json()

        let mineralsHTML = ""

        mineralsHTML += `<h2>Facility Minerals for ${facilityData.name}</h2>`

        if (facilityData.active) {
            mineralsData.forEach(mineralEntry => {
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
        return mineralsHTML;
    }
}

const handleMineralChoice = (event) => {
    if (event.target.name === "mineral") {
        const selectedMineralId = parseInt(event.target.value);
        const mineralAmount = parseInt(event.target.dataset.amount);
        setMineral(selectedMineralId); 
        facilityAmount(mineralAmount);
    }
};

document.addEventListener("stateChanged", async () => {
    const mineralChangeHTML = await mineralOptions()
    const mineralsContainer = document.getElementById("minerals-container")
    mineralsContainer.innerHTML = mineralChangeHTML
})
