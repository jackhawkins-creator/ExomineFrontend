

export const generateFacilitiesHTML = async () => {
    try {
        const response = await fetch('http://localhost:8088/facilities');
        const data = await response.json();

        let html = `
        <div id="facilities-container">
            <select id="facility-select">
                ${data.map((facility) => `
                    <option value="${facility.id}">${facility.name}</option>
                `).join('')}
            </select>
        </div>`;

        return html
    } catch (error) {
        console.error('Error fetching facilities data:', error);
        return `<p>Error fetching facilities data: ${error.message}</p>`;
    }
};

export const attachFacilitiesListeners = () => {
    const selectElement = document.getElementById('facility-select');
    selectElement.addEventListener('change', (event) => {
        setChoice('facilityId', event.target.value);
    });
};