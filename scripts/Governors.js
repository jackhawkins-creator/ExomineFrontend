// import { updateGovernorChoice } from './TransientState.js'

export const generateGovernorsHTML = async() => {
    const response = await fetch('http://localhost:8088/governors')
    const data = await response.json()
    document.addEventListener("change", handleGovernorChoice)

    let html = `
        <div id="governor-container">
            <select id="governor-select">
                ${data.map((governor) => {
                    if (governor.active) {
                        return `<option value="${governor.id}">${governor.name}</option>`
                    } else {
                        return ''
                    }
                   }).join('')}
            </select>
        </div>`;

        return html
}


const handleGovernorChoice = (changeEvent) => {
    if (changeEvent.target.value === 'governor') {
        const govenorId = parseInt(changeEvent.target.id)
        updateGovernorChoice(govenorId)
    }
}