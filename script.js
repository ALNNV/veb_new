// --- ГЛАВНАЯ ОБЕРТКА ---
// Мы ждем, пока браузер полностью построит "скелет" страницы (HTML),
// и только потом запускаем скрипт. Иначе скрипт может не найти кнопки, которых еще нет.
document.addEventListener('DOMContentLoaded', function() {
    
    // слайдер

    const slider = document.querySelector('.slider');       // Лента с картинками
    const slides = document.querySelectorAll('.slide');     // Сами картинки (вагончики)
    const leftBtn = document.querySelector('.left');        // Кнопка "Назад"
    const rightBtn = document.querySelector('.right');      // Кнопка "Вперед"
    
    // Проверяем, есть ли вообще слайдер на этой странице (чтобы не было ошибок на других страницах)
    if (slider && slides.length > 0) {
        let currentIndex = 0; // Номер текущей картинки (0 - первая)
        
        // Эта функция узнает ширину баннера прямо сейчас.
        // Зачем функция? Если пользователь изменит размер окна, ширина поменяется, и нам нужно знать новую.
        const getSlideWidth = () => document.querySelector('.banner').clientWidth;
        
        function goToSlide(index) {
            currentIndex = index;
            // Самая магия: мы просто прокручиваем ленту (slider) на нужную позицию
            slider.scrollTo({
                left: index * getSlideWidth(), // Умножаем номер слайда на ширину одного слайда
                behavior: 'smooth'             // Делаем прокрутку плавной
            });
        }
        
        // Настройка кнопок
        if (leftBtn && rightBtn) {
            leftBtn.addEventListener('click', function() {
                // Если мы в начале (0), прыгаем в конец, иначе -1
                currentIndex = currentIndex > 0 ? currentIndex - 1 : slides.length - 1;
                goToSlide(currentIndex);
            });
            
            rightBtn.addEventListener('click', function() {
                // Если мы в конце, прыгаем в начало (0), иначе +1
                currentIndex = currentIndex < slides.length - 1 ? currentIndex + 1 : 0;
                goToSlide(currentIndex);
            });
            
            // Автоматическое перелистывание каждые 10 секунд
            setInterval(function() {
                currentIndex = (currentIndex + 1) % slides.length; // Хитрый способ зациклить отсчет
                goToSlide(currentIndex);
            }, 10000);
        }
    }
  

    // галерея товара

    const bigImage = document.getElementById('imageBig');
    const allImages = document.querySelectorAll('.image, .imagemini'); // Ищем и главную, и маленькие
    
    if (allImages.length > 0 && bigImage) {
      allImages.forEach(function(imageEl) {
          imageEl.addEventListener('click', function() {
              // 1. Берем адрес картинки, на которую кликнули
              const imgSrc = this.querySelector('img').src;
              // 2. Ставим этот адрес большой картинке
              bigImage.src = imgSrc;
              
              // 3. Убираем рамку выделения (active) у всех и ставим текущей
              allImages.forEach(img => img.classList.remove('active'));
              this.classList.add('active');
          });
      });
    }
  

    // Характеристики

    const expandText = document.querySelector('.expand-text'); // Кнопка "Развернуть"
    const collapseText = document.querySelector('.collapse-text'); // Кнопка "Свернуть"
    const hiddenSpecs = document.getElementById('hiddenSpecs'); // Скрытый блок
      
    if (expandText && collapseText && hiddenSpecs) {
        // Мы просто добавляем класс 'expanded'. 
        // В CSS у нас прописано, что этот класс меняет высоту блока с 0 до максимума.
        expandText.addEventListener('click', () => hiddenSpecs.classList.add('expanded'));
        collapseText.addEventListener('click', () => hiddenSpecs.classList.remove('expanded'));
    }


    // выбор памяти

    const memoryButtons = document.querySelectorAll('.memory-price');
    const priceText = document.getElementById('product-price');

    if (memoryButtons.length > 0 && priceText) {
        memoryButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                // Сбрасываем черный цвет у всех кнопок
                memoryButtons.forEach(btn => btn.classList.remove('active'));
                // Красим нажатую кнопку в черный
                this.classList.add('active');
                
                // Берем цену из атрибута data-price (мы спрятали её там в HTML)
                const newPrice = this.getAttribute('data-price');
                // Меняем текст цены на странице
                priceText.textContent = newPrice;
            });
        });
    }

    // старт работы корзины
    updateBasketBadge(); // Проверить, сколько товаров
    renderBasketPage();  // Если мы на странице корзины — нарисовать товары
});

// логика работы корзины

// Функция: Добавить товар в память
function addToBasket(product) {
    // localStorage — это "кладовка" браузера. Данные там живут, даже если закрыть сайт.
    // Мы достаем оттуда список 'basket' или создаем пустой [], если там ничего нет.
    let basket = JSON.parse(localStorage.getItem('basket')) || [];
    
    // Проверяем, есть ли уже такой товар (по ID)
    const existingProduct = basket.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.count++; // Если есть, просто увеличиваем кол-во
    } else {
        // Если нет, добавляем карточку товара в массив
        basket.push({
            id: product.id,
            title: product.title,
            price: product.price,
            img: product.img,
            count: 1
        });
    }

    // Сохраняем обновленный список обратно в "кладовку" браузера
    // JSON.stringify превращает массив данных в строку, так как localStorage понимает только строки.
    localStorage.setItem('basket', JSON.stringify(basket));
    
    alert('Товар добавлен в корзину!');
    updateBasketBadge(); // Сразу обновляем красный кружок в шапке
}

// Функция: Обновить красный кружок с цифрой
function updateBasketBadge() {
    const badge = document.getElementById('basket-count-badge');
    if (!badge) return; // Если кружка нет на странице (мало ли), выходим

    const basket = JSON.parse(localStorage.getItem('basket')) || [];
    // Считаем общее количество всех товаров (сумма всех count)
    const totalCount = basket.reduce((sum, item) => sum + item.count, 0);

    badge.textContent = totalCount;

    // Если товаров > 0, показываем кружок (добавляем класс visible), иначе прячем
    if (totalCount > 0) {
        badge.classList.add('visible');
    } else {
        badge.classList.remove('visible');
    }
}

// Функция: Рисуем товары на странице basket.html
function renderBasketPage() {
    const basketContainer = document.getElementById('cart-items-container');
    const emptyMessage = document.getElementById('cart-empty-message');
    const basketContent = document.getElementById('cart-content');
    const totalPriceEl = document.getElementById('total-price');

    if (!basketContainer) return; // Если мы НЕ на странице корзины, останавливаемся

    let basket = JSON.parse(localStorage.getItem('basket')) || [];

    // Логика: пусто или нет?
    if (basket.length === 0) {
        emptyMessage.style.display = 'block';     // Показать "Корзина пуста"
        if (basketContent) basketContent.style.display = 'none'; // Скрыть список
    } else {
        emptyMessage.style.display = 'none';      // Скрыть "Корзина пуста"
        if (basketContent) basketContent.style.display = 'block'; // Показать список
        
        let totalSum = 0;
        basketContainer.innerHTML = ''; // Очищаем контейнер перед перерисовкой

        // Бежим по каждому товару и создаем для него HTML-код
        basket.forEach(item => {
            totalSum += item.price * item.count; // Считаем общую сумму
            
            // Обратные кавычки ` ` позволяют удобно писать HTML внутри JS
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
            basketContainer.innerHTML += itemHTML; // Добавляем этот кусок на страницу
        });

        if (totalPriceEl) totalPriceEl.textContent = totalSum.toLocaleString();
    }
}


// глобальный слушатель кликов
document.addEventListener('click', function(event) {
    
    // 1. Если кликнули на кнопку с классом .buy (На главной)
    if (event.target.closest('.buy')) {
        const btn = event.target.closest('.buy');
        event.preventDefault(); // ВАЖНО: Запрещаем переход по ссылке (у нас там тег <a> вокруг карточки)
        
        if (!btn.dataset.id) return; // Защита от случайных кликов

        // Собираем объект товара из атрибутов data-
        const product = {
            id: btn.dataset.id,
            title: btn.dataset.title,
            price: parseInt(btn.dataset.price),
            img: btn.dataset.img
        };
        addToBasket(product);
    }

    // 2. Если кликнули "Добавить в корзину" (На странице товара)
    if (event.target.closest('.buy-button')) {
        const btn = event.target.closest('.buy-button');
        // Цену берем прямо из текста на странице (она может меняться при выборе памяти)
        const priceText = document.getElementById('product-price').textContent;
        // Очищаем цену от пробелов и знака ₽, превращаем в число
        const cleanPrice = parseInt(priceText.replace(/[^0-9]/g, ''));
        
        const product = {
            id: btn.dataset.id, 
            title: btn.dataset.title,
            price: cleanPrice,
            img: btn.dataset.img
        };
        addToBasket(product);
    }
    
    // 3. Если кликнули "Удалить" (В корзине)
    if (event.target.classList.contains('delete-btn')) {
        const idToDelete = event.target.dataset.id;
        let basket = JSON.parse(localStorage.getItem('basket')) || [];
        
        // Фильтр: оставляем только те товары, у которых ID НЕ совпадает с удаляемым
        basket = basket.filter(item => item.id !== idToDelete);
        
        localStorage.setItem('basket', JSON.stringify(basket));
        renderBasketPage();   // Перерисовываем список (товар исчезнет)
        updateBasketBadge();  // Обновляем цифру в шапке
    }
});


   // модальное окно с формой заказа

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('order-modal');
    const closeBtn = document.querySelector('.close-modal');
    const form = document.getElementById('checkout-form');
    
    const deliveryRadios = document.querySelectorAll('input[name="delivery"]');
    const addressGroup = document.getElementById('address-group');
    
    const formContent = document.getElementById('order-form-content');
    const successContent = document.getElementById('order-success');
    const closeSuccessBtn = document.getElementById('close-success-btn');

    if (modal) {
        // 1. Открытие окна
        // Опять слушаем весь документ, на случай если кнопка "Оформить" появилась динамически
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('checkout-btn')) {
                const basket = JSON.parse(localStorage.getItem('basket')) || [];
                if (basket.length === 0) {
                    alert("Корзина пуста!");
                    return;
                }
                modal.classList.add('open'); // Показываем окно через CSS класс
            }
        });

        // 2. Закрытие окна (крестик или клик в пустоту)
        closeBtn.addEventListener('click', () => modal.classList.remove('open'));
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) { // Если клик именно по темному фону, а не по форме
                modal.classList.remove('open');
            }
        });

        // 3. Логика формы (Скрытие адреса)
        const paymentContainer = document.getElementById('payment-options');

        function updatePaymentOptions(deliveryType) {
            let html = '';
            // Меняем варианты оплаты в зависимости от доставки
            if (deliveryType === 'pickup') {
                html = `
                    <label class="radio-label"><input type="radio" name="payment" value="online" checked> Картой на сайте / СБП</label>
                    <label class="radio-label"><input type="radio" name="payment" value="cash"> Наличными при получении</label>
                `;
            } else {
                html = `
                    <label class="radio-label"><input type="radio" name="payment" value="online" checked> Картой на сайте / СБП</label>
                    <label class="radio-label"><input type="radio" name="payment" value="terminal"> По карте через терминал</label>
                    <label class="radio-label"><input type="radio" name="payment" value="cash"> Наличными</label>
                `;
            }
            paymentContainer.innerHTML = html;
        }

        // Следим за переключением радио-кнопок "Самовывоз/Курьер"
        deliveryRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                const type = this.value;

                if (type === 'courier') {
                    addressGroup.classList.remove('hidden'); // Показать поле адреса
                } else {
                    addressGroup.classList.add('hidden');    // Скрыть поле адреса
                }
                updatePaymentOptions(type);
            });
        });

        // Запускаем один раз при старте (чтобы настроить под "Самовывоз")
        updatePaymentOptions('pickup');

        // 4. Отправка формы (валидация)
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // НЕ перезагружать страницу при нажатии кнопки
            
            let isValid = true;
            const nameInput = document.getElementById('input-name');
            const phoneInput = document.getElementById('input-phone');
            const addressInput = document.getElementById('input-address');
            
            // Сброс старых ошибок (красных рамок)
            [nameInput, phoneInput, addressInput].forEach(input => {
                if(input) {
                    input.classList.remove('error');
                    input.closest('.form-group').classList.remove('invalid');
                }
            });

            // Простая проверка: если поле пустое — ошибка
            if (nameInput.value.trim() === '') {
                showError(nameInput);
                isValid = false;
            }

            if (phoneInput.value.trim() === '') {
                showError(phoneInput);
                isValid = false;
            }

            // Адрес проверяем только если выбран "Курьер"
            const isCourier = document.querySelector('input[name="delivery"]:checked').value === 'courier';
            if (isCourier && addressInput.value.trim() === '') {
                showError(addressInput);
                isValid = false;
            }

            if (isValid) {
                processOrder(); // Если всё ок, оформляем заказ
            }
        });

        // Подсветка ошибки
        function showError(input) {
            input.classList.add('error'); // Красная рамка (из CSS)
            input.closest('.form-group').classList.add('invalid'); // Показать текст ошибки
        }

        // Успешный заказ
        function processOrder() {
            localStorage.removeItem('basket'); // Чистим память корзины
            updateBasketBadge(); // Обновляем шапку
            renderBasketPage();  // Обновляем страницу корзины

            // Прячем форму, показываем галочку успеха
            formContent.style.display = 'none';
            successContent.style.display = 'block';
        }
        
        // Кнопка "Отлично" после заказа
        closeSuccessBtn.addEventListener('click', function() {
            modal.classList.remove('open');
            // Возвращаем форму в исходное состояние через полсекунды
            setTimeout(() => {
                formContent.style.display = 'block';
                successContent.style.display = 'none';
                form.reset();
                addressGroup.classList.add('hidden');
            }, 500);
        });
    }
});