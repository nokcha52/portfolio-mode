document.addEventListener('DOMContentLoaded', () => {
  initAccordion();
});
function initAccordion() {
  document.querySelectorAll('.accordion_item').forEach((item) => {
    const header = item.querySelector('.accordion_header');

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // 클릭한 항목을 열기 전에, 일단 전체 다 닫기
      document.querySelectorAll('.accordion_item').forEach((other) => {
        other.classList.remove('is-open');
      });

      // 원래 닫혀있던 항목이었다면 다시 열어주기
      // (원래 열려있던 항목을 눌렀을 땐 그대로 닫힌 채로 둠 → 토글 효과)
      if (!isOpen) {
        item.classList.add('is-open');
      }
    });
  });
}