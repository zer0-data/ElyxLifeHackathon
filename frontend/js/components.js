// UI Components and utilities
class Components {
    static createMemberCard(member) {
        return `
            <div class="member-card p-6 rounded-lg text-white shadow-lg">
                <div class="text-center">
                    <h3 class="text-2xl font-bold mb-2">${member.name}</h3>
                    <p class="text-blue-100 text-lg mb-2">${member.age} years old</p>
                    <div class="bg-white bg-opacity-20 rounded-lg p-3 mt-4">
                        <p class="text-sm font-medium">Chronic Condition</p>
                        <p class="text-lg font-bold">${member.chronic_condition}</p>
                    </div>
                </div>
            </div>
        `;
    }

    static createChatMessage(message) {
        const isUser = message.sender === 'Rohan Patel';
        const senderClass = isUser ? 'bg-blue-600 text-white ml-12' : 'bg-gray-200 text-gray-900 mr-12';
        const alignClass = isUser ? 'justify-end' : 'justify-start';
        
        return `
            <div class="flex ${alignClass} mb-4">
                <div class="${senderClass} rounded-lg p-4 max-w-3xl">
                    <div class="text-xs opacity-75 mb-1">
                        ${message.sender} • ${message.date} ${message.timestamp}
                    </div>
                    <div class="text-sm leading-relaxed">${message.message}</div>
                </div>
            </div>
        `;
    }

    static createBiomarkerCard(marker, data) {
        const latestValue = data[data.length - 1];
        const trend = data.length > 1 ? 
            (latestValue.value > data[data.length - 2].value ? '↗' : '↘') : '→';
        
        return `
            <div class="metric-card p-4 mb-8">
                <div class="flex justify-between items-start">
                    <div>
                        <h4 class="font-semibold text-gray-900">${marker}</h4>
                        <p class="text-2xl font-bold text-blue-600 mt-1">
                            ${latestValue.value} ${latestValue.unit}
                        </p>
                        <p class="text-xs text-gray-500 mt-1">${latestValue.date}</p>
                    </div>
                    <div class="text-2xl ${trend === '↗' ? 'text-green-500' : trend === '↘' ? 'text-red-500' : 'text-gray-400'}">
                        ${trend}
                    </div>
                </div>
                <p class="text-sm text-gray-600 mt-2">${latestValue.notes}</p>
            </div>
        `;
    }

    static createWearableMetric(label, value, unit, trend) {
        const trendIcon = trend > 0 ? '↗' : trend < 0 ? '↘' : '→';
        const trendColor = trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-gray-400';
        
        // Handle N/A values and empty strings
        const displayValue = (value === null || value === undefined || value === 'N/A' || value === '') ? 'N/A' : value;
        
        return `
            <div class="metric-card p-4 mb-4">
                <div class="flex justify-between items-center">
                    <div>
                        <h4 class="font-medium text-gray-700">${label}</h4>
                        <p class="text-xl font-bold text-gray-900">
                            ${displayValue} ${displayValue !== 'N/A' && unit ? unit : ''}
                        </p>
                    </div>
                    <div class="text-xl ${trendColor}">
                        ${displayValue !== 'N/A' ? trendIcon : ''}
                    </div>
                </div>
            </div>
        `;
    }

    static createTestReportCard(report) {
        return `
            <div class="metric-card p-6 mb-6">
                <div class="border-b border-gray-200 pb-4 mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">Month ${report.month}: ${report.title}</h3>
                    ${report.notes ? `<p class="text-sm text-gray-600 mt-2">${report.notes}</p>` : ''}
                </div>
                <div class="space-y-6">
                    ${report.panels.map(panel => `
                        <div>
                            <h4 class="font-medium text-gray-700 mb-3 text-base">${panel.name}</h4>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                ${panel.tests.map(test => `
                                    <div class="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center">
                                        <h5 class="font-medium text-gray-800 mb-2 text-center">${test.marker}</h5>
                                        <div class="text-lg font-bold text-blue-600 text-center">${test.value}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    static createDiagnosticPhase(phase) {
        return `
            <div class="metric-card p-6 mb-6">
                <div class="border-b border-gray-200 pb-4 mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">Phase ${phase.phase}: ${phase.title}</h3>
                    <p class="text-gray-600 mt-2">${phase.notes}</p>
                </div>
                <div class="space-y-4">
                    ${phase.monthly_plans.map(plan => `
                        <div class="border-l-4 border-blue-500 pl-4">
                            <h4 class="font-medium text-gray-900">Month ${plan.month}: ${plan.title}</h4>
                            <p class="text-sm text-gray-600 mt-1">${plan.objective}</p>
                            <div class="mt-2">
                                <p class="text-sm font-medium text-gray-700">Tests:</p>
                                <p class="text-sm text-gray-600">${plan.tests}</p>
                            </div>
                            <div class="mt-2">
                                <p class="text-sm font-medium text-gray-700">Rationale:</p>
                                <p class="text-sm text-gray-600">${plan.rationale}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    static createInternalMetricCard(metric) {
        return `
            <div class="metric-card p-4 mb-4">
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <h4 class="font-semibold text-gray-900">Month ${metric.month}</h4>
                        <p class="text-sm text-gray-600">${metric.period}</p>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <p class="text-xs text-gray-500">Doctor Consults</p>
                        <p class="text-lg font-bold text-blue-600">${metric.doctor_consults_hours} hrs</p>
                    </div>
                    <div>
                        <p class="text-xs text-gray-500">Coach Hours</p>
                        <p class="text-lg font-bold text-green-600">${metric.coach_hours} hrs</p>
                    </div>
                    <div>
                        <p class="text-xs text-gray-500">Plan Adherence</p>
                        <p class="text-lg font-bold text-purple-600">
                            ${metric.plan_adherence_percentage !== null ? metric.plan_adherence_percentage + '%' : 'N/A'}
                        </p>
                    </div>
                    <div>
                        <p class="text-xs text-gray-500">Member Conversations</p>
                        <p class="text-lg font-bold text-orange-600">${metric.member_initiated_conversations}</p>
                    </div>
                </div>
                <p class="text-xs text-gray-600 mt-3">${metric.notes}</p>
            </div>
        `;
    }

    static createAiChatMessage(content, isUser = false) {
        const messageClass = isUser ? 'bg-blue-600 text-white ml-12' : 'bg-gray-200 text-gray-900 mr-12';
        const alignClass = isUser ? 'justify-end' : 'justify-start';
        const sender = isUser ? 'You' : 'AI Assistant';
        
        return `
            <div class="flex ${alignClass} mb-4">
                <div class="${messageClass} rounded-lg p-4 max-w-3xl">
                    <div class="text-xs opacity-75 mb-1">
                        ${sender} • ${new Date().toLocaleString()}
                    </div>
                    <div class="text-sm leading-relaxed whitespace-pre-wrap">${content}</div>
                </div>
            </div>
        `;
    }

    static showLoading(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '<div class="loading"></div>';
        }
    }

    static showError(containerId, message) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="text-center text-red-600 p-4">
                    <p class="font-medium">Error loading data</p>
                    <p class="text-sm">${message}</p>
                </div>
            `;
        }
    }
}
