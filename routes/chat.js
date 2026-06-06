const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const { getStudentMindResponse, isCrisisMessage } = require('../services/geminiService');

const router = express.Router();
const chatsPath = path.join(__dirname, '..', 'data', 'chats.json');

async function readChats() {
  try {
    const file = await fs.readFile(chatsPath, 'utf8');
    return JSON.parse(file);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

async function saveChat(entry) {
  const chats = await readChats();
  chats.push(entry);
  await fs.writeFile(chatsPath, JSON.stringify(chats, null, 2));
}

router.post('/', async (req, res) => {
  const userMessage = String(req.body.message || '').trim();

  if (!userMessage) {
    return res.status(400).json({ error: 'Please send a message.' });
  }

  try {
    let result;

    if (isCrisisMessage(userMessage)) {
      result = {
        emotion: 'Overwhelmed',
        pressure: 'High',
        response:
          'I am really sorry you are feeling this much pain. I cannot provide crisis counseling, but your safety matters right now. Please contact local emergency services immediately, call or text 988 if you are in the U.S. or Canada, or reach out to a trusted person near you now. If you may hurt yourself, move away from anything dangerous and get urgent help.'
      };
    } else {
      result = await getStudentMindResponse(userMessage);
    }

    await saveChat({
      timestamp: new Date().toISOString(),
      userMessage,
      emotion: result.emotion,
      pressure: result.pressure,
      botResponse: result.response
    });

    return res.json(result);
  } catch (error) {
    console.error('Chat route error:', error.message);
    return res.status(500).json({
      error: 'StudentMind AI could not respond right now. Please try again shortly.'
    });
  }
});

router.get('/history', async (req, res) => {
  try {
    const chats = await readChats();
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Could not load chat history.' });
  }
});

module.exports = router;
