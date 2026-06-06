const axios = require('axios');

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const SYSTEM_PROMPT = `You are StudentMind AI.

You are a supportive student mentor.

You help students manage stress, pressure, motivation and study challenges.

tell the quotes that motivates the student

Always:
- Be supportive
- Give practical advice
- Keep responses under 150 words
- Never diagnose mental health conditions
- Speak in a warm, friendly, simple way`;

const crisisTerms = [
  'suicide',
  'self-harm',
  'self harm',
  'wanting to die',
  'want to die',
  'hurting myself',
  'hurt myself',
  'kill myself'
];

function isCrisisMessage(message) {
  const normalized = String(message || '').toLowerCase();

  return crisisTerms.some(term => normalized.includes(term));
}

function detectFallbackEmotion(message) {
  const text = String(message || '').toLowerCase();

  if (text.includes('overwhelmed')) return 'Overwhelmed';

  if (
    text.includes('anxious') ||
    text.includes('anxiety') ||
    text.includes('worried') ||
    text.includes('worry')
  ) {
    return 'Anxious';
  }

  if (
    text.includes('motivated') ||
    text.includes('motivation')
  ) {
    return 'Motivated';
  }

  if (text.includes('sad')) return 'Sad';

  if (
    text.includes('frustrated') ||
    text.includes('angry')
  ) {
    return 'Frustrated';
  }

  if (
    text.includes('happy') ||
    text.includes('excited')
  ) {
    return 'Happy';
  }

  return 'Stressed';
}

function detectFallbackPressure(message) {
  const text = String(message || '').toLowerCase();

  if (
    text.includes('overwhelmed') ||
    text.includes('panic') ||
    text.includes('too much') ||
    text.includes('cannot handle') ||
    text.includes("can't handle")
  ) {
    return 'High';
  }

  if (
    text.includes('stress') ||
    text.includes('stressed') ||
    text.includes('exam') ||
    text.includes('pressure') ||
    text.includes("can't focus")
  ) {
    return 'Moderate';
  }

  return 'Low';
}

async function getStudentMindResponse(userMessage) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Missing GEMINI_API_KEY in .env');
  }

  const prompt = `${SYSTEM_PROMPT}

Student message:
"${userMessage}"

Reply directly to the student.

Rules:
- Under 150 words
- Friendly and supportive
- Give practical advice
- Include one small action step
- Do not return JSON
- Do not include labels like Emotion or Pressure`;

  const { data } = await axios.post(
    GEMINI_API_URL,
    {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 250
      }
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY
      },
      timeout: 20000
    }
  );

  const response =
    data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
    'I hear you. Try focusing on one small task for 10 minutes, then take a short break. Small steps can build momentum.';

  return {
    emotion: detectFallbackEmotion(userMessage),
    pressure: detectFallbackPressure(userMessage),
    response
  };
}

module.exports = {
  SYSTEM_PROMPT,
  getStudentMindResponse,
  isCrisisMessage
};