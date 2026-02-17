const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Root route - serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ── AI API Proxy Endpoint ──
app.post('/api/ai-call', async (req, res) => {
    try {
        const { mode, prompt, apiKey } = req.body;

        if (!mode || !prompt || !apiKey) {
            return res.status(400).json({ error: 'Missing required fields: mode, prompt, apiKey' });
        }

        let url, headers, payload;

        if (mode === 'anthropic') {
            url = 'https://api.anthropic.com/v1/messages';
            headers = {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            };
            payload = {
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1500,
                messages: [{ role: 'user', content: prompt }]
            };
        } else if (mode === 'openai') {
            url = 'https://api.openai.com/v1/chat/completions';
            headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            };
            payload = {
                model: 'gpt-4o',
                response_format: { type: 'json_object' },
                messages: [
                    { role: 'system', content: 'Expert engineer. JSON only.' },
                    { role: 'user', content: prompt }
                ]
            };
        } else if (mode === 'groq') {
            url = 'https://api.groq.com/openai/v1/chat/completions';
            headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            };
            payload = {
                model: 'mixtral-8x7b-32768',
                response_format: { type: 'json_object' },
                messages: [
                    { role: 'system', content: 'Expert engineer. JSON only.' },
                    { role: 'user', content: prompt }
                ]
            };
        } else {
            return res.status(400).json({ error: 'Invalid mode. Must be anthropic, openai, or groq' });
        }

        // Make the request to the AI API
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        let result;

        if (mode === 'anthropic') {
            result = data.content[0].text;
        } else {
            result = data.choices[0].message.content;
        }

        res.json({ success: true, result });

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message || 'Failed to call AI API'
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Engineering Calculator server running on http://localhost:${PORT}`);
});
