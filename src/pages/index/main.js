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
  );
  const storiesContainer = document.querySelector('.stories');
  const storiesCloseButton = document.querySelector('.stories__close');
  const storiesMuteButton = document.querySelector('.stories__control');
  const stories = document.querySelectorAll('.story');
  let muted = true;

  const closeStoriesContainer = () => {
    storiesContainer.classList.add('hidden');
    document.body.style.overflow = 'auto';
  };

  const muteVideo = (el) => {
    el.muted = true;
  };

  const unmuteVideo = (el) => {
    el.muted = false;
  };

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

  const initProgressBar = (story) => {
    const storyItems = story.querySelectorAll('.story__content-item');
    const barElement = `<div class="story__progress-bar"><div class="story__progress-bar-line"></div></div>`;
    const barPortal = story.querySelector('.story__progress');
    for (let i = 0; i < storyItems.length; i++) {
      barPortal.innerHTML += barElement;
    }
  };

  for (let item = 0; item < storiesOpenButtons.length; item++) {
    storiesOpenButtons[item].addEventListener('click', () => {
      storiesSlider.slideTo(item);
      storiesContainer.focus();
      storiesContainer.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      const currentStoryItems = stories[item].querySelectorAll(
        '.story__content-item'
      );
      currentStoryItems[0].classList.add('story__content-item_visible');
    });
  }

  for (const story of stories) {
    initProgressBar(story);
  }

  storiesCloseButton.addEventListener('click', () => {
    closeStoriesContainer();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeStoriesContainer();
    }
  });
});
