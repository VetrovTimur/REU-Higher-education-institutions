document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.gallery__track');
    const slides = Array.from(track.children);
    const nextBtn = document.querySelector('.gallery__nav-btn--next');
    const prevBtn = document.querySelector('.gallery__nav-btn--prev');
    const dotsContainer = document.querySelector('.gallery__dots');
    const currentCounter = document.getElementById('current-slide');
    const totalCounter = document.getElementById('total-slides');

    let currentIndex = 0;

    totalCounter.textContent = slides.length;

    // --- Генерация точек навигации ---
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('gallery__dot');
        if (index === 0) dot.classList.add('gallery__dot--active');
        dot.setAttribute('aria-label', `Перейти к слайду ${index + 1}`);
        
        // Обработчик клика по точке
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateGallery();
        });
        
        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);

    // --- Основная функция обновления галереи ---
    const updateGallery = () => {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        currentCounter.textContent = currentIndex + 1;

        dots.forEach((dot, index) => {
            dot.classList.toggle('gallery__dot--active', index === currentIndex);
        });
    };

    // --- Обработчики кнопок "Вперед" и "Назад" ---
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateGallery();
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateGallery();
    });

    // --- Поддержка свайпов (Touch Events) ---
    let startX = 0;
    let endX = 0;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
        const threshold = 50; 
        
        if (startX - endX > threshold) {
            // Свайп влево -> следующий слайд
            currentIndex = (currentIndex + 1) % slides.length;
            updateGallery();
        } else if (endX - startX > threshold) {
            // Свайп вправо -> предыдущий слайд
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateGallery();
        }
    };

    // --- Управление с клавиатуры (для десктопов) ---
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % slides.length;
            updateGallery();
        } else if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateGallery();
        }
    });
});