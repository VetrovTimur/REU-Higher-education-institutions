document.addEventListener('DOMContentLoaded', () => {
    // =========================================
    //   Переключатель темы
    // =========================================
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    const savedTheme = localStorage.getItem('theme') || 'blue';
    if (savedTheme === 'red') {
        htmlElement.setAttribute('data-theme', 'red');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.add('theme-transitioning');

            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'red' ? 'blue' : 'red';

            if (newTheme === 'blue') {
                htmlElement.removeAttribute('data-theme');
            } else {
                htmlElement.setAttribute('data-theme', 'red');
            }

            localStorage.setItem('theme', newTheme);

            // Убираем класс плавности через 400мс
            setTimeout(() => {
                document.body.classList.remove('theme-transitioning');
            }, 400);
        });
    }

    // =========================================
    //   Галерея
    // =========================================
    const track = document.querySelector('.gallery__track');
    const slides = Array.from(track.children);
    const nextBtn = document.querySelector('.gallery__nav-btn--next');
    const prevBtn = document.querySelector('.gallery__nav-btn--prev');
    const dotsContainer = document.querySelector('.gallery__dots');
    const currentCounter = document.getElementById('current-slide');
    const totalCounter = document.getElementById('total-slides');

    let currentIndex = 0;

    totalCounter.textContent = slides.length;

    // Генерация точек навигации
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('gallery__dot');
        if (index === 0) dot.classList.add('gallery__dot--active');
        dot.setAttribute('aria-label', `Перейти к слайду ${index + 1}`);

        dot.addEventListener('click', () => {
            currentIndex = index;
            updateGallery();
        });

        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);

    // Обновление галереи
    const updateGallery = () => {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        currentCounter.textContent = currentIndex + 1;

        dots.forEach((dot, index) => {
            dot.classList.toggle('gallery__dot--active', index === currentIndex);
        });
    };

    // Кнопки навигации
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateGallery();
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateGallery();
    });

    // Свайпы
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
            currentIndex = (currentIndex + 1) % slides.length;
            updateGallery();
        } else if (endX - startX > threshold) {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateGallery();
        }
    };

    // Клавиатура
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