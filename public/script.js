recipe = document.getElementById('recipe')
restriction = document.getElementById('restriction')
rewriteBtn = document.getElementById('rewriteBtn')

rewriteBtn.addEventListener('click', function() {
    console.log(recipe.value)
    console.log(restriction.value)

    fetch('/api/rewrite', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({recipe : recipe.value, restriction: restriction.value})
    })
        .then(res => res.json())
        .then(data => console.log(data))
})

