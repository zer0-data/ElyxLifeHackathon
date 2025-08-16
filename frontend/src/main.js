// frontend/src/main.js

import { api } from './api.js';
import { createMemberCard } from './components/MemberCard.js';
import { renderChatView } from './components/ChatView.js';
import { renderBiomarkerChart } from './components/BiomarkerChart.js';
import { renderWhyAgent } from './components/WhyAgent.js';
import { renderInternalMetrics } from './components/InternalMetrics.js';

// Global state
let allMembers = [];
let allChats = [];
let allDecisions = [];
let internalMetrics = null;
let personaSummaries = []; // Not directly used in UI yet, but good to fetch

let selectedMember = null;
let currentActiveTab = 'chats';

// DOM Elements
const memberListDiv = document.getElementById('memberList');
const memberDashboardDiv = document.getElementById('memberDashboard');
const welcomeMessageDiv = document.getElementById('welcomeMessage');
const memberNameHeader = document.getElementById('memberName');

const tabChatsBtn = document.getElementById('tabChats');
const tabBiomarkersBtn = document.getElementById('tabBiomarkers');
const tabWhyAgentBtn = document.getElementById('tabWhyAgent');

const chatsContentDiv = document.getElementById('chatsContent');
const biomarkersContentDiv = document.getElementById('biomarkersContent');
const whyAgentContentDiv = document.getElementById('whyAgentContent');

const showInternalMetricsBtn = document.getElementById('showInternalMetricsBtn');
const internalMetricsModal = document.getElementById('internalMetricsModal');
const closeInternalMetricsModalBtn = document.getElementById('closeInternalMetricsModal');
const internalMetricsContentDiv = document.getElementById('internalMetricsContent');


// --- Utility Functions ---
function showLoading(element) {
    element.innerHTML = '<p class="text-center text-gray-500 py-8">Loading...</p>';
}

function hideAllTabContents() {
    chatsContentDiv.classList.add('hidden');
    biomarkersContentDiv.classList.add('hidden');
    whyAgentContentDiv.classList.add('hidden');
}

function setActiveTab(tabName) {
    currentActiveTab = tabName;
    tabChatsBtn.classList.remove('border-blue-600', 'text-blue-600');
    tabBiomarkersBtn.classList.remove('border-blue-600', 'text-blue-600');
    tabWhyAgentBtn.classList.remove('border-blue-600', 'text-blue-600');

    tabChatsBtn.classList.add('text-gray-600', 'hover:text-blue-600', 'hover:border-blue-600');
    tabBiomarkersBtn.classList.add('text-gray-600', 'hover:text-blue-600', 'hover:border-blue-600');
    tabWhyAgentBtn.classList.add('text-gray-600', 'hover:text-blue-600', 'hover:border-blue-600');

    hideAllTabContents();

    if (tabName === 'chats') {
        tabChatsBtn.classList.add('border-blue-600', 'text-blue-600');
        chatsContentDiv.classList.remove('hidden');
        renderMemberChats(selectedMember);
    } else if (tabName === 'biomarkers') {
        tabBiomarkersBtn.classList.add('border-blue-600', 'text-blue-600');
        biomarkersContentDiv.classList.remove('hidden');
        renderMemberBiomarkers(selectedMember);
    } else if (tabName === 'whyAgent') {
        tabWhyAgentBtn.classList.add('border-blue-600', 'text-blue-600');
        whyAgentContentDiv.classList.remove('hidden');
        renderWhyAgent('whyAgentContainer'); // Re-render why agent UI
    }
}

// --- Render Functions ---

async function renderMemberList() {
    memberListDiv.innerHTML = ''; // Clear loading message
    if (!allMembers || allMembers.length === 0) {
        memberListDiv.innerHTML = '<p class="text-gray-500">No members found.</p>';
        return;
    }
    allMembers.forEach(member => {
        const card = createMemberCard(member, selectMember);
        memberListDiv.appendChild(card);
    });
}

async function selectMember(member) {
    selectedMember = member;
    welcomeMessageDiv.classList.add('hidden');
    memberDashboardDiv.classList.remove('hidden');
    memberNameHeader.textContent = `${member.name}'s Journey`;

    // Reset to chats tab when a new member is selected
    setActiveTab('chats');
}

function renderMemberChats(member) {
    if (!member) return;
    const memberChats = allChats.filter(chat => chat.sender === member.name || chat.sender in ELYX_TEAM_NAMES);
    renderChatView('chatsContent', memberChats, member.name);
}

const ELYX_TEAM_NAMES = {
    "Ruby": true, "Dr. Warren": true, "Advik": true, 
    "Carla": true, "Rachel": true, "Neel": true
};

async function renderMemberBiomarkers(member) {
    if (!member) return;
    const biomarkerChartsContainer = document.getElementById('biomarkerCharts');
    biomarkerChartsContainer.innerHTML = ''; // Clear previous charts

    showLoading(biomarkerChartsContainer);

    // List of common biomarkers to display (adjust based on your simulated data)
    const commonBiomarkers = ['HbA1c', 'BP_Systolic', 'Total_Cholesterol', 'ESR', 'FEV1/FVC_Ratio', 'Sleep_Efficiency', 'HRV', 'Sleep_Score', 'Resting_Heart_Rate'];
    
    // Filter out biomarkers that are not present in the data for this member
    const availableBiomarkers = [];
    for (const bio of commonBiomarkers) {
        const data = await api.getBiomarkers(member.name, bio);
        if (data && data.length > 0) {
            availableBiomarkers.push({ name: bio, data: data });
        }
    }

    if (availableBiomarkers.length === 0) {
        biomarkerChartsContainer.innerHTML = '<p class="text-gray-500 text-center py-8">No biomarker data available for this member.</p>';
        return;
    }

    biomarkerChartsContainer.innerHTML = ''; // Clear loading
    availableBiomarkers.forEach(bio => {
        const chartDiv = document.createElement('div');
        chartDiv.id = `chart-${bio.name}`;
        biomarkerChartsContainer.appendChild(chartDiv);
        renderBiomarkerChart(`chart-${bio.name}`, bio.data, bio.name, member.name);
    });
}


// --- Event Listeners ---
tabChatsBtn.addEventListener('click', () => setActiveTab('chats'));
tabBiomarkersBtn.addEventListener('click', () => setActiveTab('biomarkers'));
tabWhyAgentBtn.addEventListener('click', () => setActiveTab('whyAgent'));

showInternalMetricsBtn.addEventListener('click', async () => {
    internalMetricsModal.classList.remove('hidden');
    showLoading(internalMetricsContentDiv);
    internalMetrics = await api.getInternalMetrics();
    renderInternalMetrics('internalMetricsContent', internalMetrics);
});

closeInternalMetricsModalBtn.addEventListener('click', () => {
    internalMetricsModal.classList.add('hidden');
});

// Close modal when clicking outside (optional)
internalMetricsModal.addEventListener('click', (e) => {
    if (e.target === internalMetricsModal) {
        internalMetricsModal.classList.add('hidden');
    }
});


// --- Initialize App ---
async function initApp() {
    showLoading(memberListDiv);
    
    // Fetch all data concurrently
    const [members, chats, decisions, metrics, summaries] = await Promise.all([
        api.getMembers(),
        api.getChats(),
        api.getDecisions(),
        api.getInternalMetrics(),
        api.getPersonaSummaries()
    ]);

    allMembers = members || [];
    allChats = chats || [];
    allDecisions = decisions || [];
    internalMetrics = metrics;
    personaSummaries = summaries || [];

    renderMemberList();

    // Initial render of Why Agent UI
    renderWhyAgent('whyAgentContainer');
}

// Run the app initialization
initApp();
