// frontend/src/components/MemberCard.js

export function createMemberCard(member, onClick) {
    const card = document.createElement('div');
    card.className = `
        bg-white p-4 rounded-lg shadow-sm cursor-pointer 
        hover:bg-blue-50 hover:shadow-md transition duration-200 ease-in-out
        border border-gray-200
    `;
    card.innerHTML = `
        <h3 class="text-lg font-semibold text-blue-700">${member.name}</h3>
        <p class="text-sm text-gray-600">${member.occupation}</p>
        <p class="text-xs text-gray-500">Condition: ${member.chronic_condition}</p>
    `;
    card.onclick = () => onClick(member);
    return card;
}
