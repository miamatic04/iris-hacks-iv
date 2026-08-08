recipe = document.getElementById('recipe')
restriction = document.getElementById('restriction')
rewriteBtn = document.getElementById('rewriteBtn')

rewriteBtn.addEventListener('click', function() {
    console.log(recipe.value)
    console.log(restriction.value)
})