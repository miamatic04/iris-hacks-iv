require('dotenv').config()

express = require('express')
app = express()

app.use(express.static('public'))
app.use(express.json())

app.post('/api/rewrite', async function(req, res) {
    recipe = req.body.recipe
    restriction = req.body.restriction

    const prompt = `You are a culinary science assistant. Rewrite the following recipe to be ${restriction}.

Recipe:
"""
${recipe}
"""
Check every single ingredient for compliance with the restriction — do not skip any, including eggs, dairy, and hidden animal products.

Return ONLY valid JSON, no markdown fences, no extra text, matching exactly this shape:
{
  "ingredients": ["string", ...],
  "instructions": ["string", ...],
  "substitutions": [
    { "original": "string", "replacement": "string", "reason": "string" }
  ]
}`
    console.log(prompt)
    try {
        const response = await fetch('https://api.featherless.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.FEATHERLESS_API_KEY}`
            },
            body: JSON.stringify({
                model: 'Qwen/Qwen2.5-7B-Instruct',
                messages: [{ role: 'user', temperature: 0.2, content: prompt }]
            })
        })

        const data = await response.json()
        const raw = data.choices[0].message.content
        const cleaned = raw.replace(/```json|```/g, '').trim()
        const parsed = JSON.parse(cleaned)

        res.json(parsed)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'AI call failed' })
    }
})

app.listen(3000, () => console.log('Server running on http://localhost:3000'))