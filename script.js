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

    // =========================================
    //   Универсальный слайдер (Partners / Alumni)
    // =========================================
    class SimpleSlider {
        constructor(section) {
            this.section = section;
            this.prefix = section.dataset.slider;          // "partners" | "alumni"
            this.track = section.querySelector(`.${this.prefix}__box`);
            this.items = Array.from(this.track.children);
            this.prevBtn = section.querySelector('[data-slider-prev]');
            this.nextBtn = section.querySelector('[data-slider-next]');
            this.dotsWrap = section.querySelector(`.${this.prefix}__dots`);

            this.index = 0;
            this.visible = 3;

            this.calcVisible();
            this.renderDots();
            this.bindEvents();
            this.update(false);
        }

        /* Сколько карточек видно — синхронизировано с CSS-брейкпоинтами */
        calcVisible() {
            const w = window.innerWidth;
            if (w <= 640) this.visible = 1;
            else if (w <= 1024) this.visible = 2;
            else this.visible = 3;

            this.visible = Math.min(this.visible, this.items.length);
        }

        /* Максимальный индекс докрутки */
        getMaxIndex() {
            return Math.max(0, this.items.length - this.visible);
        }

        /* Генерация точек по количеству позиций */
        renderDots() {
            this.dotsWrap.innerHTML = '';
            const max = this.getMaxIndex();

            for (let i = 0; i <= max; i++) {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = `${this.prefix}__dot`;
                dot.setAttribute('aria-label', `Перейти к слайду ${i + 1}`);

                if (i === this.index) {
                    dot.classList.add(`${this.prefix}__dot--active`);
                }

                dot.addEventListener('click', () => {
                    this.index = i;
                    this.update();
                });

                this.dotsWrap.appendChild(dot);
            }
        }

        /* Обновление позиции трека, точек и кнопок */
        update(animate = true) {
            const max = this.getMaxIndex();
            this.index = Math.max(0, Math.min(this.index, max));

            this.track.style.transition = animate
                ? 'transform 0.55s cubic-bezier(0.25, 1, 0.5, 1)'
                : 'none';

            const firstItem = this.items[0];
            if (!firstItem) return;

            const itemWidth = firstItem.getBoundingClientRect().width;
            const styles = getComputedStyle(this.track);
            const gap = parseFloat(styles.columnGap) || parseFloat(styles.gap) || 0;

            const offset = this.index * (itemWidth + gap);
            this.track.style.transform = `translateX(-${offset}px)`;

            /* Активная точка */
            Array.from(this.dotsWrap.children).forEach((dot, i) => {
                dot.classList.toggle(`${this.prefix}__dot--active`, i === this.index);
            });

            /* Блокировка кнопок на границах */
            if (this.prevBtn) this.prevBtn.disabled = this.index === 0;
            if (this.nextBtn) this.nextBtn.disabled = this.index === max;
        }

        bindEvents() {
            /* Кнопки */
            this.prevBtn?.addEventListener('click', () => {
                this.index--;
                this.update();
            });

            this.nextBtn?.addEventListener('click', () => {
                this.index++;
                this.update();
            });

            /* Свайпы с фильтром по оси */
            let startX = 0;
            let startY = 0;
            let isHorizontal = null;

            this.track.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                isHorizontal = null;
            }, { passive: true });

            this.track.addEventListener('touchmove', (e) => {
                if (isHorizontal === null) {
                    const dx = Math.abs(e.touches[0].clientX - startX);
                    const dy = Math.abs(e.touches[0].clientY - startY);
                    isHorizontal = dx > dy;
                }
            }, { passive: true });

            this.track.addEventListener('touchend', (e) => {
                if (!isHorizontal) return;

                const dx = e.changedTouches[0].clientX - startX;
                if (Math.abs(dx) < 50) return;

                if (dx < 0) this.index++;
                else this.index--;

                this.update();
            });

            /* Пересчёт при ресайзе */
            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    const oldVisible = this.visible;
                    this.calcVisible();

                    if (oldVisible !== this.visible) {
                        this.index = 0;
                        this.renderDots();
                    }

                    this.update(false);
                }, 150);
            });
        }
    }

    /* Инициализация всех слайдеров на странице */
    document.querySelectorAll('[data-slider]').forEach((el) => {
        new SimpleSlider(el);
    });

});