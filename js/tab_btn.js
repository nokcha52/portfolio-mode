// product-list-core.js 다음에 로드되어야 합니다.
// <script src="product-list-core.js"></script>
// <script src="product-list-tabs.js"></script>
document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab_btn');
    if (!tabButtons.length) return;

    const core = window.ProductListCore;
    if (!core) {
        console.warn('ProductListCore가 없습니다. product-list-core.js가 먼저 로드되었는지 확인하세요.');
        return;
    }

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            core.setCategory(btn.dataset.category);
        });
    });

    // URL의 ?category= 파라미터에 맞춰 초기 탭 상태 동기화
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromURL = urlParams.get('category');

    if (categoryFromURL) {
        const matchedTab = Array.from(tabButtons).find(btn => btn.dataset.category === categoryFromURL);
        if (matchedTab) {
            tabButtons.forEach(b => b.classList.remove('active'));
            matchedTab.classList.add('active');
            core.setCategory(categoryFromURL);
        }
    }
});