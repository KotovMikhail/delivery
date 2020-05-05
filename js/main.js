const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
};

// day 1

const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const loginError = logInForm.querySelector('.login-error');

let login = localStorage.getItem('Delivery');

console.log();

function toggleModalAuth() {
  modalAuth.classList.toggle("is-open");
}

function authorized() {

  function logOut() {
    login = null;
    localStorage.removeItem('Delivery');

    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    buttonOut.removeEventListener('click', logOut)

    checkAuth();
  };

  console.log('Авторизован')

  userName.textContent = login;

  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';

  buttonOut.addEventListener('click', logOut)
};


function notAuthorized() {
  console.log('Не авторизован')

  function logIn(event) {
    event.preventDefault();
    login = loginInput.value;

    if (!login) {
      loginError.style.display = 'block';
      return false;
    }

    loginError.style.display = 'none';

    localStorage.setItem('Delivery', login);

    toggleModalAuth();

    buttonAuth.removeEventListener('click', toggleModalAuth);
    closeAuth.removeEventListener('click', toggleModalAuth);
    logInForm.removeEventListener('submit', logIn);

    logInForm.reset();

    checkAuth();
  }

  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn);
};

function checkAuth() {
  if (login) {
    authorized()
  } else {
    notAuthorized()
  }
};

checkAuth();































