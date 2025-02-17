import { setGovernor, state } from './TransientState.js';

const coloniesContainer = document.getElementById('colonies-container'); 

export const generateColoniesHTML = async () => {
    const governorId = state.governorId; 

    if (!governorId || governorId === 0) {
        return '<h2>Colony Minerals</h2>';
    }

    // Fetch governor and expand colony data
    const governorUrl = `http://localhost:8088/governors/${governorId}?_expand=colony`;
    const governorResponse = await fetch(governorUrl);
    if (!governorResponse.ok) return '<h2>Error fetching governor data</h2>';
    const governorData = await governorResponse.json();

    if (!governorData.colony) return '<h2>Governor has no assigned colony</h2>';

    const colonyId = governorData.colony.id;
    
    // Fetch minerals for the colony
    const mineralsUrl = `http://localhost:8088/colonyMinerals?colonyId=${colonyId}&_expand=mineral`;
    const mineralsResponse = await fetch(mineralsUrl);
    if (!mineralsResponse.ok) return '<h2>Error fetching colony minerals</h2>';
    const mineralsData = await mineralsResponse.json();

    // Get the colony name
    const colonyName = governorData.colony.name;

    // Generate the HTML for the minerals
    const mineralHTML = mineralsData.map(mineralEntry => {
        return `<p>${mineralEntry.mineral.name}: ${mineralEntry.colonyTons} tons</p>`;
    }).join('');

    // Generate the header HTML with the colony name
    const headerHTML = `<h2>${colonyName} Minerals</h2>`;

    return headerHTML + mineralHTML;
};

document.addEventListener('stateChanged', async () => {
    const coloniesHTML = await generateColoniesHTML();
    const coloniesContainer = document.getElementById('colonies-container');
    coloniesContainer.innerHTML = coloniesHTML;
});