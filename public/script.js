recipe = document.getElementById('recipe')
rewriteBtn = document.getElementById('rewriteBtn')
statusMessage = document.getElementById('statusMessage')
restrictionButtons = document.querySelectorAll('.restriction-btn')

ingredientsList = document.getElementById('ingredientsList')
instructionsList = document.getElementById('instructionsList')
substitutionsList = document.getElementById('substitutionsList')
output = document.getElementById('output')

restrictionButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
        btn.classList.toggle('active')
    })
})

rewriteBtn.addEventListener('click', function() {
    const selectedRestrictions = []
    restrictionButtons.forEach(function(btn) {
        if (btn.classList.contains('active')) {
            selectedRestrictions.push(btn.dataset.value)
        }
    })

    if (selectedRestrictions.length === 0) {
        statusMessage.textContent = 'Please select at least one restriction.'
        return
    }

    statusMessage.textContent = 'Rewriting your recipe...'
    rewriteBtn.disabled = true

    fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipe: recipe.value, restriction: selectedRestrictions })
    })
        .then(res => res.json())
        .then(function(data) {
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