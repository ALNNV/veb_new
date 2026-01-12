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

// Характеристики - разворачивание/сворачивание
document.addEventListener('DOMContentLoaded', function() {
    const expandText = document.querySelector('.expand-text');
    const collapseText = document.querySelector('.collapse-text');
    const hiddenSpecs = document.getElementById('hiddenSpecs');
    
    if (expandText && collapseText && hiddenSpecs) {
        // Кликаем на текст "Развернуть"
        expandText.addEventListener('click', function() {
            hiddenSpecs.classList.add('expanded');
        });
        
        // Кликаем на текст "Свернуть"
        collapseText.addEventListener('click', function() {
            hiddenSpecs.classList.remove('expanded');
        });
    }
});

// --- Логика выбора памяти и смены цены ---
document.addEventListener('DOMContentLoaded', function() {
    // Ищем кнопки по вашему новому классу .memory-price
    const memoryButtons = document.querySelectorAll('.memory-price');
    const priceText = document.getElementById('product-price');

    if (memoryButtons.length > 0 && priceText) {
        
        memoryButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                // 1. Убираем класс 'active' у всех кнопок memory-price
                memoryButtons.forEach(function(btn) {
                    btn.classList.remove('active');
                });

                // 2. Добавляем 'active' нажатой кнопке
                this.classList.add('active');

                // 3. Берем цену и обновляем текст
                const newPrice = this.getAttribute('data-price');
                priceText.textContent = newPrice;
            });
        });
    }
});