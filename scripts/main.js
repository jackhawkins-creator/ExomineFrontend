import { generateFacilitiesHTML } from "./Facilities.js"
import { generateGovernorsHTML } from "./governors.js"
import { mineralOptions } from './Minerals.js'
import { generateColoniesHTML } from "./Colonies.js"
const container = document.querySelector("#container")

export const render = async () => {
    const facilitiesHTML = await generateFacilitiesHTML()
    const governorsHTML = await generateGovernorsHTML()
    const mineralOptionsHTML = await mineralOptions()
    const coloniesHTML = await generateColoniesHTML()
    
    const exomineHTML = `
    <h1>Solar System Marketplace</h1>

        <article class="choices">
            <section class="govenors_options">
                ${governorsHTML}
            </section>

            <section class="facilities_options">
                ${facilitiesHTML}
            </section>

        </article>
        
        <div id="minerals-container">
        ${mineralOptionsHTML}
        </div>
        <div id="colonies-container">
            ${coloniesHTML}
            </div>
        <article class="cart">
            <section class="spaceCart">
            <h2>Space Cart</h2>
            
            </section>

            <section class="purchaseButton">
                      
            </section>
        </article>
    `
container.innerHTML = exomineHTML
}
render()