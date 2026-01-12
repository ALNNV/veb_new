// Ждём загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. СЛАЙДЕР (BANNER) ---
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const leftBtn = document.querySelector('.left');
    const rightBtn = document.querySelector('.right');
    
    if (slider && slides.length > 0) {
        let currentIndex = 0;
        // Используем clientWidth для точного размера видимой области
        const getSlideWidth = () => document.querySelector('.banner').clientWidth;
        
        function goToSlide(index) {
            currentIndex = index;
            slider.scrollTo({
                left: index * getSlideWidth(),
                behavior: 'smooth'
            });
        }
        
        if (leftBtn && rightBtn) {
            leftBtn.addEventListener('click', function() {
                currentIndex = currentIndex > 0 ? currentIndex - 1 : slides.length - 1;
                goToSlide(currentIndex);
            });
            
            rightBtn.addEventListener('click', function() {
                currentIndex = currentIndex < slides.length - 1 ? currentIndex + 1 : 0;
                goToSlide(currentIndex);
            });
            
            // Автоперелистывание
            setInterval(function() {
                currentIndex = (currentIndex + 1) % slides.length;
                goToSlide(currentIndex);
            }, 10000);
        }
    }
  
    // --- 2. ГАЛЕРЕЯ ТОВАРА ---
    const bigImage = document.getElementById('imageBig');
    const allImages = document.querySelectorAll('.image, .imagemini');
    
    if (allImages.length > 0 && bigImage) {
      allImages.forEach(function(imageEl) {
          imageEl.addEventListener('click', function() {
              const imgSrc = this.querySelector('img').src;
              bigImage.src = imgSrc;
              
              allImages.forEach(img => img.classList.remove('active'));
              this.classList.add('active');
          });
      });
    }
  
    // --- 3. ХАРАКТЕРИСТИКИ (СПОЙЛЕР) ---
    const expandText = document.querySelector('.expand-text');
    const collapseText = document.querySelector('.collapse-text');
    const hiddenSpecs = document.getElementById('hiddenSpecs');
      
    if (expandText && collapseText && hiddenSpecs) {
        expandText.addEventListener('click', () => hiddenSpecs.classList.add('expanded'));
        collapseText.addEventListener('click', () => hiddenSpecs.classList.remove('expanded'));
    }

    // --- 4. ВЫБОР ПАМЯТИ И ЦЕНЫ ---
    const memoryButtons = document.querySelectorAll('.memory-price');
    const priceText = document.getElementById('product-price');

    if (memoryButtons.length > 0 && priceText) {
        memoryButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                memoryButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                const newPrice = this.getAttribute('data-price');
                priceText.textContent = newPrice;
            });
        });
    }

    // --- 5. ЗАПУСК КОРЗИНЫ ---
    // Обновляем счетчик при загрузке любой страницы
    updateBasketBadge();
    
    // Если мы на странице basket.html - отрисовываем товары
    renderBasketPage();
});


/* ==========================================
   ЛОГИКА КОРЗИНЫ (BASKET)
   ========================================== */

// Функция: Добавить товар
function addToBasket(product) {
    // Используем ключ 'basket' в localStorage
    let basket = JSON.parse(localStorage.getItem('basket')) || [];
    
    const existingProduct = basket.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.count++;
    } else {
        basket.push({
            id: product.id,
            title: product.title,
            price: product.price,
            img: product.img,
            count: 1
        });
    }

    localStorage.setItem('basket', JSON.stringify(basket));
    alert('Товар добавлен в корзину!');
    updateBasketBadge(); // Обновляем красную цифру
}

// Функция: Обновить красный кружок (счетчик)
function updateBasketBadge() {
    // Ищем ID, который вы указали в index.html (basket-count-badge)
    const badge = document.getElementById('basket-count-badge');
    if (!badge) return;

    const basket = JSON.parse(localStorage.getItem('basket')) || [];
    const totalCount = basket.reduce((sum, item) => sum + item.count, 0);

    badge.textContent = totalCount;

    if (totalCount > 0) {
        badge.classList.add('visible');
    } else {
        badge.classList.remove('visible');
    }
}

// Функция: Отрисовка страницы basket.html
function renderBasketPage() {
    // Ищем контейнеры по ID (они остались cart-... в html, это нормально)
    const basketContainer = document.getElementById('cart-items-container');
    const emptyMessage = document.getElementById('cart-empty-message');
    const basketContent = document.getElementById('cart-content');
    const totalPriceEl = document.getElementById('total-price');

    if (!basketContainer) return; // Мы не на странице корзины

    let basket = JSON.parse(localStorage.getItem('basket')) || [];

    if (basket.length === 0) {
        emptyMessage.style.display = 'block';
        if (basketContent) basketContent.style.display = 'none';
    } else {
        emptyMessage.style.display = 'none';
        if (basketContent) basketContent.style.display = 'block';
        
        let totalSum = 0;
        basketContainer.innerHTML = '';

        basket.forEach(item => {
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
            basketContainer.innerHTML += itemHTML;
        });

        if (totalPriceEl) totalPriceEl.textContent = totalSum.toLocaleString();
    }
}

// Глобальный слушатель кликов (для кнопок "Купить" и "Удалить")
document.addEventListener('click', function(event) {
    
    // 1. Клик "Купить" на главной
    if (event.target.closest('.buy')) {
        const btn = event.target.closest('.buy');
        event.preventDefault(); // чтобы не открывалась ссылка на товар, когда добавляешь в корзину!!!!!!!!!(моё не удалять!!!!!!!!Ю
        // Проверяем, есть ли данные у кнопки (у первой кнопки в верстке их может не быть)
        if (!btn.dataset.id) return; 

        const product = {
            id: btn.dataset.id,
            title: btn.dataset.title,
            price: parseInt(btn.dataset.price),
            img: btn.dataset.img
        };
        addToBasket(product);
    }

    // 2. Клик "Добавить в корзину" на странице товара
    if (event.target.closest('.buy-button')) {
        const btn = event.target.closest('.buy-button');
        const priceText = document.getElementById('product-price').textContent;
        const cleanPrice = parseInt(priceText.replace(/[^0-9]/g, ''));
        
        const product = {
            id: btn.dataset.id, 
            title: btn.dataset.title,
            price: cleanPrice,
            img: btn.dataset.img
        };
        addToBasket(product);
    }
    
    // 3. Клик "Удалить" в корзине
    if (event.target.classList.contains('delete-btn')) {
        const idToDelete = event.target.dataset.id;
        let basket = JSON.parse(localStorage.getItem('basket')) || [];
        
        // Удаляем товар
        basket = basket.filter(item => item.id !== idToDelete);
        
        localStorage.setItem('basket', JSON.stringify(basket));
        renderBasketPage(); // Перерисовываем
        updateBasketBadge(); // Обновляем счетчик в шапке
    }
});

/* ==========================================
   ЛОГИКА ОФОРМЛЕНИЯ ЗАКАЗА (MODAL)
   ========================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // Элементы
    const modal = document.getElementById('order-modal');
    const openBtn = document.querySelector('.checkout-btn'); // Кнопка в корзине
    const closeBtn = document.querySelector('.close-modal');
    const form = document.getElementById('checkout-form');
    
    // Элементы формы для интерактивности
    const deliveryRadios = document.querySelectorAll('input[name="delivery"]');
    const addressGroup = document.getElementById('address-group');
    
    // Блоки успеха/формы
    const formContent = document.getElementById('order-form-content');
    const successContent = document.getElementById('order-success');
    const closeSuccessBtn = document.getElementById('close-success-btn');

    // 1. ОТКРЫТИЕ МОДАЛКИ
    // Мы вешаем событие на document, так как кнопка checkout-btn может быть создана динамически?
    // В вашем случае она статична в HTML корзины, но лучше использовать делегирование или проверку
    if (modal) {
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('checkout-btn')) {
                // Проверяем, не пуста ли корзина
                const basket = JSON.parse(localStorage.getItem('basket')) || [];
                if (basket.length === 0) {
                    alert("Корзина пуста!");
                    return;
                }
                modal.classList.add('open');
            }
        });

        // 2. ЗАКРЫТИЕ МОДАЛКИ (Крестик или клик вне окна)
        closeBtn.addEventListener('click', () => modal.classList.remove('open'));
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('open');
            }
        });

        // 3. ИНТЕРАКТИВ (Адрес + Способы оплаты)
        
        const paymentContainer = document.getElementById('payment-options');

        // Функция: Перерисовать кнопки оплаты
        function updatePaymentOptions(deliveryType) {
            let html = '';
            
            if (deliveryType === 'pickup') {
                // Если САМОВЫВОЗ
                html = `
                    <label class="radio-label">
                        <input type="radio" name="payment" value="online" checked>
                        Картой на сайте / СБП
                    </label>
                    <label class="radio-label">
                        <input type="radio" name="payment" value="cash">
                        Наличными при получении
                    </label>
                `;
            } else {
                // Если КУРЬЕР
                html = `
                    <label class="radio-label">
                        <input type="radio" name="payment" value="online" checked>
                        Картой на сайте / СБП
                    </label>
                    <label class="radio-label">
                        <input type="radio" name="payment" value="terminal">
                        По карте через терминал
                    </label>
                    <label class="radio-label">
                        <input type="radio" name="payment" value="cash">
                        Наличными
                    </label>
                `;
            }
            
            paymentContainer.innerHTML = html;
        }

        // Слушаем переключение радио-кнопок доставки
        deliveryRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                const type = this.value; // 'pickup' или 'courier'

                // 1. Управляем полем адреса
                if (type === 'courier') {
                    addressGroup.classList.remove('hidden');
                } else {
                    addressGroup.classList.add('hidden');
                }

                // 2. Меняем способы оплаты
                updatePaymentOptions(type);
            });
        });

        // ВАЖНО: Запустить один раз при загрузке, чтобы показать варианты для "Самовывоза" (он выбран по умолчанию)
        updatePaymentOptions('pickup');

        // 4. ВАЛИДАЦИЯ И ОТПРАВКА
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Останавливаем стандартную отправку
            
            let isValid = true;
            
            // Получаем поля
            const nameInput = document.getElementById('input-name');
            const phoneInput = document.getElementById('input-phone');
            const addressInput = document.getElementById('input-address');
            
            // Очищаем старые ошибки перед проверкой
            [nameInput, phoneInput, addressInput].forEach(input => {
                if(input) {
                    input.classList.remove('error');
                    input.closest('.form-group').classList.remove('invalid');
                }
            });

            // 1. Проверка Имени (просто чтобы не было пусто)
            if (nameInput.value.trim() === '') {
                showError(nameInput);
                isValid = false;
            }

            // 2. Проверка Телефона (только на пустоту)
            if (phoneInput.value.trim() === '') {
                showError(phoneInput);
                isValid = false;
            }

            // 3. Проверка Адреса (только если выбран курьер + на пустоту)
            const isCourier = document.querySelector('input[name="delivery"]:checked').value === 'courier';
            if (isCourier && addressInput.value.trim() === '') {
                showError(addressInput);
                isValid = false;
            }

            if (isValid) {
                // Если всё ок — оформляем
                processOrder();
            }
        });

        // Функция показа ошибки
        function showError(input) {
            input.classList.add('error');
            input.closest('.form-group').classList.add('invalid');
        }

        // Функция успешного заказа
        function processOrder() {
            // 1. Очищаем корзину
            localStorage.removeItem('basket');
            updateBasketBadge();
            renderBasketPage(); // Перерисует страницу (покажет "пусто")

            // 2. Скрываем форму, показываем успех
            formContent.style.display = 'none';
            successContent.style.display = 'block';
        }
        
        // Кнопка закрытия после успеха
        closeSuccessBtn.addEventListener('click', function() {
            modal.classList.remove('open');
            // Возвращаем форму в исходное состояние (на случай если клиент вернется)
            setTimeout(() => {
                formContent.style.display = 'block';
                successContent.style.display = 'none';
                form.reset();
                addressGroup.classList.add('hidden'); // Сбросить адрес
            }, 500);
        });
    }
});