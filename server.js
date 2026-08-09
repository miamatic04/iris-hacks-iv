require('dotenv').config()

express = require('express')
app = express()

app.use(express.static('public'))
app.use(express.json())

app.post('/api/rewrite', async function(req, res) {
    recipe = req.body.recipe
    restriction = req.body.restriction  // now an array, e.g. ["vegan", "gluten-free"]

    const restrictionText = Array.isArray(restriction) ? restriction.join(', ') : restriction

    const prompt = `You are a culinary science assistant. Rewrite the following recipe to satisfy ALL of these dietary restrictions: ${restrictionText}.

Recipe:
"""
${recipe}
"""

Check every single ingredient against every restriction listed — do not skip any, including hidden animal products, gluten, dairy, or nuts. This includes indirect cases like chocolate chips that may contain milk, or "natural flavoring" that may be non-vegan.

Eggs do not contain dairy.

Only include an item in "substitutions" if the ingredient was actually changed. Do NOT include unchanged ingredients with invented justifications.

For "reason", write a full sentence explaining the food-science or dietary reasoning behind the swap — not a single word or category label. For example: "Butter is not vegan-friendly since it's made from dairy; vegan butter is a plant-based alternative with a similar fat content for texture." A reason like "vegan" or "gluten-free" alone is NOT acceptable and must be expanded into a real explanation.

CRITICAL CONSISTENCY RULE: the "ingredients" list, the "instructions" text, and the "substitutions" list must all agree with each other. Every ingredient mentioned in "instructions" MUST appear in "ingredients" with a specific quantity — never mention an ingredient in the instructions that isn't listed with an amount in the ingredients list. If an ingredient is replaced, the "ingredients" list must show the replacement (with quantity), the "instructions" must refer to the replacement by name only (not "eggs (replaced with aquafaba)" — just say "aquafaba"), and it must also appear in "substitutions".

Before responding, double check: does every ingredient named in your instructions have a matching entry with a quantity in your ingredients list? If not, fix it before returning your answer.

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
                model: 'deepseek-ai/DeepSeek-V3-0324',
                temperature: 0.2,
                messages: [{ role: 'user', content: prompt }]
            })
        })

        const data = await response.json()
        console.log('Featherless response:', JSON.stringify(data, null, 2))
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