const API = "http://localhost:5223/api";

export const fetchGovernors = () => fetch(`${API}/governors`).then(r => r.json());
export const fetchFacilities = () => fetch(`${API}/facilities`).then(r => r.json());
export const fetchMinerals = () => fetch(`${API}/minerals`).then(r => r.json());
export const fetchColonyMinerals = () => fetch(`${API}/colonyMinerals`).then(r => r.json());
export const fetchFacilityMinerals = () =>
    fetch(`${API}/facilityMinerals?expand=mineral`).then(r => r.json());
  

export const fetchMineralById = id => fetch(`${API}/minerals/${id}`).then(r => r.json());
export const fetchFacilityById = id => fetch(`${API}/facilities/${id}`).then(r => r.json());

export const putColonyMineral = (id, data) =>
  fetch(`${API}/colonyMinerals/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

export const postColonyMineral = data =>
  fetch(`${API}/colonyMinerals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

export const patchFacilityMineral = (id, data) =>
  fetch(`${API}/facilityMinerals/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
