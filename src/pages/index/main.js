require('../../assets/scss/main.scss');
require('./page.scss');
import Swiper, {
  Navigation,
  Pagination,
  Scrollbar,
  EffectCoverflow,
} from 'swiper';
Swiper.use([Navigation, Pagination, Scrollbar, EffectCoverflow]);

document.addEventListener('DOMContentLoaded', () => {
  const headerDropdownButton = document.querySelector('.header__catalog');
  const headerDropdown = document.querySelector('.header-dropdown');

  headerDropdownButton.addEventListener('click', () => {
    headerDropdown.classList.toggle('hidden');
  });
  /*
   *
   * Управление видео в карточках товара
   *
   */
  const cardVideoControlButtons = document.querySelectorAll(
    '.products-product__control'
  ); // кнопка воспроизведения на карточках товаров
  // управление видео и кнопкой в карточке товара
  const playCurrentCardVideo = async (button) => {
    try {
      await button.closest('div').querySelector('video').play();
      button.classList.add('products-product__control--active');
    } catch (err) {
      button.classList.remove('products-product__control--active');
    }
  };
  // управление видео в карточках товаров
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
  /*
   *
   * Сторисы
   *
   */
  // инициализация слайдера сторис
  const storiesSlider = new Swiper('.stories__slider', {
    direction: 'horizontal',
    loop: false,
    effect: 'coverflow',
    coverflowEffect: {
      rotate: 0,
      depth: 100,
      slideShadows: false,
    },
    slideToClickedSlide: true,
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 200,
    allowTouchMove: false,
  });
  const storiesOpenButtons = document.querySelectorAll(
    '.stories-round__button'
  ); // кнопки открытия сторис
  const storiesContainer = document.querySelector('.stories'); // блок сторис
  const storiesCloseButton = document.querySelector('.stories__close'); // кнопка закрытия сторис
  const storiesMuteButton = document.querySelector('.stories__control'); // кнопка управления звуком в СТОРИС
  const stories = document.querySelectorAll('.story'); // все слайды со сторис
  const storiesStatus = []; // массив статусов сторис
  let muted = true; // флаг состояния звука сторис
  // закрытие блока со сторис
  const closeStoriesContainer = () => {
    storiesContainer.classList.add('hidden');
    document.body.style.overflow = 'auto';
  };
  // выключить переданный элемент видео
  const muteVideo = (el) => {
    el.muted = true;
  };
  // включить переданный элемент видео
  const unmuteVideo = (el) => {
    el.muted = false;
  };
  // управление звуком в сторис
  storiesMuteButton.addEventListener('click', () => {
    if (muted) {
      muted = false;
      storiesMuteButton.classList.add('stories__control--active');
      for (const story of stories) {
        story.querySelectorAll('video, audio').forEach((el) => unmuteVideo(el));
      }
    } else {
      muted = true;
      storiesMuteButton.classList.remove('stories__control--active');
      for (const story of stories) {
        story.querySelectorAll('video, audio').forEach((el) => muteVideo(el));
      }
    }
  });
  // функция инициализации прогресс бара для переданной стори
  const initProgressBar = (story) => {
    const storyItems = story.querySelectorAll('.story__content-item');
    const barElement = `<div class="story__progress-bar"><div class="story__progress-bar-line"></div></div>`;
    const barPortal = story.querySelector('.story__progress');
    for (let i = 0; i < storyItems.length; i++) {
      barPortal.innerHTML += barElement;
    }
  };
  // инициализация прогресс баров и состояний воспроизведения
  for (let i = 0; i < stories.length; i++) {
    initProgressBar(stories[i]);
    const storiesItems = stories[i].querySelectorAll('.story__content-item');
    const currentItems = [];
    for (let j = 0; j < storiesItems.length; j++) {
      currentItems.push(false);
    }
    storiesStatus.push(currentItems);
  }
  // открытие сторис при клике на кружок
  for (let item = 0; item < storiesOpenButtons.length; item++) {
    storiesOpenButtons[item].addEventListener('click', () => {
      storiesSlider.slideTo(item);
      storiesContainer.focus();
      storiesContainer.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      const currentStoryItems = stories[item].querySelectorAll(
        '.story__content-item'
      );
      const currentBars = stories[item].querySelectorAll(
        '.story__progress-bar'
      );
      if (storiesStatus[item][0] === false) {
        storiesStatus[item][0] = true;
        currentBars[0].classList.add('story__progress-bar_playing');
        let time;
        if (currentStoryItems[0].querySelector('img')) {
          currentBars[0].querySelector(
            '.story__progress-bar-line'
          ).style.animationDuration = '5s';
        } else {
          const video = currentStoryItems[0].querySelector('video');
          time = video.duration;
          currentBars[0].querySelector(
            '.story__progress-bar-line'
          ).style.animationDuration = `${time}s`;
          video.play();
          video.addEventListener('ended', () => {
            storiesStatus[item][1] = true;
            currentBars[0].classList.add('story__progress-bar_finished');
            currentBars[1].classList.add('story__progress-bar_playing');
          });
        }
        currentStoryItems[0].classList.add('story__content-item_visible');
      } else {
        // currentBars[storiesStatus[item].indexOf(true)].classList.add(
        //   'story__progress-bar_playing'
        // );
      }
    });
  }
  // при смене стори
  // storiesSlider.on('slideChange', () => {
  //   const index = storiesSlider.realIndex;
  //   const currentStoryItems = stories[index].querySelectorAll(
  //     '.story__content-item'
  //   );
  //   const currentBars = stories[index].querySelectorAll('.story__progress-bar');
  //   if (storiesStatus[index][0] === false) {
  //     storiesStatus[index][0] = true;
  //     currentBars[0].classList.add('story__progress-bar_playing');
  //     currentStoryItems[0].classList.add('story__content-item_visible');
  //   }
  // });
  // закрыть контейнер со сторис по кнопке на экране
  storiesCloseButton.addEventListener('click', () => {
    closeStoriesContainer();
  });
  // закрыть сторис по кнопке esc на клавиатуре
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeStoriesContainer();
    }
  });
});
