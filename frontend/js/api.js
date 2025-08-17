// API configuration and functions
const API_BASE_URL = 'http://localhost:5000/api';

class API {
    static async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const textResponse = await response.text();
            
            // Check for invalid JSON (like NaN values)
            if (textResponse.includes('NaN')) {
                console.warn('Response contains NaN values, attempting to clean...');
                const cleanedResponse = textResponse.replace(/:\s*NaN\s*,/g, ': null,').replace(/:\s*NaN\s*}/g, ': null}');
                return JSON.parse(cleanedResponse);
            }
            
            return JSON.parse(textResponse);
        } catch (error) {
            console.error(`API request failed for ${endpoint}:`, error);
            if (error.message.includes('fetch')) {
                throw new Error('Backend server not available. Please start the Flask backend on http://localhost:5000');
            }
            if (error.message.includes('JSON')) {
                throw new Error('Invalid data format received from server. Please check server logs.');
            }
            throw error;
        }
    }

    static async getMemberProfile() {
        return this.request('/member/profile');
    }

    static async getMemberChats() {
        return this.request('/member/chats');
    }

    static async getMemberBiomarkers() {
        return this.request('/member/biomarkers');
    }

    static async getMemberWearables() {
        return this.request('/member/wearables');
    }

    static async getMemberTestReports() {
        return this.request('/member/test-reports');
    }

    static async getMemberDiagnostics() {
        return this.request('/member/diagnostics');
    }

    static async getInternalMetrics() {
        return this.request('/member/internal-metrics');
    }

    static async sendChatQuery(query) {
        return this.request('/chat/query', {
            method: 'POST',
            body: JSON.stringify({ query })
        });
    }

    static async healthCheck() {
        return this.request('/health');
    }
}
