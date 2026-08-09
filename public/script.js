recipe = document.getElementById('recipe')
restriction = document.getElementById('restriction')
rewriteBtn = document.getElementById('rewriteBtn')
statusMessage = document.getElementById('statusMessage')

ingredientsList = document.getElementById('ingredientsList')
instructionsList = document.getElementById('instructionsList')
substitutionsList = document.getElementById('substitutionsList')
output = document.getElementById('output')

rewriteBtn.addEventListener('click', function() {
    statusMessage.textContent = 'Rewriting your recipe...'
    rewriteBtn.disabled = true

    fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipe: recipe.value, restriction: restriction.value })
    })
        .then(res => res.json())
        .then(function(data) {
            // clear old results before rendering new ones
            ingredientsList.innerHTML = ''
            instructionsList.innerHTML = ''
            substitutionsList.innerHTML = ''
            statusMessage.textContent = ''

            data.ingredients.forEach(function(item) {
                const li = document.createElement('li')
                li.textContent = item
                ingredientsList.appendChild(li)
            })

            data.instructions.forEach(function(item) {
                const li = document.createElement('li')
                li.textContent = item
                instructionsList.appendChild(li)
            })

            data.substitutions.forEach(function(sub) {
                const div = document.createElement('div')
                div.innerHTML = `<b>${sub.original} → ${sub.replacement}</b><br>${sub.reason}`
                substitutionsList.appendChild(div)
            })

            output.hidden = false
        })
        .catch(function(err) {
            statusMessage.textContent = 'Something went wrong. Try again.'
            console.error(err)
        })
        .finally(function() {
            rewriteBtn.disabled = false
        })
})