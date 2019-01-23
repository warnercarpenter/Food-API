masterDiv = document.createElement("div")
masterDiv.setAttribute("class", "foodList")
masterDiv.setAttribute("id", "masterDiv")
document.body.appendChild(masterDiv)

fetch("http://localhost:8088/foods")
    .then(response => response.json())
    .then(myParsedFoods => {
        myParsedFoods.forEach(food => {
            // Now fetch the food from the Food API
            fetch(`https://world.openfoodfacts.org/api/v0/product/${food.barcode}.json`)
                .then(response => response.json())
                .then(productInfo => {
                    food.ingredients = productInfo.product.ingredients
                    food.countriesSoldIn = productInfo.product.countries_tags
                    food.calories = productInfo.product.nutriments.energy_100g
                    food.fat = productInfo.product.nutriments.fat_100g
                    food.sugar = productInfo.product.nutriments.sugars_value
                    // Produce HTML representation
                    foodFactory(food)
                })
        })
    })

const foodFactory = (food) => {
    foodContainer = document.createElement("div")
    foodContainer.setAttribute("class", "foodContainer")
    foodHeader = document.createElement("h1")
    foodHeader.innerHTML = food.name
    foodEthnicity = document.createElement("p")
    foodEthnicity.innerHTML = `<strong>Origin:</strong><br/>${food.ethnicity}`
    foodCategory = document.createElement("p")
    foodCategory.innerHTML = `<strong>Type:</strong><br/>${food.category}`
    foodIngredients = document.createElement("ul")
    foodIngredients.setAttribute("id", `"${food.name}Ingredients"`)
    foodIngredients.innerHTML = "<strong>Ingredients:</strong>"
    let checkDuplicate = []
    food.ingredients.forEach(ingredient => {
        foodLengthCheck = ingredient.text.split(" ")
        if (foodLengthCheck.length > 4) { return }
        let listItem = document.createElement("li")
        ingredientFixed = ingredient.text.split("_").join(" ")
        ingredientUpper = ingredientFixed.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
        if (ingredientUpper.charAt(0) != "E" && isNaN(ingredientUpper.charAt(1)) === true && checkDuplicate.includes(ingredientUpper) === false) {
            listItem.innerHTML = ingredientUpper
            foodIngredients.appendChild(listItem)
            checkDuplicate.push(ingredientUpper)
        }
    })
    foodCountries = document.createElement("ul")
    foodCountries.innerHTML = "<strong>Countries sold in:</strong><br/>"
    food.countriesSoldIn.forEach(country => {
        countrySplit = country.split(":")[1]
        countrySplitFixed = countrySplit.split("-").join(" ")
        countrySplitUpper = countrySplitFixed.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
        let listItem = document.createElement("li")
        listItem.innerHTML = countrySplitUpper
        foodCountries.appendChild(listItem)
    })
    foodCalories = document.createElement("p")
    foodCalories.innerHTML = `<strong>Calories per 100g:</strong><br/>${food.calories}`
    foodFat = document.createElement("p")
    foodFat.innerHTML = `<strong>Fat per 100g:</strong><br/>${food.fat}`
    foodSugar = document.createElement("p")
    foodSugar.innerHTML = `<strong>Sugar per 100g:</strong><br/>${food.sugar}`
    foodContainer.appendChild(foodHeader)
    foodContainer.appendChild(foodEthnicity)
    foodContainer.appendChild(foodCategory)
    foodContainer.appendChild(foodCountries)
    foodContainer.appendChild(foodCalories)
    foodContainer.appendChild(foodFat)
    foodContainer.appendChild(foodSugar)
    foodContainer.appendChild(foodIngredients)
    masterDiv.appendChild(foodContainer)
}