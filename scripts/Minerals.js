import { setMineral } from "./TransientState.js"
import { state } from "./TransientState.js"

export const mineralOptions = async () => {
    
    document.addEventListener("change", handleMineralChoice)
    
    const res = await fetch("http://localhost:8088/facilities")
    const facilities = await res.json()
    
    const response = await fetch("http://localhost:8088/facilityMinerals?_expand=facilities&_expand=mineral")
    const minerals = await response.json()
    let mineralsHTML = ""
        minerals.filter(mineral => {
            const facilitiesFind = facilities.filter(facility => facility.id)
            facilitiesFind.map(find => {
                if(mineral.facilities.id === find.id && mineral.facilityTons > 0) {
                    if(find.active){
                    mineralsHTML += `<div><input id="mineral-select" type="radio" name="mineral" value="${mineral.id}" amount="${mineral.facilityTons}" />${mineral.facilityTons} tons of ${mineral.mineral.name}</div>`
                    } else {
                    return ""
                   }
                } 
            })
        })
    return mineralsHTML
    }
const handleMineralChoice = (changeEvent) => {
    if (changeEvent.target.id === 'mineral-select') {
        const mineralId = parseInt(changeEvent.target.value)
        setMineral(mineralId)
    }
}

