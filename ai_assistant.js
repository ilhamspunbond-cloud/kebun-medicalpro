// ==========================================
// AI_ASSISTANT.JS - AI Voice & Cloud Memory Logic
// ==========================================

class AIAssistantManager {
    constructor() {
        this.synth = window.speechSynthesis;
        this.recognition = null;
        this.isListening = false;
        this.setupSpeechRecognition();
    }

    setupSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.lang = 'ms-MY';
            this.recognition.continuous = false;
            this.recognition.interimResults = false;

            this.recognition.onresult = (event) => {
                const speechText = event.results[0][0].transcript;
                console.log("Suara dikesan:", speechText);
                const inputEl = document.getElementById('ai-chat-input');
                if (inputEl) inputEl.value = speechText;
                this.handleAIQuery(speechText);
            };

            this.recognition.onerror = (event) => {
                console.error("Ralat pengecaman suara:", event.error);
                this.stopListening();
            };

            this.recognition.onend = () => {
                this.stopListening();
            };
        } else {
            console.warn("Pelayar tidak menyokong pengecaman suara.");
        }
    }

    startListening() {
        if (this.recognition && !this.isListening) {
            try {
                this.recognition.start();
                this.isListening = true;
                updateMicUI(true);
            } catch (e) {
                console.error(e);
            }
        }
    }

    stopListening() {
        this.isListening = false;
        updateMicUI(false);
    }

    speak(text) {
        if (this.synth) {
            this.synth.cancel(); // Hentikan suara sebelumnya
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ms-MY';
            utterance.rate = 1.0;
            this.synth.speak(utterance);
        }
    }

    handleAIQuery(prompt) {
        if (!prompt.trim()) return;
        
        // Tambah mesej user ke UI
        appendAIMessage('user', prompt);
        
        // Proses respons pintar berdasarkan kata kunci ladang
        let response = "Baik Bro, arahan diterima dan sedang diproses sistem.";
        const lower = prompt.toLowerCase();

        if (lower.includes('stok') || lower.includes('baja')) {
            response = "Semakan stok baja dan nutrisi organik di gudang sedang dikemas kini.";
        } else if (lower.includes('tuai') || lower.includes('belimbing')) {
            response = "Jadual tuaian belimbing buluh untuk proses teh dan essence berjalan lancar.";
        } else if (lower.includes('kewangan') || lower.includes('belanja')) {
            response = "Rekod perbelanjaan bulanan ladang telah direkodkan ke dalam sistem.";
        }

        setTimeout(() => {
            appendAIMessage('ai', response);
            this.speak(response);
            saveMemoryToCloud(prompt, response);
        }, 600);
    }
}

function updateMicUI(active) {
    const micBtn = document.getElementById('mic-button-ui');
    if (micBtn) {
        if (active) {
            micBtn.classList.add('bg-red-500', 'animate-pulse');
        } else {
            micBtn.classList.remove('bg-red-500', 'animate-pulse');
        }
    }
}

function appendAIMessage(sender, text) {
    const container = document.getElementById('ai-messages-container');
    if (!container) return;
    const div = document.createElement('div');
    div.className = `p-3 rounded-lg my-2 max-w-[80%] ${sender === 'user' ? 'ml-auto bg-blue-600 text-white' : 'mr-auto bg-gray-700 text-gray-200'}`;
    div.innerText = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function saveMemoryToCloud(query, response) {
    const memoryItem = { timestamp: new Date().toISOString(), query, response };
    let memories = JSON.parse(localStorage.getItem('medical_pro_ai_memories') || '[]');
    memories.push(memoryItem);
    localStorage.setItem('medical_pro_ai_memories', JSON.stringify(memories));
}

const aiManager = new AIAssistantManager();
