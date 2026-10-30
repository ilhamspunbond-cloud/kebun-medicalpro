// ==========================================
// CHAT.JS - Permanent Cloud Chat Logic
// ==========================================

const ChatManager = {
    sendMessage(text, senderName = 'Abdul Rojak') {
        if (!text.trim()) return;

        const chatMessage = {
            id: 'MSG-' + Date.now(),
            sender: senderName,
            text: text.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        AppState.data.chatMessages.push(chatMessage);
        saveAppData();
        this.renderChatMessages();
    },

    renderChatMessages() {
        const container = document.getElementById('chat-messages-box');
        if (!container) return;

        container.innerHTML = '';
        AppState.data.chatMessages.forEach(msg => {
            const isMe = msg.sender === AppState.user.name;
            const bubble = document.createElement('div');
            bubble.className = `flex flex-col my-2 ${isMe ? 'items-end' : 'items-start'}`;
            bubble.innerHTML = `
                <span class="text-xs text-gray-400 mb-1">${msg.sender} • ${msg.timestamp}</span>
                <div class="p-3 rounded-lg max-w-[75%] ${isMe ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-100 rounded-bl-none'}">
                    ${msg.text}
                </div>
            `;
            container.appendChild(bubble);
        });
        scrollToBottomChat();
    }
};

function scrollToBottomChat() {
    const container = document.getElementById('chat-messages-box');
    if (container) {
        container.scrollTop = container.scrollHeight;
    }
}
