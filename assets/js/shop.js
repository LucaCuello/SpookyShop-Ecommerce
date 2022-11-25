// Filter dropdowns

const colorFilterContainer = document.querySelector(".color-filter"),
  colorFilterTitle = document.querySelector(".color-filter h4"),
  genreFilterContainer = document.querySelector(".genre-filter"),
  genreFilterTitle = document.querySelector(".genre-filter h4"),
  colorForm = document.getElementById("filter-color-form"),
  categoriesForm = document.getElementById("filter-categories-form"),
  productsContainer = document.querySelector(".shop-products"),
  clearFilters = document.querySelector(".clear-filters");

const dropdown = (container, title) => {
  title.addEventListener("click", () => {
    container.classList.toggle("dropdown-closed");
    if (title.innerHTML === `<i class="fa-solid fa-caret-down"></i>By color`) {
      title.innerHTML = `<i class="fa-solid fa-caret-right"></i>By color`;
    } else if (
      title.innerHTML === `<i class="fa-solid fa-caret-right"></i>By color`
    ) {
      title.innerHTML = `<i class="fa-solid fa-caret-down"></i>By color`;
    } else if (
      title.innerHTML === `<i class="fa-solid fa-caret-down"></i>By type`
    ) {
      title.innerHTML = `<i class="fa-solid fa-caret-right"></i>By type`;
    } else if (
      title.innerHTML === `<i class="fa-solid fa-caret-right"></i>By type`
    ) {
      title.innerHTML = `<i class="fa-solid fa-caret-down"></i>By type`;
    }
  });
};

const filterDropdowns = () => {
  dropdown(colorFilterContainer, colorFilterTitle);
  dropdown(genreFilterContainer, genreFilterTitle);
};

// Fetching local json

const fetchproducts = async () => {
  try {
    let getProducts = fetch("assets/json/data.json"),
      products = await (await getProducts).json();
    renderShop(products);
    return products;
  } catch (err) {
    console.log(err);
  }
};

const renderShop = async (products) => {
  let product = await products;
  let card = product.map((item) => renderCard(item)).join("");
  productsContainer.innerHTML = card;
};

const renderCard = (products) => {
  let { title, image, price, color } = products;
  return `<div class="products-card">
  <div class="title">
      <h5>${title}</h5>
  </div>
  <img src="${image}">
  <span class="products-price">
      $${price}
  </span>
  <div class="products-size">
      <select>
          <option selected disabled>Choose a size</option>
          <option>Small</option>
          <option>Medium</option>
          <option>Large</option>
          <option>Extra-Large</option>
      </select>
      <span class="custom-caret">
          <i class="fa-solid fa-caret-down"></i>
      </span>
  </div>
  <div class="products-cart" data-name="${title}" data-image="${image}" data-price="${price}" data-color="${color}">
      <span>Add to cart</span>
      <i class="fa-solid fa-cart-plus"></i>
  </div>
</div>
  `;
};

// Filtering

// Input options

const orange = document.getElementById("orange-cb"),
  black = document.getElementById("black-cb"),
  pink = document.getElementById("pink-cb"),
  sale = document.getElementById("discount-cb"),
  newCollection = document.getElementById("new-cb");

const filterShopByColor = async (products) => {
  let product = await products;

  if (orange.checked) {
    let card = product
      .filter((item) => item.color === "Orange")
      .map((item) => renderCard(item))
      .join("");
    productsContainer.innerHTML = card;
  } else if (black.checked) {
    let card = product
      .filter((item) => item.color === "Black")
      .map((item) => renderCard(item))
      .join("");
    productsContainer.innerHTML = card;
  } else if (pink.checked) {
    let card = product
      .filter((item) => item.color === "Pink")
      .map((item) => renderCard(item))
      .join("");
    productsContainer.innerHTML = card;
  }
};

const filterByCategories = async (products) => {
  let product = await products;

  if (sale.checked) {
    let card = product
      .filter((item) => item.type === "Sale")
      .map((item) => renderCard(item))
      .join("");
    productsContainer.innerHTML = card;
  } else if (newCollection.checked) {
    let card = product
      .filter((item) => item.type === "New")
      .map((item) => renderCard(item))
      .join("");
    productsContainer.innerHTML = card;
  }
};

const showClearFiltersButton = () => {
  clearFilters.style.display = "flex";
  setTimeout(() => {
    clearFilters.style.opacity = "1";
  }, 100);
};

const hideClearFiltersButton = () => {
  clearFilters.style.opacity = "0";
  clearFilters.style.display = "none";
};

const clearFormChecks = () => {
  colorForm.reset();
  categoriesForm.reset();
};

// Cart

const renderMsg = (valid = false, msg = "") => {
  let message = document.querySelector(".msg");
  if (!valid) {
    setTimeout(() => {
      message.style.transform = "translateY(0)";
      message.style.backgroundColor = "#db8d82";
      message.innerHTML = `${msg} <i class="fa-solid fa-circle-xmark"></i>`;
    }, 400);
    setTimeout(() => {
      message.style.transform = "translateY(100%)";
    }, 2000);
  } else {
    setTimeout(() => {
      message.style.transform = "translateY(0)";
      message.style.backgroundColor = "#7db17d";
      message.innerHTML = `${msg} <i class="fa-solid fa-circle-check"></i>`;
    }, 400);
    setTimeout(() => {
      message.style.transform = "translateY(100%)";
    }, 2000);
  }
};

// const saveToLocalStorage = (objectInfo) => {
//   console.log(localStorageCart);
//   console.log(objectInfo);
//   localStorage.setItem("Cart", JSON.stringify(objectInfo));
// };

// const getCartData = () => {
//   document.addEventListener("click", (e) => {
//     if (e.target.classList.contains("products-cart")) {
//       let order = e.target.dataset,
//         size = e.target.parentElement.children[3].children[0].value;
//       if (size === "Choose a size") {
//         renderMsg(false, "Please, select a size");
//       } else {
//         renderMsg(
//           true,
//           `${order.name} (${order.color}) has been added to your cart`
//         );
//         let orderInfo = [
//           ...localStorageCart,
//           {
//             id: localStorageCart.length + 1,
//             title: order.name,
//             price: order.price,
//             image: order.image,
//             size: size,
//           },
//         ];
//       }
//     } else return;
//   });
// };

let localStorageCart = JSON.parse(localStorage.getItem("Cart")) || [];

const createOrderData = (name, price, image, color) => {
  return { name, price, image, color };
};

const addToCart = (e) => {
  if (!e.target.classList.contains("products-cart")) return;
  const { name, price, image, color } = e.target.dataset;
  const product = createOrderData(name, price, image, color);
  let arraytest = [...localStorageCart, product];
  localStorage.setItem("Cart", JSON.stringify(arraytest));
};

const init = () => {
  fetchproducts();
  filterDropdowns();
  // productsContainer.addEventListener("click", addToCart);
  colorForm.addEventListener("change", () => {
    filterShopByColor(fetchproducts());
    showClearFiltersButton();
  });
  categoriesForm.addEventListener("change", () => {
    filterByCategories(fetchproducts());
    showClearFiltersButton();
  });
  clearFilters.addEventListener("click", () => {
    hideClearFiltersButton();
    clearFormChecks();
    renderShop(fetchproducts());
  });
};

init();
