// Global variable to store recipes
let recipes = [];

// Load recipes from JSON file
async function loadRecipes() {
    try {
        const response = await fetch('recipes.json');
        if (!response.ok) {
            throw new Error('Failed to load recipes.json');
        }
        recipes = await response.json();
        debugLog('Loaded ' + recipes.length + ' recipes from recipes.json');
        debugLog('Available ingredients: ' + 
            [...new Set(recipes.flatMap(r => r.ingredients))].join(', '));
        return recipes;
    } catch (error) {
        debugLog('Error loading recipes: ' + error.message);
        // Fallback recipes if JSON fails to load
        recipes = [
            {
                id: 1,
                name: "Chicken Rice Bowl",
                ingredients: ["chicken", "rice", "soy sauce", "vegetables"],
                instructions: "Cook rice. Stir-fry chicken with vegetables. Serve over rice with soy sauce.",
                difficulty: "Easy",
                cookTime: "25 minutes"
            },
            {
                id: 2,
                name: "Tomato Pasta",
                ingredients: ["pasta", "tomatoes", "garlic", "olive oil", "basil"],
                instructions: "Boil pasta. Sauté garlic in olive oil. Add tomatoes and basil. Combine with pasta.",
                difficulty: "Easy",
                cookTime: "15 minutes"
            }
        ];
        debugLog('Using fallback recipes');
        return recipes;
    }
}

function debugLog(message) {
    const debugDiv = document.getElementById('debugInfo');
    if (debugDiv) {
        debugDiv.style.display = 'block';
        debugDiv.innerHTML += new Date().toLocaleTimeString() + ': ' + message + '<br>';
    }
    console.log(message);
}

async function searchRecipes() {
    // Ensure recipes are loaded
    if (recipes.length === 0) {
        await loadRecipes();
    }

    const ingredientsInput = document.getElementById('ingredients');
    const inputValue = ingredientsInput.value.trim();
    
    debugLog('Search started with input: "' + inputValue + '"');
    
    if (!inputValue) {
        displayResults([], 'Please enter some ingredients');
        return;
    }

    // Parse ingredients - this is a common source of bugs
    const userIngredients = inputValue.toLowerCase()
        .split(',')
        .map(ingredient => ingredient.trim())
        .filter(ingredient => ingredient.length > 0);

    debugLog('Parsed ingredients: ' + JSON.stringify(userIngredients));

    // Find matching recipes - this logic is critical
    const matchingRecipes = recipes.filter(recipe => {
        const recipeIngredients = recipe.ingredients.map(ing => ing.toLowerCase());
        
        // Check if at least one user ingredient matches any recipe ingredient
        const hasMatch = userIngredients.some(userIng => 
            recipeIngredients.some(recipeIng => 
                recipeIng.includes(userIng) || userIng.includes(recipeIng)
            )
        );
        
        debugLog('Recipe "' + recipe.name + '" match: ' + hasMatch);
        return hasMatch;
    });

    debugLog('Found ' + matchingRecipes.length + ' matching recipes');
    displayResults(matchingRecipes);
}

function displayResults(matchingRecipes, errorMessage = null) {
    const resultsDiv = document.getElementById('results');
    
    if (errorMessage) {
        resultsDiv.innerHTML = '<div class="no-results">' + errorMessage + '</div>';
        return;
    }

    if (matchingRecipes.length === 0) {
        resultsDiv.innerHTML = '<div class="no-results">No recipes found with those ingredients. Try: chicken, rice, tomatoes, pasta, or vegetables</div>';
        return;
    }

    let resultsHTML = '<h2>Found ' + matchingRecipes.length + ' recipe(s):</h2>';
    
    matchingRecipes.forEach(recipe => {
        resultsHTML += `
            <div class="recipe-card" onclick="viewRecipe(${recipe.id})">
                <div class="recipe-title">${recipe.name}</div>
                <div class="recipe-ingredients"><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</div>
                <div class="recipe-meta">
                    <span class="difficulty">Difficulty: ${recipe.difficulty}</span>
                    <span class="cook-time">Time: ${recipe.cookTime || 'N/A'}</span>
                </div>
                <div class="recipe-preview">${recipe.instructions.substring(0, 100)}...</div>
                <div class="view-more">Click to view full recipe →</div>
            </div>
        `;
    });

    resultsDiv.innerHTML = resultsHTML;
}

function viewRecipe(recipeId) {
    // Navigate to recipe.html with the recipe ID
    window.location.href = `recipe.html?id=${recipeId}`;
}

async function loadRecipeDetails(recipeId) {
    // Ensure recipes are loaded first
    if (recipes.length === 0) {
        await loadRecipes();
    }
    
    // Find the recipe by ID
    const recipe = recipes.find(r => r.id == recipeId);
    
    if (!recipe) {
        document.getElementById('recipeDetails').innerHTML = 
            '<div class="no-results">Recipe not found. Available recipe IDs: ' + 
            recipes.map(r => r.id).join(', ') + '</div>';
        return;
    }

    const detailsHTML = `
        <div class="recipe-full">
            <h1>${recipe.name}</h1>
            <div class="recipe-meta">
                <span class="difficulty">Difficulty: ${recipe.difficulty}</span>
                <span class="cook-time">Cook Time: ${recipe.cookTime || 'N/A'}</span>
            </div>
            <div class="recipe-section">
                <h3>Ingredients:</h3>
                <ul class="ingredients-list">
                    ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
            </div>
            <div class="recipe-section">
                <h3>Instructions:</h3>
                <p class="instructions">${recipe.instructions}</p>
            </div>
        </div>
    `;

    document.getElementById('recipeDetails').innerHTML = detailsHTML;
}

function clearResults() {
    const resultsDiv = document.getElementById('results');
    const ingredientsInput = document.getElementById('ingredients');
    const debugDiv = document.getElementById('debugInfo');
    
    if (resultsDiv) resultsDiv.innerHTML = '';
    if (ingredientsInput) ingredientsInput.value = '';
    if (debugDiv) {
        debugDiv.innerHTML = '';
        debugDiv.style.display = 'none';
    }
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        debugLog('Image uploaded: ' + file.name);
        
        // In a real app, you'd send this to Gemini API
        // For now, we'll simulate ingredient detection
        const simulatedIngredients = ['chicken', 'tomatoes', 'onion'];
        const ingredientsInput = document.getElementById('ingredients');
        if (ingredientsInput) {
            ingredientsInput.value = simulatedIngredients.join(', ');
        }
        
        debugLog('Simulated ingredients from image: ' + simulatedIngredients.join(', '));
        
        // Automatically search with detected ingredients
        setTimeout(() => {
            searchRecipes();
        }, 1000);
    }
}

// Load recipes when the page loads
window.addEventListener('load', function() {
    loadRecipes();
});
