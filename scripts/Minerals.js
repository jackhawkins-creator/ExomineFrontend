import { setMineral, facilityAmount } from "./TransientState.js"
import { state } from "./TransientState.js"

export const mineralOptions = async () => {
    let facilityId = state.facilityId
    let mineralId = state.mineralId

   if(facilityId === 0 && mineralId === 0) {
    
  return  "<h2>Facility Minerals</h2>"
   } else {

   
    document.addEventListener("change", handleMineralChoice)
    const res = await fetch(`http://localhost:8088/facilities/${facilityId}`)
    const facilities = await res.json()
    
    const response = await fetch(`http://localhost:8088/facilityMinerals/${facilityId}?_expand=facilities&_expand=mineral`)
    const minerals = await response.json()

    let mineralsHTML = ""
       if(facilityId === facilities.id && minerals.facilityTons > 0) {
            if(facilities.active){ 
                const isChecked = state.mineralId === minerals.id ? "checked" : ""
            mineralsHTML += `<h2>Facility Minerals for ${facilities.name}</h2><div><input autocomplete='on' 
                    id="mineral-select" type="radio" name="mineral" 
                    value="${minerals.id}" data-facility="${minerals.facilityTons}" ${isChecked} />${minerals.facilityTons} 
                    tons of ${minerals.mineral.name}</div>`
            } else {
            return ""
                   }
                } 
            
        
       
    return mineralsHTML
   }
    }
const handleMineralChoice = (event) => {
        if (event.target.name === "mineral") {
                const mineralId = parseInt(event.target.value)
                const facilityAmountTons = parseInt(event.target.dataset.facility)
                setMineral(mineralId)
                facilityAmount(facilityAmountTons)        
    }
}

document.addEventListener("stateChanged", async () => {
    const mineralChangeHTML = await mineralOptions()
    const mineralsContainer = document.getElementById("minerals-container")
    mineralsContainer.innerHTML = mineralChangeHTML
    
    
})
