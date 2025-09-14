let recipes = [];

// Load recipe database
fetch("recipes.json")
  .then(res => res.json())
  .then(data => { recipes = data; displayRecipes(recipes); });

function searchRecipes() {
  const search = document.getElementById("searchBar").value.toLowerCase();
  const region = document.getElementById("regionFilter").value;
  const type = document.getElementById("typeFilter").value;

  const results = recipes.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(search) ||
                          r.ingredients.some(i => i.toLowerCase().includes(search));
    const matchesRegion = region ? r.region === region : true;
    const matchesType = type ? r.type === type : true;
    return matchesSearch && matchesRegion && matchesType;
  });

  displayRecipes(results);
}

function displayRecipes(list) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  if (list.length === 0) {
    resultsDiv.innerHTML = "<p>No recipes found.</p>";
    return;
  }

  list.forEach(r => {
    const div = document.createElement("div");
    div.className = "recipe";
    div.innerHTML = `
      <h2>${r.name}</h2>
      <p><b>Region:</b> ${r.region} | <b>Type:</b> ${r.type}</p>
      <p><b>Ingredients:</b> ${r.ingredients.join(", ")}</p>
      <a href="recipe.html?id=${r.id}">View Full Recipe</a>
    `;
    resultsDiv.appendChild(div);
  });
}