document.addEventListener('DOMContentLoaded', () => {
  initAccordion();
});
function initAccordion() {
  document.querySelectorAll('.accordion_item').forEach((item) => {
    const header = item.querySelector('.accordion_header');

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      document.querySelectorAll('.accordion_item').forEach((other) => {
        other.classList.remove('is-open');
      });

      if (!isOpen) {
        item.classList.add('is-open');
      }
    });
  });
}