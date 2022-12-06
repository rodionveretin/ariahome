const sidebarButton = document.querySelector('.header__button');
const sidebar = document.querySelector('.header-sidebar');
sidebarButton.addEventListener('click', () => {
  sidebar.classList.add('.header-sidebar--active');
});
