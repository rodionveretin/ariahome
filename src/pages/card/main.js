require('../../assets/scss/main.scss');
require('./page.scss');
import Swiper, { Navigation, Pagination } from 'swiper';

Swiper.use([Navigation, Pagination]);

document.addEventListener('DOMContentLoaded', () => {
  const headerDropdownButton = document.querySelector('.header__catalog');
  const headerDropdown = document.querySelector('.header-dropdown');

  headerDropdownButton.addEventListener('click', () => {
    headerDropdown.classList.toggle('hidden');
  });
  new Swiper('.recommendations-slider', {
    speed: 400,
    loop: true,
    spaceBetween: 30,
    slidesPerView: 5,
    autoHeight: false,
    navigation: {
      nextEl: '.recommendations-slider .products__slider-next',
      prevEl: '.recommendations-slider .products__slider-prev',
    },
  });
  new Swiper('.seen-slider', {
    speed: 400,
    loop: true,
    spaceBetween: 30,
    slidesPerView: 5,
    autoHeight: false,
    navigation: {
      nextEl: '.seen-slider .products__slider-next',
      prevEl: '.seen-slider .products__slider-prev',
    },
  });

  new Swiper('.product-images .swiper', {
    speed: 400,
    slidesPerView: 1,
    centeredSlides: true,
    // navigation: {
    //   nextEl: '.seen-slider .products__slider-next',
    //   prevEl: '.seen-slider .products__slider-prev',
    // },
  });

  const cardVideoControlButtons = document.querySelectorAll(
    '.products-product__control'
  );

  const playCurrentCardVideo = async (button) => {
    try {
      await button.closest('div').querySelector('video').play();
      button.classList.add('products-product__control--active');
    } catch (err) {
      button.classList.remove('products-product__control--active');
    }
  };
  for (const button of cardVideoControlButtons) {
    button.addEventListener('click', () => {
      if (!button.classList.contains('products-product__control--active')) {
        playCurrentCardVideo(button);
      } else {
        button.closest('div').querySelector('video').pause();
        button.classList.remove('products-product__control--active');
      }
    });
  }
});
