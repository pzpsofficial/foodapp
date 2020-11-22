let data;
const getData = async () => {
  const response = await axios.get(
    "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
  );

  data = response.data.meals.flat(5);
};

getData();

// FRIDGE FUNCTIONALITY

const ul = document.querySelector("main .ingriedients .items");
const fridgeInput = document.querySelector("input");
const addBtn = document.querySelector("#addIngriedient");
const autoComplete = document.querySelector(".autocomplete");
const root = document.querySelector(".add");
const fridgeMealSearch = document.querySelector("#fridgeMealSearch");
const mealSearch = document.querySelector("#mealSearch");
const main = document.querySelector("main");
const warn = document.querySelector(".warn");

const showMatchingMeals = () => {
  let matchingIngredients;
  if (data && fridgeInput.value.length > 0) {
    const input = fridgeInput.value.toLocaleLowerCase();
    matchingIngredients = data.filter((ingriedient) => {
      if (ingriedient.strIngredient.toLowerCase().indexOf(input) === -1) {
        return;
      } else {
        return ingriedient;
      }
    });
  } else {
    matchingIngredients = [];
  }
  showAutoComplete(matchingIngredients);
};

// Input functionality

let inter = null;
fridgeInput.addEventListener("input", () => {
  if (inter) {
    clearTimeout(inter);
  }
  inter = setTimeout(() => {
    showMatchingMeals();
  }, 1000);
});

// showAutoComplete

const showAutoComplete = (arr) => {
  autoComplete.innerHTML = "";

  let elementsToAdd = [];
  if (arr.length > 0) {
    arr.forEach((el) => {
      const p = document.createElement("p");
      p.innerText = el.strIngredient;
      elementsToAdd.push(p);
    });

    elementsToAdd.forEach((el) => {
      el.addEventListener("click", () => {
        fridgeInput.value = el.innerText;
      });
      autoComplete.prepend(el);
    });
  }
};

// Hiding autocomplete

document.addEventListener("click", (e) => {
  if (!root.contains(e.target)) {
    autoComplete.classList.remove("autoShow");
  }
});

fridgeInput.addEventListener("focus", () => {
  autoComplete.classList.add("autoShow");
});

// Add btn functionality

addBtn.addEventListener("click", () => {
  if (fridgeInput.value) {
    createFridgeItem();
    addBtnsClicks();
  }
});

const createFridgeItem = () => {
  autoComplete.classList.remove("autoShow");
  const li = document.createElement("li");
  li.innerHTML = `
      <div class="item">
        <p><i class="fas fa-circle"></i>${fridgeInput.value}</p>
        <div class="btns">
          <button class="delete"><i class="fas fa-minus"></i></button><button class="color favourite"><i class="fas fa-crown"></i>
        </div>
      </div>    
    `;
  ul.prepend(li);
  fridgeInput.value = "";
  autoComplete.innerHTML = "";
};

const addBtnsClicks = () => {
  const rem = document.querySelectorAll(".delete")[0];
  rem.addEventListener("click", () => {
    rem.parentElement.parentElement.parentElement.remove();
  });
  const fav = document.querySelectorAll(".favourite")[0];
  fav.addEventListener("click", () => {
    checkFavs();
    fav.classList.add("favouriteActive");
  });
};

const checkFavs = () => {
  const favs = document.querySelectorAll(".favourite");
  favs.forEach((el) => {
    el.classList.remove("favouriteActive");
  });
};

// Make a request for a meal based on a main ingredient

const getMeal = () => {
  const meal = document
    .querySelector(".favouriteActive")
    .parentElement.parentElement.children[0].innerText.toLowerCase()
    .replace(/\s/g, "_");
  axios
    .get(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${meal}`)
    .then(async (res) => {
      let num = Math.floor(Math.random() * res.data.meals.length);
      const meal = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${res.data.meals[num].idMeal}`
      );
      showMealToTheUser(meal);
    });
};

const getRandomMeal = async () => {
  const meal = await axios.get(
    "https://www.themealdb.com/api/json/v1/1/random.php"
  );
  showMealToTheUser(meal);
};

const showMealToTheUser = (meal) => {
  if (document.querySelector(".meal")) {
    document.querySelector(".meal").remove();
  }
  const mealData = meal.data.meals[0];
  const mealSection = document.createElement("section");
  mealSection.classList.add("meal");
  const createTable = () => {
    const table = document.createElement("table");
    const caption = document.createElement("caption");
    caption.innerText = "Ingriedients";
    table.prepend(caption);
    for (let i = 1; i < 20; i++) {
      if (mealData[`strIngredient${i}`]) {
        const row = document.createElement("tr");
        const td = document.createElement("td");
        td.innerText = mealData[`strIngredient${i}`];
        row.append(td);
        const td2 = document.createElement("td");
        td2.innerText = mealData[`strMeasure${i}`];
        row.append(td2);
        table.append(row);
      }
    }
    return table;
  };

  const ingredientsRow = createTable();

  mealSection.innerHTML = `
    <h2>${mealData.strMeal}</h2>
    <div class="mealImg">
      <img alt="Meal photo" src="${mealData.strMealThumb}">
    </div>
    <div class="howTo">
      <h3>Receipt</h3>
      <p>${mealData.strInstructions}</p>
    </div>   
  `;
  mealSection.append(ingredientsRow);
  main.insertAdjacentElement("beforeend", mealSection);
};

fridgeMealSearch.addEventListener("click", () => {
  if (document.querySelector(".favouriteActive")) {
    getMeal();
    warnFunc("warnGreen", "Scroll down! Your meal is waiting!");
  } else {
    warnFunc(
      "warnRed",
      "We couldn't find favourite ingriedient in your fridge!"
    );
  }
});

mealSearch.addEventListener("click", () => {
  getRandomMeal();
  warnFunc("warnGreen", "Scroll down! Your meal is waiting!");
});

// handle warn

const warnFunc = (clas, text) => {
  warn.innerText = text;
  warn.classList.add(clas);
  setTimeout(() => {
    warn.classList.remove(clas);
  }, 3000);
};
