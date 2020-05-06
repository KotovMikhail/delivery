'use strict';

const cartButton = document.querySelector("#cart-button"),
  modal = document.querySelector(".modal"),
  close = document.querySelector(".close"),
  buttonAuth = document.querySelector('.button-auth'),
  modalAuth = document.querySelector('.modal-auth'),
  closeAuth = document.querySelector('.close-auth'),
  logInForm = document.querySelector('#logInForm'),
  loginInput = document.querySelector('#login'),
  userName = document.querySelector('.user-name'),
  buttonOut = document.querySelector('.button-out'),
  loginError = logInForm.querySelector('.login-error'),
  cardsRestaurants = document.querySelector('.cards-restaurants'),
  containerPromo = document.querySelector('.container-promo'),
  restaurants = document.querySelector('.restaurants'),
  menu = document.querySelector('.menu'),
  logo = document.querySelector('.logo'),
  cardsMenu = document.querySelector('.cards-menu'),
  sectionHeading = menu.querySelector('.section-heading'),
  inputSearch = document.querySelector('.input-search'),

  restaurantTitle = document.querySelector('.restaurant-title'),
  rating = document.querySelector('.rating'),
  minPrice = document.querySelector('.price'),
  category = document.querySelector('.category'),

  modalBody = document.querySelector('.modal-body'),
  modalPricetag = document.querySelector('.modal-pricetag'),
  buttonClearCart = document.querySelector('.clear-cart');

let login = localStorage.getItem('Delivery');

const cart = [];



const loadCart = function () {
  if (localStorage.getItem(login)) {
    cart.push(...JSON.parse(localStorage.getItem(login)));
  }
}



const saveCart = function () {
  localStorage.setItem(login, JSON.stringify(cart));
};

// Запрос к серверу

const getData = async function (url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`$Ошибка по адресу ${url},
     статус ошибки ${response.status}!`)
  }
  return await response.json()
};

// Проверка логина

const valid = function (str) {
  const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  return nameReg.test(str);
};

// Отображение модального окна

const toggleModal = function () {
  modal.classList.toggle("is-open");
};

// Отображение окна авторизации

const toggleModalAuth = function () {
  modalAuth.classList.toggle("is-open");
  loginInput.style.borderColor = '';
  loginError.style.display = 'none';
};

// Возвращает первоначальное отображение главной страницы

const returnMain = function () {
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
  sectionHeading.textContent = '';
};

// Функция авторизации

const authorized = function () {
  const logOut = function () {
    cart.length = 0;
    login = null;
    localStorage.removeItem('Delivery');
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    cartButton.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    checkAuth();
    returnMain();
  };

  userName.textContent = login;
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  cartButton.style.display = 'flex';
  buttonOut.style.display = 'flex';
  buttonOut.addEventListener('click', logOut)
  loadCart();
};

// Функция неавторизации

const notAuthorized = function () {
  const logIn = function (event) {
    event.preventDefault();

    if (valid(loginInput.value)) {
      login = loginInput.value;
      localStorage.setItem('Delivery', login);
      toggleModalAuth();
      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click', toggleModalAuth);
      logInForm.removeEventListener('submit', logIn);
      logInForm.reset();
      checkAuth();
    } else {
      loginInput.style.borderColor = 'tomato';
      loginError.style.display = 'block';
      loginInput.value = '';
    }
  };

  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn);
};

// Проверка авторизации

const checkAuth = function () {
  if (login) {
    authorized()
  } else {
    notAuthorized()
  }
};

// Создаёт карточку ресторана

const createCardRestaurant = function ({image, kitchen, name, price, products, stars, time_of_delivery: timeOfDelivery}) {

  const card = document.createElement('a');
  card.className = 'card card-restaurant';
  card.products = products;
  card.info = [name, price, stars, kitchen];

  card.insertAdjacentHTML('beforeend', `
      <img src="${image}" alt="${name}" class="card-image"/>
      <div class="card-text">
          <div class="card-heading">
              <h3 class="card-title">${name}</h3>
              <span class="card-tag tag">${timeOfDelivery}</span>
          </div>
          <div class="card-info">
              <div class="rating">${stars}</div>
              <div class="price">От ${price} ₽</div>
              <div class="category">${kitchen}</div>
          </div>
      </div>
  `);
  cardsRestaurants.insertAdjacentElement('beforeend', card);
};


// Создаёт карточку товара

const createCardGood = function ({description, id, image, name, price}) {
  const card = document.createElement('div');
  card.className = 'card';

  card.insertAdjacentHTML('beforeend', `
        <img src="${image}" alt="${name}" class="card-image"/>
        <div class="card-text">
            <div class="card-heading">
                <h3 class="card-title card-title-reg">${name}</h3>
            </div>
            <div class="card-info">
                <div class="ingredients">${description}</div>
            </div>
            <div class="card-buttons">
                <button class="button button-primary button-add-cart" id="${id}">
                    <span class="button-card-text">В корзину</span>
                    <span class="button-cart-svg"></span>
                </button>
                <strong class="card-price card-price-bold">${price} ₽</strong>
            </div>
        </div>
    `);
  cardsMenu.insertAdjacentElement('beforeend', card);
};

// Создаёт меню ресторана, если пользователь авторизован

const openGoods = function (event) {
  const target = event.target;

  if (login) {
    const restaurant = target.closest('.card-restaurant');

    if (restaurant) {
      const [name, price, stars, kitchen] = restaurant.info;

      cardsMenu.textContent = '';
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');

      restaurantTitle.textContent = name;
      rating.textContent = stars;
      minPrice.textContent = `От ${price} ₽`;
      category.textContent = kitchen;

      getData(`./db/${restaurant.products}`)
        .then(function (data) {
          data.forEach(createCardGood)
        });

    } else {
      toggleModalAuth();
    }
  }
};



// Добавляет товары в корзину
const addToCart = function (event) {
  const target = event.target;

  const buttonAddToCart = target.closest('.button-add-cart');

  if (buttonAddToCart) {
    const card = target.closest('.card')
    const title = card.querySelector('.card-title-reg').textContent;
    const cost = card.querySelector('.card-price').textContent;
    const id = buttonAddToCart.id;

    const food = cart.find(function (item) {
      return item.id === id;
    });

    if (food) {
      food.count += 1;
    } else {
      cart.push({
        id,
        title,
        cost,
        count: 1
      });
    }
  }

  saveCart();

};

// Рендер товаров в корзине
const renderCart = function () {
  modalBody.textContent = '';
  // cart = JSON.parse(localStorage.getItem('cart'));

  cart.forEach(function ({id, title, cost, count}) {
    const itemCart = `
    <div class="food-row">
        <span class="food-name">${title}</span>
        <strong class="food-price">${cost}</strong>
        <div class="food-counter">
            <button class="counter-button counter-minus" data-id=${id}>-</button>
            <span class="counter">${count}</span>
            <button class="counter-button counter-plus" data-id=${id}>+</button>
        </div>
    </div>
    `;

    modalBody.insertAdjacentHTML('afterbegin', itemCart);
  });

  const totalPrice = cart.reduce(function (result, item) {
    return result + (parseFloat(item.cost) * item.count);
  }, 0);

  modalPricetag.textContent = `${totalPrice} ₽`;
};


// Меняем кол-во товаров в корзине

const changeCount = function (event) {
  const target = event.target;

  if (target.classList.contains('counter-button')) {
    const food = cart.find(function (item) {
      return item.id === target.dataset.id;
    });

    console.log(food)

    if (target.classList.contains('counter-minus')) {
      food.count--;
      if (food.count === 0) {
      debugger
        cart.splice(cart.indexOf(food), 1)
      }
    }

    if (target.classList.contains('counter-plus')) {
      food.count++;
    }
    renderCart();
  }
  saveCart();
};

// Инициализирующая функция

const init = function () {
  getData('./db/partners.json')
    .then(function (data) {
      data.forEach(createCardRestaurant)
    });

  cartButton.addEventListener("click", function () {
    renderCart();
    toggleModal();
  });

  buttonClearCart.addEventListener('click', function () {
    cart.length = 0;
    renderCart();
  });

  modalBody.addEventListener('click', changeCount);

  cardsMenu.addEventListener('click', addToCart);
  close.addEventListener("click", toggleModal);
  cardsRestaurants.addEventListener('click', openGoods)

  logo.addEventListener('click', function () {
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
    sectionHeading.textContent = '';
  });

  // Условный поиск товаров

  inputSearch.addEventListener('keydown', function (event) {
    if (event.keyCode === 13) {
      const target = event.target;
      const value = target.value.toLowerCase().trim();

      target.value = '';

      if (!value || value.length < 2) {
        target.style.backgroundColor = 'tomato';

        setTimeout(function () {
          target.style.backgroundColor = '';
        }, 2000)
        return
      }

      const goods = [];

      getData('./db/partners.json')
        .then(function (data) {
          const products = data.map(function (item) {
            return item.products;
          });

          products.forEach(function (product) {
            getData(`./db/${product}`)
              .then(function (data) {

                goods.push(...data);

                const searchGoods = goods.filter(function (item) {
                  return item.name.toLowerCase().includes(value)
                });

                cardsMenu.textContent = '';
                containerPromo.classList.add('hide');
                restaurants.classList.add('hide');
                menu.classList.remove('hide');

                restaurantTitle.textContent = 'Результат поиска';
                rating.textContent = '';
                minPrice.textContent = '';
                category.textContent = '';

                return searchGoods;

              })
              .then(function (data) {
                data.forEach(createCardGood);
              })
          })
        });
    }
  });

  checkAuth();

  new Swiper('.swiper-container', {
    loop: true,
    autoplay: true,
    slidesPerView: 1
  });
};

init();






















