export const mineralOptions = async () => {
    document.addEventListener("change", handleMetalChange)

    const response = await fetch("http://localhost:8088/minerals")
    const metals = await response.json()

        let mineralsHTML = ""
        const minersStringArray = metals.map(
            (metal) => {
                return `<div><input type='radio' name='metal' value='${metal.id}'/> ${metal.metal} </div>`
            }
        )
        mineralsHTML += metalsStringArray.join("")
  
    return mineralsHTML
}

import { metalId } from "./TransientState.js"

const handleMetalChange = (changeEvent) =>{
    if(changeEvent.target.name === "metal") {
    metalId(parseInt(changeEvent.target.value))
    }
}

