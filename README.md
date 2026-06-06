# Mental Health Companion Chatbot

It  is a simple AI-powered student support chatbot built with HTML, CSS, vanilla JavaScript, Node.js, Express, Axios, dotenv, Gemini, and JSON file storage.

It supports students with exam stress, academic pressure, motivation, time management, study planning, focus, confidence, and feeling overwhelmed. It is a supportive student mentor and study coach, not a therapist.

## Features

- AI chat powered by Google Gemini
- Mood detection for emotion and pressure level
- Pressure meter: Low, Moderate, High
- JSON chat history in `data/chats.json`
- Crisis keyword detection with emergency support messaging
- Single-page responsive UI

## Setup

```bash
npm install
```

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

Start the app:

```bash
npm start
```

Open:

```text
http://localhost:5000
```

## Project Structure

```text
student-burnout-assistant/
public/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
routes/
├── chat.js
services/
├── geminiService.js
data/
├── chats.json
.env.example
server.js
package.json
README.md
```
## Demo

<img width="1918" height="923" alt="Screenshot 2026-06-06 225518" src="https://github.com/user-attachments/assets/36b66efc-b658-4297-a2cc-b1e75693b46e" />





---

## Deploy Link
https://mental-health-companion-chatbot-nep6.onrender.com/


