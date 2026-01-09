// Ждём загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
  const slider = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slide');
  const leftBtn = document.querySelector('.left');
  const rightBtn = document.querySelector('.right');
  
  let currentIndex = 0;
  const slideWidth = window.innerWidth * 0.98;  // ширина под .banner 98%
  
  // Функция перелистывания
  function goToSlide(index) {
    currentIndex = index;
    slider.scrollTo({
      left: index * slideWidth,
      behavior: 'smooth'
    });
  }
  
  // Кнопка влево
  leftBtn.addEventListener('click', function() {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : slides.length - 1;
    goToSlide(currentIndex);
  });
  
  // Кнопка вправо
  rightBtn.addEventListener('click', function() {
    currentIndex = currentIndex < slides.length - 1 ? currentIndex + 1 : 0;
    goToSlide(currentIndex);
  });
  
  // Автоперелистывание каждые 10 секунд
  setInterval(function() {
    currentIndex = (currentIndex + 1) % slides.length;
    goToSlide(currentIndex);
  }, 10000);
});


// продукт

  const bigImage = document.getElementById('imageBig');
  const allImages = document.querySelectorAll('.image, .imagemini');  /* ИЗМЕНИЛ: добавил .image */
  
  if (allImages.length > 0 && bigImage) {           /* ДОБАВИЛ: проверка наличия */
    allImages.forEach(function(imageEl) {
        imageEl.addEventListener('click', function() {
            // берём src из img внутри контейнера
            const imgSrc = this.querySelector('img').src;
            bigImage.src = imgSrc;
            
            // убираем active со всех
            allImages.forEach(function(img) {
                img.classList.remove('active');
            });
            
            // добавляем active текущей
            this.classList.add('active');
        });
    });
  }