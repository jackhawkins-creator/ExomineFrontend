
export const mineralOptions = async () => {
    
    //document.addEventListener("change", handleMineralChange)
    
    const res = await fetch("http://localhost:8088/facilities")
    const facilities = await res.json()
    
    const response = await fetch("http://localhost:8088/facilityMinerals?_expand=facilities&_expand=mineral")
    const minerals = await response.json()
    let mineralsHTML = ""
        minerals.filter(mineral => {
            const facilitiesFind = facilities.filter(facility => facility.id)
            facilitiesFind.map(find => {
                if(mineral.facilities.id === find.id) {
                    if(find.active){
                    mineralsHTML += `<div>${mineral.facilityTons} tons of ${mineral.mineral.name}</div>`
                    } else {
                    return ""
                   }
                } 
            })
        })
    return mineralsHTML
    }

