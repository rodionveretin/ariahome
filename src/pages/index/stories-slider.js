/* eslint-disable prettier/prettier */
document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.my-card');
  const carousel =  document.querySelector('.card-carousel');

  slides[0].classList.add('active');
  slides[1].classList.add('next');

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.width = `${window.innerWidth / 3}px`
    const current = parseInt(document.querySelector('.active').style.width, 10);
    slides[i].addEventListener('click', () => {
      if (slides[i].classList.contains('next')) {
        carousel.style.left = `${parseInt(carousel.style.left, 10) - current}px`;
        console.log(`${parseInt(carousel.style.left, 10) - current}px`);
      } else if (slides[i].classList.contains('prev')) {
        carousel.style.left = `${parseInt(carousel.style.left, 10) + current}px`;
        console.log(`${parseInt(carousel.style.left, 10) + current}px`);
      };

      slides[i].classList.remove('prev', 'next');
      [...slides[i].parentNode.children].filter((child) => child.classList.remove('prev', 'next', 'active'));

      if (i === 0) {
        slides[i].classList.add('active');
        slides[i + 1].classList.add('next');
      } else if (i === slides.length - 1) {
        slides[i].classList.add('active');
        slides[i - 1].classList.add('prev');
      } else {
        slides[i].classList.add('active');
        slides[i].previousElementSibling.classList.add('prev');
        slides[i].nextElementSibling.classList.add('next');
      }
    });
  };

  const slideWidth = parseInt(document.querySelector('.active').style.width, 10);
  carousel.style.left =
    `${slideWidth * document.querySelectorAll('.my-card').length / 2 - slideWidth / 2}px`;
});