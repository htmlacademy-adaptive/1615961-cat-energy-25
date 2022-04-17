let nav = document.querySelector('.navigation');
let navToggle = document.querySelector('.navigation__toggle');

nav.classList.remove('navigation--nojs');

navToggle.addEventListener('click', function () {
  if (nav.classList.contains('navigation--closed')) {
    nav.classList.remove('navigation--closed');
    nav.classList.add('navigation--opened');
  } else {
    nav.classList.add('navigation--closed');
    nav.classList.remove('navigation--opened');
  }
});

navToggle.addEventListener('click', function () {
  if (navToggle.classList.contains('navigation__toggle--open')) {
  navToggle.classList.remove('navigation__toggle--open');
  navToggle.classList.add('navigation__toggle--close');
  } else {
    navToggle.classList.remove('navigation__toggle--close');
    navToggle.classList.add('navigation__toggle--open');
  }
});
