document.addEventListener('DOMContentLoaded', () => {

    // ---------------------------------------------
    // 공통 유틸
    // ---------------------------------------------

    // 좌/우 sticky 카드처럼 같은 클래스가 여러개 있을 수 있으므로 모두 갱신
    function setTextAll(className, text) {
        document.querySelectorAll('.' + className).forEach(el => {
            el.textContent = text;
        });
    }

    // 버튼/카드 안의 텍스트를 공백/줄바꿈 정리해서 가져오기
    function getCleanText(el) {
        return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
    }

    // 카드(article) 안에서 가격(label-s) 텍스트를 숫자로 변환. 없으면 0
    function extractPrice(article) {
        const priceEl = article.querySelector('.label-s');
        if (!priceEl) return 0;
        const match = priceEl.textContent.match(/[\d.]+/);
        return match ? parseFloat(match[0]) : 0;
    }

    // ---------------------------------------------
    // 상태값
    // ---------------------------------------------
    const BASE_PRICE = 299.00; // 기본 키보드 가격

    const selectedPrices = {
        pcb: 0,
        plate: 0,
        switch: 0,
        stabilizer: 0,
        keycap: 0
    };

    let quantity = 1;

    // (기본가 + 선택한 부품 합계) × 수량 = 최종 total_price
    function updateTotalPrice() {
        const partsSum = Object.values(selectedPrices).reduce((sum, p) => sum + p, 0);
        const total = (BASE_PRICE + partsSum) * quantity;
        setTextAll('total_price', `$${total.toFixed(2)}`);
    }

    // ---------------------------------------------
    // 1. Edition 선택 (edition_part) - 이미지 탭 전환 + edit_click 텍스트
    // ---------------------------------------------
    const editionButtons = document.querySelectorAll('.edition_part .tab_btn');
    const editionImgConts = document.querySelectorAll('.edition_part .img_cont');

    function selectEdition(btn) {
        editionButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.dataset.category;
        editionImgConts.forEach(cont => {
            cont.style.display = (cont.dataset.category === category) ? 'flex' : 'none';
        });

        // 상품명(edition명)만 표시
        setTextAll('edit_click', getCleanText(btn));
    }

    editionButtons.forEach(btn => {
        btn.addEventListener('click', () => selectEdition(btn));
    });

    // 초기 상태: 첫번째 Edition 기본 선택
    if (editionButtons.length) {
        selectEdition(editionButtons[0]);
    }

    // ---------------------------------------------
    // 2. 나머지 섹션(pcb/plate/switch/stabilizer/keycap) 카드 선택
    //    - edition_part를 제외한 article.card_slot 클릭 시 active 토글
    //    - 각 섹션에 대응하는 _click 문단에 상품명만 표시
    //    - 선택한 가격을 selectedPrices에 저장 후 total_price 갱신
    // ---------------------------------------------
    const sectionConfigs = [
        { selector: '.pcb_part',        clickClass: 'pcb_click',    key: 'pcb' },
        { selector: '.plate_part',      clickClass: 'plate_click',  key: 'plate' },
        { selector: '.switch_part',     clickClass: 'switch_click', key: 'switch' },
        { selector: '.stabilizer_part', clickClass: 'stab_click',   key: 'stabilizer' },
        { selector: '.keycap_part',     clickClass: 'keycap_click', key: 'keycap' },
    ];

    sectionConfigs.forEach(({ selector, clickClass, key }) => {
        const section = document.querySelector(selector);
        if (!section) return;

        const cards = section.querySelectorAll('article.card_slot');

        cards.forEach(card => {
            card.addEventListener('click', () => {
                // 같은 섹션 안에서 단일 선택
                cards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');

                const name = getCleanText(card.querySelector('.title4'));
                const price = extractPrice(card);

                selectedPrices[key] = price;

                // 상품명만 표시
                setTextAll(clickClass, name);
                updateTotalPrice();
            });
        });
    });

    // ---------------------------------------------
    // 4. 수량(product_count) +/- 버튼
    //    - 시작값 1, 1일 때 - 버튼 비활성화
    //    - 수량 변경 시 total_price 재계산
    // ---------------------------------------------
    const minusButtons = document.querySelectorAll('.minus_btn');
    const plusButtons = document.querySelectorAll('.plus_btn');

    function updateQuantityDisplay() {
        setTextAll('count_cont', quantity);
        minusButtons.forEach(btn => {
            btn.disabled = quantity <= 1;
        });
    }

    minusButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (quantity > 1) {
                quantity--;
                updateQuantityDisplay();
                updateTotalPrice();
            }
        });
    });

    plusButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            quantity++;
            updateQuantityDisplay();
            updateTotalPrice();
        });
    });

    // 초기 렌더링
    updateQuantityDisplay();
    updateTotalPrice();

});