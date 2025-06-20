const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';

  // Simulasi dummy balasan bot (placeholder)
  // setTimeout(() => {
  //   appendMessage('bot', 'Gemini is thinking... (this is dummy response)');
  // }, 1000);

  // Tampilkan pesan "Gemini is thinking..." saat menunggu respons
    const thinkingMessage = appendMessage('bot', 'Gemini is thinking...');

     try {
        const response = await fetch('/api/chat', { // Gunakan fetch untuk mengirim permintaan ke backend
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userMessage })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Hapus pesan "Gemini is thinking..."
        chatBox.removeChild(thinkingMessage);

        // Tampilkan balasan dari Gemini
        appendMessage('bot', data.reply);

    } catch (error) {
        console.error('Error fetching chat response:', error);
        // Hapus pesan "Gemini is thinking..." jika ada error
        if (thinkingMessage && chatBox.contains(thinkingMessage)) {
            chatBox.removeChild(thinkingMessage);
        }
        appendMessage('bot', 'Oops! Something went wrong. Please try again.');
    }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}
