// frontend/src/components/ChatView.js

export function renderChatView(containerId, chats, memberName) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear previous chats

    if (!chats || chats.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">No chat messages found for this member.</p>';
        return;
    }

    // Group chats by date
    const chatsByDate = chats.reduce((acc, chat) => {
        const date = chat.date; // Assuming date is already in YYYY-MM-DD format
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(chat);
        return acc;
    }, {});

    for (const date in chatsByDate) {
        // Date separator
        const dateDiv = document.createElement('div');
        dateDiv.className = 'text-center text-xs text-gray-500 my-4 sticky top-0 bg-gray-50 py-1 rounded-full z-10 shadow-sm';
        dateDiv.textContent = new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        container.appendChild(dateDiv);

        // Messages for the day
        chatsByDate[date].forEach(chat => {
            const isMember = chat.sender === memberName;
            const messageDiv = document.createElement('div');
            messageDiv.className = `flex ${isMember ? 'justify-end' : 'justify-start'} mb-2`;
            messageDiv.innerHTML = `
                <div class="
                    max-w-[70%] p-3 rounded-lg shadow-md relative
                    ${isMember 
                        ? 'bg-blue-500 text-white rounded-br-none' 
                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    }
                ">
                    <p class="font-semibold text-sm mb-1 ${isMember ? 'text-blue-100' : 'text-gray-700'}">
                        ${chat.sender} (${chat.role})
                    </p>
                    <p class="text-base">${chat.text}</p>
                    <span class="absolute bottom-1 ${isMember ? 'left-3 text-blue-200' : 'right-3 text-gray-500'} text-xs opacity-75">
                        ${new Date(chat.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            `;
            container.appendChild(messageDiv);
        });
    }

    // Scroll to the bottom of the chat view
    container.scrollTop = container.scrollHeight;
}
