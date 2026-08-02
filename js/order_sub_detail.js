document.addEventListener('DOMContentLoaded', () => {

    // ---------------------------------------------------
    // 1. 중복 방지 가드 (스크립트가 실수로 두 번 로드되거나,
    //    다른 페이지의 cart 스크립트와 겹쳐도 리스너가 두 번 붙지 않도록 막음)
    // ---------------------------------------------------
    if (window.__lotusCartBound) return;
    window.__lotusCartBound = true;

    const CART_KEY = 'cart';

    // 담기 완료 모달은 data-category="addtocart" 를 가진 div 한 개뿐
    const cartModal = document.querySelector('.modal_overlay.cart[data-category="addtocart"]');

    function getCleanText(el) {
        return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
    }

    function getSelectedImage(card) {
        const galleryImgs = document.querySelectorAll('.img_cont > figure[data-righttab] img');
        for (const img of galleryImgs) {
            if (img.offsetParent !== null) {
                return img.src;
            }
        }

        const wrapper = card.closest('.width_cont') || card.parentElement || card;
        const candidates = wrapper.querySelectorAll('figure img, .img_cont img');

        for (const img of candidates) {
            if (img.offsetParent !== null) {
                return img.src;
            }
        }

        const fallback = card.querySelector('figure img');
        return fallback ? fallback.src : '';
    }
    function extractPrice(card) {
        const priceEl = card.querySelector('.title3');
        if (!priceEl) return 0;
        const match = priceEl.textContent.match(/[\d.]+/);
        return match ? parseFloat(match[0]) : 0;
    }

    // ---------------------------------------------------
    // pack_tab_cont (예: 70 pack / 90 pack / 110 pack) 선택 처리
    // 선택 상태는 버튼이 속한 .product_card 의 dataset에 저장해서
    // 좌/우 두 개의 product_card가 있어도 서로 섞이지 않게 함
    // ---------------------------------------------------
    function initPackTabs() {
        document.querySelectorAll('.product_card').forEach(card => {
            const packCont = card.querySelector('.pack_tab_cont');
            if (!packCont) return;

            const tabButtons = packCont.querySelectorAll('.tab_btn');

            function selectPack(btn) {
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                card.dataset.pack = getCleanText(btn);
                card.dataset.price = btn.dataset.price || '0';
                updateVisiblePrice(card);
            }

            tabButtons.forEach(btn => {
                btn.addEventListener('click', () => selectPack(btn));
            });

            const initialBtn = packCont.querySelector('.tab_btn.active') || tabButtons[0];
            if (initialBtn) selectPack(initialBtn);
        });
    }

    function initTabCont() {
        document.querySelectorAll('.product_card').forEach(card => {
            const tabCont = card.querySelector('.tab_cont');
            if (!tabCont) return;

            const tabButtons = tabCont.querySelectorAll('.tab_btn');

            function selectTab(btn) {
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                card.dataset.variant = getCleanText(btn);
                card.dataset.price = btn.dataset.price || '0';
                updateVisiblePrice(card);
            }

            tabButtons.forEach(btn => {
                btn.addEventListener('click', () => selectTab(btn));
            });

            const initialBtn = tabCont.querySelector('.tab_btn.active') || tabButtons[0];
            if (initialBtn) selectTab(initialBtn);
        });
    }

    function updateVisiblePrice(card) {
        const priceEl = card.querySelector('.title3');
        if (priceEl && card.dataset.price) {
            priceEl.textContent = `$${parseFloat(card.dataset.price).toFixed(2)}`;
        }
    }

    initPackTabs();
    initTabCont();

    function openCartModal() {
        if (cartModal) cartModal.hidden = false;
    }

    function closeCartModal() {
        if (cartModal) cartModal.hidden = true;
    }

    if (cartModal) {
        const continueBtn = cartModal.querySelector('.btn_gray');
        if (continueBtn) continueBtn.addEventListener('click', closeCartModal);
    }

    // ---------------------------------------------------
    // 2. 짧은 시간 내 재클릭으로 인한 중복 담기 방지용 lock
    // ---------------------------------------------------
    let isProcessing = false;

    document.body.addEventListener('click', (e) => {
        // 주의: 모달 wrapper div 도 data-category="addtocart" 를 가지고 있어서
        // e.target.closest('[data-category="addtocart"]') 로만 찾으면
        // 모달 내부(예: Continue Shopping) 클릭도 이 div에 걸려버림.
        // 그래서 실제 "버튼" 요소만 정확히 선택한다.
        const btn = e.target.closest('button[data-category="addtocart"]');
        if (!btn) return;

        if (isProcessing) return;
        isProcessing = true;

        const card = btn.closest('.product_card');
        if (!card) {
            isProcessing = false;
            return;
        }

        const name = getCleanText(card.querySelector('h2.title2'));

        // pack 옵션이 있는 상품(스위치 등)은 dataset.price를 우선 사용,
        // 없는 상품(키캡 등)은 기존처럼 .title3 가격 표시를 사용
        const price = card.dataset.price
            ? parseFloat(card.dataset.price)
            : extractPrice(card);

        const image = getSelectedImage(card);

        const options = {};
        if (card.dataset.pack) {
            options.pack = card.dataset.pack;
        }
        if (card.dataset.variant) {
            options.variant = card.dataset.variant;
        }

        const cartItem = {
            id: Date.now(),
            name: name,
            price: price,
            qty: 1,
            image: image,
            options: options
        };

        let cart = [];
        try {
            cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
        } catch (err) {
            cart = [];
        }

        cart.push(cartItem);
        localStorage.setItem(CART_KEY, JSON.stringify(cart));

        openCartModal();

        setTimeout(() => {
            isProcessing = false;
        }, 500);
    });
});