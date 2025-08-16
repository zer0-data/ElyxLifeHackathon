// frontend/src/api.js

// IMPORTANT: Replace this with your actual backend URL if running on Colab with port forwarding (e.g., ngrok URL)
// For local development, http://localhost:8000 is usually correct.
const BASE_URL = 'http://localhost:8000'; 

async function fetchData(endpoint) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching from ${endpoint}:`, error);
        return null; // Or throw error to be handled by caller
    }
}

export const api = {
    getMembers: () => fetchData('/members'), // Assuming you'll add a /members endpoint to your backend
    getChats: () => fetchData('/chats'),
    getDecisions: () => fetchData('/decisions'),
    getBiomarkers: (memberName, biomarker) => fetchData(`/biomarkers/${encodeURIComponent(memberName)}/${encodeURIComponent(biomarker)}`),
    getWhyReasoning: (query) => fetchData(`/why-agent?query=${encodeURIComponent(query)}`),
    getInternalMetrics: () => fetchData('/internal_metrics'), // Assuming you'll add this endpoint
    getPersonaSummaries: () => fetchData('/persona_summaries'), // Assuming you'll add this endpoint
};
