// frontend/src/components/WhyAgent.js

import { api } from '../api.js';

export function renderWhyAgent(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <div class="flex flex-col space-y-4">
            <input type="text" id="whyQueryInput" 
                   placeholder="e.g., Why was my nutrition plan changed?"
                   class="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm">
            <button id="submitWhyQueryBtn" 
                    class="bg-blue-600 text-white px-5 py-3 rounded-lg shadow-md 
                           hover:bg-blue-700 transition duration-300 font-semibold">
                Ask Why Agent
            </button>
            <div id="whyAgentResponse" class="p-4 bg-blue-50 rounded-lg border border-blue-200 shadow-inner min-h-[100px]">
                <p class="text-gray-600">Enter a query above to get reasoning for decisions.</p>
            </div>
            <div id="whyAgentLoading" class="hidden text-center text-blue-600 font-medium">
                Generating reasoning...
            </div>
        </div>
    `;

    const queryInput = document.getElementById('whyQueryInput');
    const submitBtn = document.getElementById('submitWhyQueryBtn');
    const responseDiv = document.getElementById('whyAgentResponse');
    const loadingDiv = document.getElementById('whyAgentLoading');

    submitBtn.addEventListener('click', async () => {
        const query = queryInput.value.trim();
        if (!query) {
            responseDiv.innerHTML = '<p class="text-red-500">Please enter a query.</p>';
            return;
        }

        loadingDiv.classList.remove('hidden');
        responseDiv.innerHTML = ''; // Clear previous response

        const result = await api.getWhyReasoning(query);

        loadingDiv.classList.add('hidden');

        if (result && result.reasoning) {
            responseDiv.innerHTML = `
                <p class="font-semibold text-blue-800 mb-2">Reasoning:</p>
                <p class="text-gray-800">${result.reasoning}</p>
                <p class="font-semibold text-blue-800 mt-4 mb-2">Context Found:</p>
                <pre class="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto text-gray-700">${result.context_found || 'No specific context found.'}</pre>
            `;
        } else {
            responseDiv.innerHTML = '<p class="text-red-500">Failed to get reasoning. Please try again.</p>';
        }
    });
}
