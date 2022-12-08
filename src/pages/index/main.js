/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import { formInitValidation } from '../../assets/js/form-validate';
import './stories-slider.js';
require('../../assets/scss/main.scss');
require('./slider.scss');
require('./page.scss');

import Swiper, {
  Navigation,
  Pagination,
  EffectCoverflow,
} from 'swiper';
Swiper.use([Navigation, Pagination, EffectCoverflow]);

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.style.setProperty(
    '--scrollbar-width',
    `${window.innerWidth - document.documentElement.clientWidth} px`
  );
  const callbackForms = document.querySelectorAll('.form');

  //инициализация валидации для всех форм
  if (callbackForms.length) {
    callbackForms.forEach((el) => {
      formInitValidation(el);
    });
  }

  const headerBarClose = document.querySelector('.close-bar');
  const headerBar = document.querySelector('.header-bar');
  if (headerBarClose && headerBar) {
    headerBarClose.addEventListener('click', () => {
      headerBar.classList.add('hidden');
    });
  }
  const headerDropdownButton = document.querySelector('.header__catalog');
  const headerDropdown = document.querySelector('.header-dropdown');

  headerDropdownButton.addEventListener('click', () => {
    headerDropdown.classList.toggle('hidden');
    setTimeout(() => {
      headerDropdown.classList.toggle('header-dropdown--active');
    }, 200);
  });
  const sidebarButton = document.querySelector('.header__button');
  const sidebarClose = document.querySelector('.header-sidebar__close');
  const sidebar = document.querySelector('.header-sidebar');

  sidebarButton.addEventListener('click', () => {
    sidebar.classList.add('header-sidebar--active');
  });
  sidebarClose.addEventListener('click', () => {
    sidebar.classList.remove('header-sidebar--active');
  });
  new Swiper('.stories-rounds .swiper', {
    speed: 400,
    spaceBetween: 40,
    slidesPerView: 8,
    watchOverflow: true,
    breakpoints: {
      0: {
        slidesPerView: 2,
      },
      375: {
        slidesPerView: 2.5,
      },
      601: {
        slidesPerView: 4.7,
      },
      768: {
        slidesPerView: 5,
      },
      992: {
        slidesPerView: 6.5,
      },
      1200: {
        slidesPerView: 8,
      },
    },
  });
  /*
   *
   * Управление видео в карточках товара
   *
   */
  // const cardVideoControlButtons = document.querySelectorAll(
  //   '.products-product__control'
  // ); // кнопка воспроизведения на карточках товаров
  // // управление видео и кнопкой в карточке товара
  // const playCurrentCardVideo = async (button) => {
  //   try {
  //     await button.closest('div').querySelector('video').play();
  //     button.classList.add('products-product__control--active');
  //   } catch (err) {
  //     button.classList.remove('products-product__control--active');
  //   }
  // };
  // // управление видео в карточках товаров
  // for (const button of cardVideoControlButtons) {
  //   button.addEventListener('click', () => {
  //     if (!button.classList.contains('products-product__control--active')) {
  //       playCurrentCardVideo(button);
  //       const preview = button.closest('div').querySelector('.product-preview');
  //       if (!preview.classList.contains('hidden')) {
  //         preview.classList.add('hidden');
  //       }
  //     } else {
  //       button.closest('div').querySelector('video').pause();
  //       button.classList.remove('products-product__control--active');
  //     }
  //   });
  // }
});




window.addEventListener('load', () => {
  const storiesContainer = document.querySelector('.stories'); // блок сторис
  const storiesCloseButton = document.querySelector('.stories__close'); // кнопка закрытия сторис
  const storiesMuteButton = document.querySelector('.stories__control'); // кнопка управления звуком в СТОРИС
  const stories = document.querySelectorAll('.story'); // все слайды со сторис
  const storiesOpenButtons = document.querySelectorAll(
    '.stories-round__button'
  ); // кнопки открытия сторис

  // функция инициализации прогресс бара для переданной стори
  const initProgressBar = (story) => {
    const storyItems = story.querySelectorAll('.story__content-item');
    const barElement = `<div class="story__progress-bar"><div class="story__progress-bar-line"></div></div>`;
    const barPortal = story.querySelector('.story__progress');
    for (let i = 0; i < storyItems.length; i++) {
      barPortal.innerHTML += barElement;
    }
  };

  for (let i = 0; i < stories.length; i++) {
    //инициализация прогрессбара
    initProgressBar(stories[i]);
  }
  // подвинуть слайд
  const moveSlides = (number) => {
    const carousel = document.querySelector('.card-carousel');
    const slides = document.querySelectorAll('.my-card');
    for (const slide of slides) {
      slide.classList.remove('prev', 'next', 'active');
    }
    if (number === 0) {
      slides[number].classList.add('active');
      slides[number + 1].classList.add('next');
      number = 1;
    } else if (number === slides.length - 1) {
      slides[number].classList.add('active');
      slides[number - 1].classList.add('prev');
    } else {
      slides[number].classList.add('active');
      slides[number].previousElementSibling.classList.add('prev');
      slides[number].nextElementSibling.classList.add('next');
    }
    const slideWidth = parseInt(document.querySelector('.active').style.width, 10);
    const middleSlidePos = slideWidth * document.querySelectorAll('.my-card').length / 2 - slideWidth / 2;
    console.log(slideWidth);
    carousel.style.left = `${middleSlidePos - slideWidth * number}px`;
  };


  // открытие сторис при клике на кружок
  for (let item = 0; item < storiesOpenButtons.length; item++) {
    storiesOpenButtons[item].addEventListener('click', () => {
      moveSlides(item);
      storiesContainer.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        storiesContainer.classList.add('stories--active');
      }, 1);
    });
  }


  
  // закрытие блока со сторис
  const closeStoriesContainer = () => {
    storiesContainer.classList.remove('stories--active');
    setTimeout(() => {
      storiesContainer.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }, 250);
  };





  storiesCloseButton.addEventListener('click', () => {
    closeStoriesContainer();
    for (const item of stories) {
      const videos = item.querySelectorAll('video');
      if (videos.length) {
        for (const vid of videos) {
          vid.pause();
        }
      }
    }
  });


  // закрыть сторис по кнопке esc на клавиатуре
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeStoriesContainer();
      for (const item of stories) {
        const videos = item.querySelectorAll('video');
        if (videos.length) {
          for (const vid of videos) {
            vid.pause();
          }
        }
      }
    }
  });
});
