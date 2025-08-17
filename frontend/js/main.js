// Main application logic
class App {
    constructor() {
        this.currentMember = null;
        this.data = {};
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.updateTimestamp();
        await this.loadMemberProfile();
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Member card click
        document.addEventListener('click', (e) => {
            if (e.target.closest('#memberCard')) {
                this.selectMember();
            }
        });

        // AI Chat functionality
        const aiChatInput = document.getElementById('aiChatInput');
        const aiChatSend = document.getElementById('aiChatSend');

        if (aiChatInput && aiChatSend) {
            aiChatSend.addEventListener('click', () => this.sendAiMessage());
            aiChatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendAiMessage();
                }
            });
        }
    }

    updateTimestamp() {
        const timestampElement = document.getElementById('lastUpdated');
        if (timestampElement) {
            timestampElement.textContent = new Date().toLocaleString();
        }
    }

    async loadMemberProfile() {
        try {
            const profile = await API.getMemberProfile();
            this.currentMember = profile;
            this.renderMemberCard(profile);
        } catch (error) {
            console.error('Failed to load member profile:', error);
            Components.showError('memberCard', 'Failed to load member profile');
        }
    }

    renderMemberCard(member) {
        const memberCard = document.getElementById('memberCard');
        if (memberCard) {
            memberCard.innerHTML = Components.createMemberCard(member);
            memberCard.classList.add('cursor-pointer', 'hover:shadow-lg', 'transition-all');
        }
    }

    async selectMember() {
        if (!this.currentMember) return;

        // Show main dashboard
        document.getElementById('memberSelection').style.display = 'none';
        document.getElementById('mainDashboard').classList.remove('hidden');

        // Update member info banner
        this.renderMemberInfo();

        // Load all data for tabs
        await this.loadAllData();
    }

    renderMemberInfo() {
        const memberInfo = document.getElementById('memberInfo');
        if (memberInfo && this.currentMember) {
            memberInfo.innerHTML = `
                <div class="flex justify-between items-start">
                    <div>
                        <h2 class="text-2xl font-bold">${this.currentMember.name}</h2>
                        <p class="text-blue-100 mt-1">${this.currentMember.age} years old • ${this.currentMember.gender} • ${this.currentMember.residence}</p>
                        <p class="text-blue-100 mt-2">${this.currentMember.occupation}</p>
                    </div>
                    <div class="text-right">
                        <div class="bg-white bg-opacity-20 rounded-lg p-3">
                            <p class="text-sm font-medium">Chronic Condition</p>
                            <p class="text-lg font-bold">${this.currentMember.chronic_condition}</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    async loadAllData() {
        try {
            // Load data for active tab first (chats by default)
            await this.loadChats();
            
            // Preload other data in background
            setTimeout(() => this.preloadData(), 100);
        } catch (error) {
            console.error('Failed to load initial data:', error);
        }
    }

    async preloadData() {
        try {
            const [biomarkers, wearables, testReports, diagnostics, internalMetrics] = await Promise.all([
                API.getMemberBiomarkers(),
                API.getMemberWearables(),
                API.getMemberTestReports(),
                API.getMemberDiagnostics(),
                API.getInternalMetrics()
            ]);

            this.data = {
                biomarkers,
                wearables,
                testReports,
                diagnostics,
                internalMetrics
            };
        } catch (error) {
            console.error('Failed to preload data:', error);
        }
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        // Load tab-specific data
        this.loadTabData(tabName);
    }

    async loadTabData(tabName) {
        switch (tabName) {
            case 'chats':
                await this.loadChats();
                break;
            case 'biomarkers':
                await this.loadBiomarkers();
                break;
            case 'reports':
                await this.loadTestReports();
                break;
            case 'wearables':
                await this.loadWearables();
                break;
            case 'diagnostics':
                await this.loadDiagnostics();
                break;
            case 'ai-chat':
                // AI chat is already set up, no additional loading needed
                break;
        }
        
        // Always load internal metrics when switching tabs
        await this.loadInternalMetrics();
    }

    async loadChats() {
        try {
            Components.showLoading('chatContainer');
            const chatData = await API.getMemberChats();
            
            const chatContainer = document.getElementById('chatContainer');
            if (chatData.communications && chatData.communications.length > 0) {
                chatContainer.innerHTML = chatData.communications
                    .map(message => Components.createChatMessage(message))
                    .join('');
            } else {
                chatContainer.innerHTML = '<p class="text-gray-500 text-center">No chat history available</p>';
            }
        } catch (error) {
            console.error('Failed to load chats:', error);
            Components.showError('chatContainer', error.message);
        }
    }

    async loadBiomarkers() {
        try {
            let biomarkerData = this.data.biomarkers;
            if (!biomarkerData) {
                Components.showLoading('latestBiomarkers');
                console.log('Fetching biomarkers data from API...');
                biomarkerData = await API.getMemberBiomarkers();
                console.log('Biomarkers data received:', biomarkerData);
                this.data.biomarkers = biomarkerData;
            }

            // Render latest biomarkers
            const latestContainer = document.getElementById('latestBiomarkers');
            if (biomarkerData && biomarkerData.grouped_data) {
                console.log('Processing biomarkers data, markers available:', Object.keys(biomarkerData.grouped_data));
                
                // First, just show the data without charts
                latestContainer.innerHTML = Object.keys(biomarkerData.grouped_data)
                    .map(marker => Components.createBiomarkerCard(marker, biomarkerData.grouped_data[marker]))
                    .join('');

                console.log('Biomarker cards created successfully');

                // Try to create charts with error handling
                try {
                    if (typeof Chart !== 'undefined') {
                        console.log('Chart.js is available, creating charts...');
                        Charts.createBiomarkerCharts(biomarkerData);
                    } else {
                        console.error('Chart.js is not loaded - charts will not be displayed');
                        // Add a message to the charts container
                        const chartsContainer = document.getElementById('biomarkerChartsContainer');
                        if (chartsContainer) {
                            chartsContainer.innerHTML = '<p class="text-orange-500 text-center p-4">Charts unavailable - Chart.js library not loaded</p>';
                        }
                    }
                } catch (chartError) {
                    console.error('Chart creation failed:', chartError);
                    const chartsContainer = document.getElementById('biomarkerChartsContainer');
                    if (chartsContainer) {
                        chartsContainer.innerHTML = '<p class="text-red-500 text-center p-4">Chart creation failed: ' + chartError.message + '</p>';
                    }
                }
            } else {
                console.log('No grouped biomarker data available');
                latestContainer.innerHTML = '<p class="text-gray-500">No biomarker data available</p>';
            }
        } catch (error) {
            console.error('Failed to load biomarkers:', error);
            Components.showError('latestBiomarkers', error.message);
        }
    }

    async loadWearables() {
        try {
            let wearableData = this.data.wearables;
            if (!wearableData) {
                Components.showLoading('recentWearables');
                console.log('Fetching wearables data from API...');
                wearableData = await API.getMemberWearables();
                console.log('Wearables data received:', wearableData);
                this.data.wearables = wearableData;
            }

            // Render recent wearables
            const recentContainer = document.getElementById('recentWearables');
            if (wearableData && wearableData.length > 0) {
                console.log('Processing wearables data, total records:', wearableData.length);
                
                // Helper function to check if a value is valid (not null, undefined, NaN, or 'N/A')
                const isValidValue = (value) => {
                    return value !== null && 
                           value !== undefined && 
                           value !== 'N/A' && 
                           value !== '' && 
                           !Number.isNaN(Number(value));
                };

                // Filter out entries with all invalid values and get the most recent valid data
                const validEntries = wearableData.filter(d => 
                    isValidValue(d.sleep_score_100) ||
                    isValidValue(d.hrv_ms) ||
                    isValidValue(d.rhr_bpm) ||
                    isValidValue(d.respiratory_rate_brpm) ||
                    isValidValue(d.recovery_score_pct)
                );

                console.log('Valid entries found:', validEntries.length);

                let latest, previous;
                if (validEntries.length > 0) {
                    latest = validEntries[validEntries.length - 1];
                    previous = validEntries.length > 1 ? validEntries[validEntries.length - 2] : null;
                } else {
                    latest = wearableData[wearableData.length - 1];
                    previous = wearableData.length > 1 ? wearableData[wearableData.length - 2] : null;
                }

                console.log('Latest entry:', latest);
                console.log('Previous entry:', previous);

                const calculateTrend = (current, prev) => {
                    if (!previous || !isValidValue(current) || !isValidValue(prev)) return 0;
                    return parseFloat(current) - parseFloat(prev);
                };

                const formatValue = (value) => {
                    if (!isValidValue(value)) return 'N/A';
                    return Number(value).toFixed(1);
                };

                recentContainer.innerHTML = [
                    { 
                        label: 'Sleep Score', 
                        value: formatValue(latest.sleep_score_100), 
                        unit: '/100', 
                        trend: calculateTrend(latest.sleep_score_100, previous?.sleep_score_100) 
                    },
                    { 
                        label: 'HRV', 
                        value: formatValue(latest.hrv_ms), 
                        unit: 'ms', 
                        trend: calculateTrend(latest.hrv_ms, previous?.hrv_ms) 
                    },
                    { 
                        label: 'Resting HR', 
                        value: formatValue(latest.rhr_bpm), 
                        unit: 'bpm', 
                        trend: previous ? -calculateTrend(latest.rhr_bpm, previous.rhr_bpm) : 0 // Lower RHR is better
                    },
                    { 
                        label: 'Respiratory Rate', 
                        value: formatValue(latest.respiratory_rate_brpm), 
                        unit: 'brpm', 
                        trend: 0 
                    },
                    { 
                        label: 'Recovery Score', 
                        value: formatValue(latest.recovery_score_pct), 
                        unit: '%', 
                        trend: calculateTrend(latest.recovery_score_pct, previous?.recovery_score_pct) 
                    },
                    { 
                        label: 'Device', 
                        value: latest.device || 'Unknown', 
                        unit: '', 
                        trend: 0 
                    }
                ].map(metric => Components.createWearableMetric(metric.label, metric.value, metric.unit, metric.trend)).join('');

                // Create chart with filtered data
                Charts.createWearablesChart(wearableData);
            } else {
                recentContainer.innerHTML = '<p class="text-gray-500">No wearables data available</p>';
            }
        } catch (error) {
            console.error('Failed to load wearables:', error);
            Components.showError('recentWearables', error.message);
        }
    }

    async loadTestReports() {
        try {
            let testReports = this.data.testReports;
            if (!testReports) {
                Components.showLoading('reportsContainer');
                testReports = await API.getMemberTestReports();
                this.data.testReports = testReports;
            }

            const reportsContainer = document.getElementById('reportsContainer');
            if (testReports.test_panel_reports && testReports.test_panel_reports.length > 0) {
                reportsContainer.innerHTML = testReports.test_panel_reports
                    .map(report => Components.createTestReportCard(report))
                    .join('');
            } else {
                reportsContainer.innerHTML = '<p class="text-gray-500 text-center">No test reports available</p>';
            }
        } catch (error) {
            console.error('Failed to load test reports:', error);
            Components.showError('reportsContainer', error.message);
        }
    }

    async loadDiagnostics() {
        try {
            let diagnostics = this.data.diagnostics;
            if (!diagnostics) {
                Components.showLoading('diagnosticsContainer');
                diagnostics = await API.getMemberDiagnostics();
                this.data.diagnostics = diagnostics;
            }

            const diagnosticsContainer = document.getElementById('diagnosticsContainer');
            if (diagnostics.diagnostic_plan_over_time && diagnostics.diagnostic_plan_over_time.length > 0) {
                diagnosticsContainer.innerHTML = diagnostics.diagnostic_plan_over_time
                    .map(phase => Components.createDiagnosticPhase(phase))
                    .join('');
            } else {
                diagnosticsContainer.innerHTML = '<p class="text-gray-500 text-center">No diagnostic plans available</p>';
            }
        } catch (error) {
            console.error('Failed to load diagnostics:', error);
            Components.showError('diagnosticsContainer', error.message);
        }
    }

    async loadInternalMetrics() {
        try {
            let internalMetrics = this.data.internalMetrics;
            if (!internalMetrics) {
                Components.showLoading('internalMetricsContainer');
                internalMetrics = await API.getInternalMetrics();
                this.data.internalMetrics = internalMetrics;
            }

            const metricsContainer = document.getElementById('internalMetricsContainer');
            if (internalMetrics.internal_metrics && internalMetrics.internal_metrics.length > 0) {
                metricsContainer.innerHTML = `
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        ${internalMetrics.internal_metrics
                            .map(metric => Components.createInternalMetricCard(metric))
                            .join('')}
                    </div>
                `;
            } else {
                metricsContainer.innerHTML = '<p class="text-gray-500 text-center">No internal metrics available</p>';
            }
        } catch (error) {
            console.error('Failed to load internal metrics:', error);
            Components.showError('internalMetricsContainer', error.message);
        }
    }

    async sendAiMessage() {
        const input = document.getElementById('aiChatInput');
        const chatHistory = document.getElementById('aiChatHistory');
        const sendButton = document.getElementById('aiChatSend');

        if (!input || !chatHistory || !sendButton) return;

        const query = input.value.trim();
        if (!query) return;

        // Disable input and button
        input.disabled = true;
        sendButton.disabled = true;
        sendButton.textContent = 'Sending...';

        // Add user message to chat
        if (chatHistory.querySelector('.text-gray-500')) {
            chatHistory.innerHTML = '';
        }
        chatHistory.innerHTML += Components.createAiChatMessage(query, true);
        chatHistory.scrollTop = chatHistory.scrollHeight;

        // Clear input
        input.value = '';

        try {
            const response = await API.sendChatQuery(query);
            
            // Add AI response to chat
            chatHistory.innerHTML += Components.createAiChatMessage(response.response, false);
            chatHistory.scrollTop = chatHistory.scrollHeight;
        } catch (error) {
            console.error('Failed to send AI message:', error);
            chatHistory.innerHTML += Components.createAiChatMessage(
                'Sorry, I encountered an error processing your request. Please make sure the backend is running and your OpenAI API key is configured.',
                false
            );
            chatHistory.scrollTop = chatHistory.scrollHeight;
        } finally {
            // Re-enable input and button
            input.disabled = false;
            sendButton.disabled = false;
            sendButton.textContent = 'Send';
            input.focus();
        }
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
