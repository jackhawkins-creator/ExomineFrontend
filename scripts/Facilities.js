import { setFacility } from "./TransientState.js";

export const generateFacilitiesHTML = async () => {
    try {
        const response = await fetch('http://localhost:8088/facilities');
        const data = await response.json();
        document.addEventListener("change", attachFacilitiesListeners)

        let html = `
        <div id="facilities-container">Facilities
            <select id="facility-select"><option value="0">Choose A Facility:</option>
                ${data.map((facility) => {
            if (facility.active) {
                return `<option value="${facility.id}">${facility.name}</option>`;
            } else {
                return '';
            }
        }).join('')}
            </select>
        </div>`;

        return html
    } catch (error) {
        console.error('Error fetching facilities data:', error);
        return `<p>Error fetching facilities data: ${error.message}</p>`;
    }
};

const attachFacilitiesListeners = (Event) => {
    if (Event.target.id === 'facility-select') {
        const facilityId = parseInt(Event.target.value)
        setFacility(facilityId);
    }
};


