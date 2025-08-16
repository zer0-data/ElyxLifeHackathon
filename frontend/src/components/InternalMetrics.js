// frontend/src/components/InternalMetrics.js

export function renderInternalMetrics(containerId, metrics) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear previous content

    if (!metrics) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">Internal metrics not available.</p>';
        return;
    }

    container.innerHTML = `
        <div class="space-y-6">
            <div class="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-200">
                <h3 class="text-lg font-semibold text-blue-800 mb-2">Overall Engagement</h3>
                <p class="text-gray-700">Total messages exchanged: <span class="font-bold">${metrics.total_messages || 'N/A'}</span></p>
            </div>

            <div class="bg-green-50 p-4 rounded-lg shadow-sm border border-green-200">
                <h3 class="text-lg font-semibold text-green-800 mb-2">Messages by Elyx Team Role</h3>
                <ul class="list-disc list-inside text-gray-700 space-y-1">
                    ${metrics.messages_by_role ? Object.entries(metrics.messages_by_role).map(([role, count]) => `
                        <li><span class="font-medium">${role}:</span> ${count} messages</li>
                    `).join('') : '<p>No data available.</p>'}
                </ul>
            </div>

            <div class="bg-purple-50 p-4 rounded-lg shadow-sm border border-purple-200">
                <h3 class="text-lg font-semibold text-purple-800 mb-2">Members Served by Role</h3>
                <ul class="list-disc list-inside text-gray-700 space-y-1">
                    ${metrics.members_served_by_role ? Object.entries(metrics.members_served_by_role).map(([role, count]) => `
                        <li><span class="font-medium">${role}:</span> ${count} members</li>
                    `).join('') : '<p>No data available.</p>'}
                </ul>
            </div>
        </div>
    `;
}
