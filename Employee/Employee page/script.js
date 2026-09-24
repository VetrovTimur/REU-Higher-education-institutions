// Аккордеон (дисциплины)
document.querySelectorAll('[data-accordion-trigger]').forEach(function (trigger) {
  trigger.addEventListener('click', function () {
    var item = this.closest('[data-accordion-item]');
    item.classList.toggle('accordion__item--open');
  });
});

// Кнопка «Показать ещё» (карточки)
document.querySelectorAll('[data-list-toggle]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var list = this.closest('[data-list]');
    var label = this.querySelector('.card-list__toggle-text');
    var expanded = list.classList.toggle('card-list--expanded');

    this.classList.toggle('card-list__toggle--open', expanded);
    if (label) {
      label.textContent = expanded ? 'Скрыть' : 'Показать ещё';
    }
  });
});