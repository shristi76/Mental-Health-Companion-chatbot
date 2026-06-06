const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const chatMessages = document.getElementById('chatMessages');
const pressureMeter = document.getElementById('pressureMeter');
const pressureIcon = document.getElementById('pressureIcon');
const pressureText = document.getElementById('pressureText');
const quickButtons = document.querySelectorAll('.quick-help button');

const pressureStyles = {
  low: { label: 'Low', icon: '🟢', className: 'pressure-low' },
  moderate: { label: 'Moderate', icon: '🟡', className: 'pressure-moderate' },
  high: { label: 'High', icon: '🔴', className: 'pressure-high' }
};

function addMessage(role, text, options = {}) {
  const message = document.createElement('article');
  message.className = `message ${role === 'user' ? 'user-message' : 'bot-message'} ${
    options.typing ? 'typing' : ''
  }`;

  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  avatar.textContent = role === 'user' ? 'You' : 'AI';

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;

  message.append(avatar, bubble);
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return message;
}

function setPressure(pressure) {
  const key = String(pressure || 'low').toLowerCase();
  const style = pressureStyles[key] || pressureStyles.low;

  pressureMeter.className = `pressure-meter ${style.className} updated`;
  pressureIcon.textContent = style.icon;
  pressureText.textContent = style.label;

  window.setTimeout(() => pressureMeter.classList.remove('updated'), 220);
}

function setLoading(isLoading) {
  messageInput.disabled = isLoading;
  chatForm.querySelector('button').disabled = isLoading;
  quickButtons.forEach((button) => {
    button.disabled = isLoading;
  });
}

async function sendMessage(message) {
  const trimmed = message.trim();
  if (!trimmed) return;

  addMessage('user', trimmed);
  messageInput.value = '';
  setLoading(true);

  const typingMessage = addMessage('bot', 'Thinking through this with you...', {
    typing: true
  });

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: trimmed })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong.');
    }

    typingMessage.remove();
    addMessage('bot', data.response);
    setPressure(data.pressure);
  } catch (error) {
    typingMessage.remove();
    addMessage(
      'bot',
      error.message || 'I could not respond right now. Please try again in a moment.'
    );
  } finally {
    setLoading(false);
    messageInput.focus();
  }
}

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  sendMessage(messageInput.value);
});

quickButtons.forEach((button) => {
  button.addEventListener('click', () => {
    sendMessage(button.dataset.prompt);
  });
});
