import { mineralOptions } from './Minerals.js'
import { generateColoniesHTML } from './Colonies.js'
import { purchaseMineral, state } from "./TransientState.js"

let selectedMineral = ""  // Used to track selected mineral for the cart

// Handle click events for purchase button
const handlePurchaseMineralClick = async (clickEvent) => {
    if (clickEvent.target.id === "purchase") {
        // Call purchase logic when the button is clicked
        purchaseMineral(selectedMineral)
    }
}

// Function to render the purchase button & message
export const PurchaseSubmission = async () => {
    document.addEventListener("click", handlePurchaseMineralClick) // Listen for purchase button click

    //get current user-selected mineral & facility ids
    let selectedMineral = state.mineralId
    let selectedFacility = state.facilityId

    // Only proceed if a valid mineral and facility are selected
    if (selectedMineral === 0 || selectedFacility === 0) {
        return `
            <div>
                <button id='purchase' disabled>Purchase Mineral</button>
            </div>
        `
    }

    // Fetch mineral name
    const mineralResponse = await fetch(`http://localhost:8088/minerals/${selectedMineral}`)
    const mineralData = await mineralResponse.json()

    // Fetch facility name
    const facilityResponse = await fetch(`http://localhost:8088/facilities/${selectedFacility}`)
    const facilityData = await facilityResponse.json() //note: we're getting objects back here

    const message = `1 ton of ${mineralData.name} from ${facilityData.name}`
    return `
        <div>
            <h2>Space Cart</h2>
            <p>${message}</p>
            <button id='purchase'>Purchase Mineral</button>
        </div>
    `;
}

document.addEventListener('stateChanged', async () => {
    const buttonHTML = await PurchaseSubmission();
    const buttonContainer = document.querySelector('.spaceCart');
    buttonContainer.innerHTML = buttonHTML;
});

document.addEventListener("click", async (clickEvent) => {
    const clickedItem = clickEvent.target
    if (clickedItem.id === "purchase") {
        purchaseMineral()
    }
}    
)