import { setGovernor, setColony } from './TransientState.js'

export const generateGovernorsHTML = async() => {
    const response = await fetch('http://localhost:5223/api/governors')
    const data = await response.json()
    document.addEventListener("change", handleGovernorChoice)

    let html = `
        <div id="governor-container">Governors:
            <select id="governor-select"><option value="0">Choose A governors:</option>
                ${data.map((governor) => {
                    if (governor.active) {
                        return `<option value="${governor.id}" colonyId="${governor.colonyId}">${governor.name}</option>`
                    } else {
                        return ''
                    }
                   }).join('')}
            </select>
        </div>`;

        return html
}
const handleGovernorChoice = (changeEvent) => {
    if (changeEvent.target.id === 'governor-select') {
        const selectedOption = changeEvent.target.selectedOptions[0];
        if (selectedOption) {
            const governorId = parseInt(selectedOption.value)
            const colonyId = parseInt(selectedOption.getAttribute('colonyId'))
            setGovernor(governorId)
            setColony(colonyId)
        }
    }
}