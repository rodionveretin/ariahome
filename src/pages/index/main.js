/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import { formInitValidation } from '../../assets/js/form-validate';
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
  /*
   *
   * Сторисы
   *
   */


  const tag = document.createElement('script');

  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  console.log('test', firstScriptTag);
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
    autoHeight: false,
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 200,
  });
  const storiesOpenButtons = document.querySelectorAll(
    '.stories-round__button'
  ); // кнопки открытия сторис






  const storiesContainer = document.querySelector('.stories'); // блок сторис
  const storiesCloseButton = document.querySelector('.stories__close'); // кнопка закрытия сторис
  const storiesMuteButton = document.querySelector('.stories__control'); // кнопка управления звуком в СТОРИС
  const stories = document.querySelectorAll('.story'); // все слайды со сторис
  const slides = document.querySelectorAll('.swiper-slide');
  const storiesStatus = []; // массив статусов сторис
  let muted = true; // флаг состояния звука сторис
  let imageTimer; // таймер воспроизведения изображения
  let videoTimer; // таймер воспроизведения видео
  let video; // текущее видео
  let done;





  
  // закрытие блока со сторис
  const closeStoriesContainer = () => {
    storiesContainer.classList.remove('stories--active');
    setTimeout(() => {
      storiesContainer.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }, 250);
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
      storiesMuteButton.innerText = 'Звук включен';
      storiesMuteButton.classList.add('stories__control--active');
      for (const story of stories) {
        story.querySelectorAll('video, audio').forEach((el) => unmuteVideo(el));
      }
    } else {
      muted = true;
      storiesMuteButton.innerText = 'Звук выключен';
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



  // функция создания таймаута
  // const timeOut = (ms) => new Promise(resolve => timer = setTimeout(resolve, ms));



  
  // воспроизведение стори
  // const playStory = async (currentStoryItems, currentBars, storyNumber) => {
  //    const currentStoryItems = stories[storyNumber].querySelectorAll('.story__content-item');
  //    const currentBars = stories[storyNumber].querySelectorAll('.story__progress-bar');
  //   // console.log(storiesStatus[storyNumber]);
  //   let time;
  //   let index = storiesStatus[storyNumber].lastIndexOf(true);
  //   if (index === -1) {
  //     index = 0;
  //   }
  //   console.log(index);
  //   storiesActive = true;
  //   while (storiesStatus[storyNumber].includes(false)) {
  //     if (index !== 0) {
  //       currentStoryItems[index - 1].classList.add('hidden');
  //       currentStoryItems[index].classList.remove('hidden');
  //     }

  //     if (currentStoryItems[index].querySelector('img')) {
  //       currentBars[index].classList.add('story__progress-bar_playing');
  //       currentBars[index].querySelector(
  //         '.story__progress-bar-line'
  //       ).style.animationDuration = '1s';
  //       // await timeOut(1000);
  //       await new Promise(
  //         (resolve) => (imageTimer = setTimeout(resolve, 1000))
  //       );
  //       if (storiesActive) {
  //         currentBars[index].classList.remove('story__progress-bar_playing');
  //         currentBars[index].classList.add('story__progress-bar_finished');
  //       }
  //     } else {
  //       video = currentStoryItems[index].querySelector('video');
  //       time = video.duration;
  //       await video.play();
  //       currentBars[index].querySelector(
  //         '.story__progress-bar-line'
  //       ).style.animationDuration = `${time}s`;
  //       currentBars[index].classList.add('story__progress-bar_playing');
  //       await new Promise(
  //         (resolve) => (imageTimer = setTimeout(resolve, time * 1000))
  //       );
  //       if (storiesActive) {
  //         currentBars[index].classList.remove('story__progress-bar_playing');
  //         currentBars[index].classList.add('story__progress-bar_finished');
  //       }
  //     }
  //     storiesStatus[storyNumber][index++] = true;
  //     console.log(storiesStatus);
  //   }
  //   // console.log(stories.length);
  //   // console.log(storyNumber);
  //   if (stories.length !== storyNumber) {
  //     playStory(stories[storyNumber + 1], [currentBars + 1], storyNumber + 1);
  //   }
  //   // playStory(stories[storyNumber + 1], [currentBars + 1], storyNumber + 1);
  //   return true;
  // };

  // инициализация прогресс баров и состояний воспроизведения
  for (let i = 0; i < stories.length; i++) {
    //инициализация прогрессбара
    initProgressBar(stories[i]);



    // const storiesItems = stories[i].querySelectorAll('.story__content-item');
    // const currentItems = [];
    // for (let j = 0; j < storiesItems.length; j++) {
    //   currentItems.push(false);
    // }
    // storiesStatus.push(currentItems);



    // обнуление последних слайдов
    storiesStatus[i] = 0;
  }
  function onYouTubeIframeAPIReady(player) {
    return new YT.Player(player, {
      // events: {
      //   'onReady': onPlayerReady,
      // }
    });
  }
  function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING && !done) {
      setTimeout(stopVideo, 6000);
      done = true;
    }
  }
  function stopVideo(player) {
    player.stopVideo();
  }

  // Воспроизведение
  const playStory = async (storyNumber, action) => {
    // если ошибка и передалось -1
    if (storyNumber < 0) {
      storyNumber = 0;
    };
    console.log(storiesStatus);
    // Получение всех видео/картинок в одном стори
    const currentStoryItems = stories[storyNumber].querySelectorAll('.story__content-item');
    // Получение всех прогрессбаров в стори
    const currentBars = stories[storyNumber].querySelectorAll('.story__progress-bar');
    // Таймер показа видео/картинки из стори
    let time;
    // Получение всех видео в стори
    const videos = stories[storyNumber].querySelectorAll('video');
    if (videos.length) {
      for (const item of videos) {
        // сброс времени и пауза всех видео
        item.pause();
        item.currentTime = 0;
      }
    }
    // Проверки сработают только при вызове с нажатия на левую или правую сторону активного сториса (работает криво, надо править)
    // Если нажать на левую половину карточки, то попробовать убавить индекс активного элемента
    if (action === 'left') {
      // Если активный индекс будет меньше нуля, то вызвать воспроизведение предыдущего стори
      if (--storiesStatus[storyNumber] < 0) {
        storiesStatus[storyNumber] = 0;
        storiesSlider.slideTo(--storyNumber);
        return playStory(storyNumber);
      } 
      // Если нажать на правую половину карточки, то попробовать прибавить индекс активного элемента
    } else if (action === 'right') {
      // Если активный индекс будет больше всех элементов, то вызвать воспроизведение следующего стори
      if (++storiesStatus[storyNumber] > currentStoryItems.length - 1) {
        --storiesStatus[storyNumber];
        storiesSlider.slideTo(++storyNumber);
        return playStory(storyNumber);
      }
    }
    // Срабатывает при переключении на уже увиденный сторис - если воспроизвелись все элементы, то установить для воспроизведения последний
    if (storiesStatus[storyNumber] === currentStoryItems.length - 1) {
      storiesStatus[storyNumber]--;
      currentBars[currentBars.length - 1].classList.remove('story__progress-bar_finished');
    }

    // if (storiesStatus[storyNumber] > 0) {
    //   for (let i = 0; i < storiesStatus[storyNumber]; i++) {
    //     currentBars[i].classList.add('story__progress-bar_finished');
    //   }
    // }
    for (let i = storiesStatus[storyNumber]; i < currentStoryItems.length; i++) {
      // прячем все видимые элементы сториса 
      for (const item of currentStoryItems) {
        item.classList.remove('story__content-item_visible');
      }
      // показываем текущий сторис 
      currentStoryItems[i].classList.add('story__content-item_visible');
      // Если сторис картинка
      if (currentStoryItems[i].querySelector('img')) {
        // Вешаем класс произведения с анимацией в 1 секунду
        currentBars[i].classList.add('story__progress-bar_playing');
        currentBars[i].querySelector(
          '.story__progress-bar-line'
        ).style.animationDuration = '1s';
        // ждем пока закончится 
        await new Promise(
          (resolve) => (imageTimer = setTimeout(resolve, 1000))
        );
        // вешаем класс окончания
        currentBars[i].classList.remove('story__progress-bar_playing');
        currentBars[i].classList.add('story__progress-bar_finished');
      } else {
        // если видео
        video = onYouTubeIframeAPIReady(currentStoryItems[i].querySelector('iframe'));
        time = video.duration;
        video.play();
        // то устанавливаем время анимации
        currentBars[i].querySelector(
          '.story__progress-bar-line'
        ).style.animationDuration = `${time}s`;
        currentBars[i].classList.add('story__progress-bar_playing');
        // ждем, пока видео закончится
        await new Promise(
          (resolve) => (imageTimer = setTimeout(resolve, time * 1000))
        );
        // вешаем класс окончания
        currentBars[i].classList.remove('story__progress-bar_playing');
        currentBars[i].classList.add('story__progress-bar_finished');
      }
      // записываем сколько сторис уже проигралось
      storiesStatus[storyNumber] = i;
    };
    // если стори весь пройден, то проверяем есть ли следующий, переключаем слайд и начинаем воспроизведение
    if ((storiesStatus[storyNumber] === currentStoryItems.length - 1) && (storyNumber !== stories.length - 1)) {
      storiesSlider.slideTo(++storyNumber);
      return playStory(storyNumber);
    }
  };







  // открытие сторис при клике на кружок
  for (let item = 0; item < storiesOpenButtons.length; item++) {
    storiesOpenButtons[item].addEventListener('click', async () => {
      storiesSlider.slideTo(item);
      storiesContainer.focus();
      storiesContainer.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        storiesContainer.classList.add('stories--active');
      }, 1);
      playStory(item);
    });
  }





  // смена сторис при нажатии на половины сториса
  for (const slide of slides) {
    slide.addEventListener('click', (e) => {
      // если нажатый слайд активный
      if (slide.classList.contains('swiper-slide-active')) {
        // находим центр карточки
        const center = slide.offsetWidth / 2;
        // Сбрасываем таймеры
        clearTimeout(imageTimer);
        clearTimeout(videoTimer);
        // Если в прошлой сторисы были видео
        if (storiesSlider.previousIndex) {
          const videos = stories[storiesSlider.previousIndex].querySelectorAll('video');
          // Ставим на паузу и обнуляем прогресс
          if (videos.length) {
            for (const item of videos) {
              item.currentTime = 0;
              item.pause();
            }
          }
        }
        // убираем текущий прогресс бар
        const currentPlaying = document.querySelector('.story__progress-bar_playing');
        if (currentPlaying) {
          currentPlaying.classList.remove('story__progress-bar_playing');
        }
        // вызываем воспроизведение с условием
        if (e.offsetX >= center) {
          playStory(storiesSlider.activeIndex, 'left');
        } else {
          playStory(storiesSlider.activeIndex, 'right');
        }
      }
    });
  }

  // когда пользователь заканчивает перетягивать слайдер и отпускает его
  storiesSlider.on('touchEnd', () => {
    console.log(storiesSlider.activeIndex);
    clearTimeout(imageTimer);
    clearTimeout(videoTimer);
    const videos = stories[storiesSlider.previousIndex].querySelectorAll('video');
    const currentPlaying = document.querySelector('.story__progress-bar_playing');
    if (currentPlaying) {
      currentPlaying.classList.remove('story__progress-bar_playing');
    }
    if (videos.length) {
      for (const item of videos) {
        item.pause();
        item.currentTime = 0;
      }
    }
    // начинаем воспроизведение в новом активном слайде
    playStory(storiesSlider.activeIndex);
  });

  storiesCloseButton.addEventListener('click', () => {
    closeStoriesContainer();
    clearTimeout(imageTimer);
    clearTimeout(videoTimer);
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
      clearTimeout(imageTimer);
      clearTimeout(videoTimer);
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
