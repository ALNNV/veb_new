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

/* --- ЛОГИКА КОРЗИНЫ --- */

// 1. Функция добавления товара (вызывается при клике)
function addToCart(product) {
    // Получаем текущую корзину из памяти браузера (или создаем пустой массив)
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Проверяем, есть ли уже такой товар в корзине
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        // Если есть - увеличиваем количество
        existingProduct.count++;
    } else {
        // Если нет - добавляем новый
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            img: product.img,
            count: 1
        });
    }

    // Сохраняем обновленную корзину обратно
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Визуальное уведомление (можно заменить на красивое всплывающее окно)
    alert('Товар добавлен в корзину!');
}

// 2. Слушаем клики на странице (делегирование событий)
document.addEventListener('click', function(event) {
    
    // А) Клик по кнопке "Купить" (на главной)
    if (event.target.closest('.buy')) {
        const btn = event.target.closest('.buy');
        const product = {
            id: btn.dataset.id,
            title: btn.dataset.title,
            price: parseInt(btn.dataset.price),
            img: btn.dataset.img
        };
        addToCart(product);
    }

    // Б) Клик по кнопке "Добавить в корзину" (на странице товара)
    if (event.target.closest('.buy-button')) {
        const btn = event.target.closest('.buy-button');
        
        // Тут хитрость: цену берем не из атрибута, а из текста на странице (она же меняется!)
        const priceText = document.getElementById('product-price').textContent; // "140 990 ₽"
        // Чистим цену от пробелов и знака ₽, превращаем в число
        const cleanPrice = parseInt(priceText.replace(/[^0-9]/g, ''));
        
        const product = {
            id: btn.dataset.id, // Можно добавлять выбранную память к ID, чтобы различать товары
            title: btn.dataset.title,
            price: cleanPrice,
            img: btn.dataset.img
        };
        addToCart(product);
    }
    
    // В) Удаление товара (на странице корзины)
    if (event.target.classList.contains('delete-btn')) {
        const idToDelete = event.target.dataset.id;
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Оставляем только те товары, у которых ID НЕ совпадает с удаляемым
        cart = cart.filter(item => item.id !== idToDelete);
        
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartPage(); // Перерисовываем корзину
    }
});

// 3. Функция отрисовки страницы корзины
function renderCartPage() {
    const cartContainer = document.getElementById('cart-items-container');
    const emptyMessage = document.getElementById('cart-empty-message');
    const cartContent = document.getElementById('cart-content');
    const totalPriceEl = document.getElementById('total-price');

    // Если мы не на странице корзины - выходим
    if (!cartContainer) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        // Корзина пуста
        emptyMessage.style.display = 'block';
        cartContent.style.display = 'none';
    } else {
        // В корзине что-то есть
        emptyMessage.style.display = 'none';
        cartContent.style.display = 'block';
        
        let totalSum = 0;
        cartContainer.innerHTML = ''; // Чистим контейнер перед отрисовкой

        cart.forEach(item => {
            totalSum += item.price * item.count;
            
            const itemHTML = `
                <div class="cart-item">
                    <img src="${item.img}" alt="${item.title}">
                    <div class="cart-item-info">
                        <h3>${item.title}</h3>
                        <p class="cart-item-price">${item.price.toLocaleString()} ₽</p>
                    </div>
                    <div class="cart-controls">
                        <span class="cart-count">${item.count} шт.</span>
                        <button class="delete-btn" data-id="${item.id}">Удалить</button>
                    </div>
                </div>
            `;
            cartContainer.innerHTML += itemHTML;
        });

        totalPriceEl.textContent = totalSum.toLocaleString();
    }
}

// Запускаем отрисовку, если мы зашли на страницу корзины
document.addEventListener('DOMContentLoaded', renderCartPage);