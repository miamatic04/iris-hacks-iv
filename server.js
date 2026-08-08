express = require('express')
app = express()

app.use(express.static('public'))
app.use(express.json())

app.post('/api/rewrite', function(req, res) {
    recipe = req.body.recipe
    restriction = req.body.restriction

    res.json({received: true})
})

app.listen(3000, console.log('Server running on http://localhost:3000'))