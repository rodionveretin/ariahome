require('../../assets/scss/main.scss');
require('./page.scss');
import Swiper, { Navigation, Pagination } from 'swiper';

Swiper.use([Navigation, Pagination]);

document.addEventListener('DOMContentLoaded', () => {
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

  // const videos = document.querySelectorAll('video');
  // for (let i = 0, l = videos.length; i < l; i++) {
  //   const video = videos[i];
  //   const src =
  //     video.src ||
  //     (function () {
  //       const sources = video.querySelectorAll('source');
  //       for (let j = 0, sl = sources.length; j < sl; j++) {
  //         const source = sources[j];
  //         const type = source.type;
  //         const isMp4 = type.indexOf('mp4') !== -1;
  //         if (isMp4) return source.src;
  //       }
  //       return null;
  //     })();
  //   if (src) {
  //     const isYoutube =
  //       src && src.match(/(?:youtu|youtube)(?:\.com|\.be)\/([\w\W]+)/i);
  //     if (isYoutube) {
  //       let id = isYoutube[1].match(/watch\?v=|[\w\W]+/gi);
  //       id = id.length > 1 ? id.splice(1) : id;
  //       id = id.toString();
  //       const mp4url = 'http://www.youtubeinmp4.com/redirect.php?video=';
  //       video.src = mp4url + id;
  //     }
  //   }
  // }

  if (window.innerWidth > 600) {
    new Swiper('.recommendations-slider .swiper', {
      speed: 400,
      loop: true,
      spaceBetween: 30,
      slidesPerView: 5,
      breakpoints: {
        320: {
          slidesPerView: 2,
          spaceBetween: 16,
        },
        601: {
          slidesPerView: 4,
          spaceBetween: 16,
        },
        992: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        1201: {
          slidesPerView: 4,
          spaceBetween: 30,
        },
        1761: {
          slidesPerView: 5,
          spaceBetween: 30,
        },
      },
      autoHeight: false,
      navigation: {
        nextEl: '.recommendations-slider .products__slider-next',
        prevEl: '.recommendations-slider .products__slider-prev',
      },
    });
    new Swiper('.seen-slider .swiper', {
      speed: 400,
      loop: true,
      spaceBetween: 30,
      slidesPerView: 5,
      breakpoints: {
        320: {
          slidesPerView: 2,
          spaceBetween: 16,
        },
        601: {
          slidesPerView: 4,
          spaceBetween: 16,
        },
        992: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        1201: {
          slidesPerView: 4,
          spaceBetween: 30,
        },
        1761: {
          slidesPerView: 5,
          spaceBetween: 30,
        },
      },
      autoHeight: false,
      navigation: {
        nextEl: '.seen-slider .products__slider-next',
        prevEl: '.seen-slider .products__slider-prev',
      },
    });
  }

  const gallery = new Swiper('.product-images .swiper', {
    speed: 400,
    slidesPerView: 1,
    centeredSlides: true,
    navigation: {
      nextEl: '.gallery__images  .product-images__next',
      prevEl: '.gallery__images  .product-images__prev',
    },
  });

  const navigation = new Swiper('.product-navigation .swiper', {
    direction: 'vertical',
    speed: 400,
    slidesPerView: 6,
    spaceBetween: 15,
    watchOverflow: true,
    breakpoints: {
      0: {
        direction: 'horizontal',
        spaceBetween: 8,
        slidesPerView: 4,
      },
      991: {
        direction: 'vertical',
        slidesPerView: 6,
      },
    },
    // centeredSlides: true,
    // navigation: {
    //   nextEl: '.seen-slider .products__slider-next',
    //   prevEl: '.seen-slider .products__slider-prev',
    // },
  });

  const productSlides = document.querySelectorAll(
    '.product-navigation .product-images__slide'
  );

  productSlides[0].classList.add('product-images__slide--active');

  gallery.on('slideChange', () => {
    navigation.slideTo(gallery.activeIndex);
    for (const slide of productSlides) {
      slide.classList.remove('product-images__slide--active');
    }
    productSlides[gallery.activeIndex].classList.add(
      'product-images__slide--active'
    );
  });

  for (let i = 0; i < productSlides.length; i++) {
    productSlides[i].addEventListener('click', () => {
      gallery.slideTo(i);
    });
  }

  // const cardVideoControlButtons = document.querySelectorAll(
  //   '.products-product__control'
  // );

  // const playCurrentCardVideo = async (button) => {
  //   try {
  //     await button.closest('div').querySelector('video').play();
  //     button.classList.add(`${button.className}--active`);
  //   } catch (err) {
  //     button.classList.remove(`${button.className}--active`);
  //   }
  // };
  // for (const button of cardVideoControlButtons) {
  //   button.addEventListener('click', () => {
  //     if (!button.classList.contains('products-product__control--active')) {
  //       playCurrentCardVideo(button);
  //     } else {
  //       button.closest('div').querySelector('video').pause();
  //       button.classList.remove('products-product__control--active');
  //     }
  //   });
  // }
  // const videoPlayButton = document.querySelectorAll('.product-images__button');

  // for (const button of videoPlayButton) {
  //   button.addEventListener('click', () => {
  //     if (!button.classList.contains('product-images__button--active')) {
  //       playCurrentCardVideo(button);
  //       const preview = button.closest('div').querySelector('.product-preview');
  //       if (!preview.classList.contains('hidden')) {
  //         preview.classList.add('hidden');
  //       }
  //     } else {
  //       button.closest('div').querySelector('video').pause();
  //       button.classList.remove('product-images__button--active');
  //     }
  //   });
  // }
});
