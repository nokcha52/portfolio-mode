document.addEventListener('DOMContentLoaded', () => {
    if (window.__checkoutPageInitialized) return;
    window.__checkoutPageInitialized = true;

    // ---------------------------------------------------
    // 1. cart 데이터 불러오기 (my_cart.js와 동일한 key 사용)
    // ---------------------------------------------------
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const orderListWrap = document.querySelector('.right_side .cart_item').parentElement;
    const itemTemplate = orderListWrap.querySelector('.cart_item');
    const templateHtml = itemTemplate.outerHTML;
    itemTemplate.remove();

    // ---------------------------------------------------
    // 2. 주문 요약(우측) 렌더링
    // ---------------------------------------------------
    function renderOrder() {
        orderListWrap.querySelectorAll('.cart_item').forEach(el => el.remove());

        if (cart.length === 0) {
            const empty = document.createElement('p');
            empty.className = 'body-m';
            empty.textContent = 'Your cart is empty.';
            orderListWrap.appendChild(empty);
            return;
        }

        cart.forEach(item => {
            const wrapper = document.createElement('div');
            wrapper.innerHTML = templateHtml;
            const article = wrapper.firstElementChild;

            article.dataset.id = item.id;

            const img = article.querySelector('.cart_item_img img');
            img.src = item.image;
            img.alt = item.name;

            article.querySelector('.cart_item_name').textContent = item.name;

            const optionsText = Object.values(item.options || {}).filter(Boolean).join(' / ');
            const qtyText = item.qty > 1 ? ` (x${item.qty})` : '';
            article.querySelector('.cart_item_options').textContent = optionsText + qtyText;

            article.querySelector('.cart_item_price').textContent = `$${(item.price * item.qty).toFixed(2)}`;

            orderListWrap.appendChild(article);
        });
    }

    // ---------------------------------------------------
    // 3. 금액 계산 (소계 / 배송비 / 할인 / 총액)
    // ---------------------------------------------------
    let shippingPrice = 0;
    let discountRate = 0;

    const VALID_COUPONS = {
        'MODE10': 0.1,
        'MODE20': 0.2
    };

    function calcSubtotal() {
        return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    }

    function updateSummary() {
        const subtotal = calcSubtotal();
        const discountAmount = subtotal * discountRate;
        const total = Math.max(subtotal - discountAmount + shippingPrice, 0);

        document.querySelector('.sub_price').textContent = `$${subtotal.toFixed(2)}`;

        const discPriceEl = document.querySelector('.disc_price');
        const couponAppliedEl = document.querySelector('.coupon_applied');
        discPriceEl.textContent = discountAmount > 0 ? `-$${discountAmount.toFixed(2)}` : '$0.00';
        if (couponAppliedEl) couponAppliedEl.parentElement.style.display = discountAmount > 0 ? 'block' : 'none';

        document.querySelector('.shipping_price').textContent = shippingPrice === 0 ? 'Free' : `$${shippingPrice.toFixed(2)}`;
        document.querySelector('.total_price').textContent = `$${total.toFixed(2)}`;

        // GPay 모달 안의 총액도 함께 갱신
        const gpayTotal = document.querySelector('#gpay_overlay .label-l');
        if (gpayTotal) gpayTotal.textContent = `$${total.toFixed(2)}`;
    }

    // ---------------------------------------------------
    // 4. 배송 방법 선택 (하나만 선택되도록 처리)
    // ---------------------------------------------------
    const shippingRows = document.querySelectorAll('.shipping_price_cont .radio_row');
    const shippingRadios = Array.from(shippingRows).map(row => row.querySelector('input[type="radio"]'));

    // HTML에 name 속성이 없어도 그룹으로 동작하도록 강제 지정
    shippingRadios.forEach(radio => {
        radio.name = 'shippingMethod';
    });

    shippingRows.forEach(row => {
        const radio = row.querySelector('input[type="radio"]');

        radio.addEventListener('change', () => {
            // 선택된 하나를 제외한 나머지는 명시적으로 해제
            shippingRadios.forEach(r => {
                if (r !== radio) r.checked = false;
            });
            radio.checked = true;

            shippingRows.forEach(r => r.classList.remove('active'));
            row.classList.add('active');

            shippingPrice = parseFloat(row.dataset.price) || 0;
            updateSummary();
        });

        // radio_row 클릭 시에도 선택되도록 (label 밖 영역 클릭 대비)
        row.addEventListener('click', (e) => {
            if (e.target === radio) return;
            radio.checked = true;
            radio.dispatchEvent(new Event('change'));
        });
    });

    // 초기 상태(checked="checked")에 맞는 row에 active 클래스 부여
    const initialCheckedRow = shippingRows[Array.from(shippingRadios).findIndex(r => r.checked)];
    if (initialCheckedRow) initialCheckedRow.classList.add('active');

    // ---------------------------------------------------
    // 5. 할인 코드 적용
    // ---------------------------------------------------
    const discountInput = document.querySelector('.discount_input_area input');
    const applyBtn = document.querySelector('.discount_input_area .apply_btn');

    applyBtn.addEventListener('click', () => {
        const code = discountInput.value.trim().toUpperCase();

        if (VALID_COUPONS[code]) {
            discountRate = VALID_COUPONS[code];
            showToast('Coupon applied.');
        } else {
            discountRate = 0;
            showToast('Invalid coupon code.');
        }
        updateSummary();
    });

    // ---------------------------------------------------
    // 6. 토스트 메시지
    // ---------------------------------------------------
    const toastEl = document.getElementById('toast');
    let toastTimer;

    function showToast(msg) {
        if (!toastEl) return;
        toastEl.textContent = msg;
        toastEl.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2000);
    }

    // ---------------------------------------------------
    // 7. Google Pay 모달 열기/닫기
    // ---------------------------------------------------
    const modalBackdrop = document.getElementById('modal_backdrop');
    const gpayOverlay = document.getElementById('gpay_overlay');
    // "Express checkout" 섹션 안의 Pay 버튼 (좌측 상단, gpay 아이콘 버튼)
    const gpayOpenBtn = document.querySelector('.left_side section:first-of-type button');
    const gpayCloseBtn = gpayOverlay ? gpayOverlay.querySelector('.head_cont img') : null;

    function openGpayModal() {
        if (!gpayOverlay || !modalBackdrop) return;
        modalBackdrop.hidden = false;
        gpayOverlay.hidden = false;
    }

    function closeGpayModal() {
        if (!gpayOverlay || !modalBackdrop) return;
        modalBackdrop.hidden = true;
        gpayOverlay.hidden = true;
    }

    if (gpayOpenBtn) gpayOpenBtn.addEventListener('click', openGpayModal);
    if (gpayCloseBtn) gpayCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeGpayModal();
    });

    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) closeGpayModal();
        });
    }

    if (gpayOverlay) {
        const gpayPayBtn = gpayOverlay.querySelector('.btn_blue');
        if (gpayPayBtn) {
            gpayPayBtn.addEventListener('click', () => {
                closeGpayModal();
                showToast('Payment completed.');
            });
        }
    }

    // ---------------------------------------------------
    // 8. 일반 결제 버튼 (하단 Pay now)
    // ---------------------------------------------------
    const payNowBtn = document.querySelector('.right_side .btn_blue');
    if (payNowBtn) {
        payNowBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showToast('Your cart is empty.');
                return;
            }
            showToast('Payment completed.');
        });
    }

    // ---------------------------------------------------
    // 9. select_box 드롭다운 (Country/Region, Province)
    // ---------------------------------------------------
    const selectBoxes = document.querySelectorAll('.select_box');

    selectBoxes.forEach(box => {
        const btn = box.querySelector('.select_btn');
        const list = box.querySelector('.option_list');
        const selectedValueEl = box.querySelector('.selected_value');
        const options = list.querySelectorAll('li[role="option"]');

        box.addEventListener('click', (e) => {
            // 옵션 리스트 내부 클릭은 아래 option 클릭 핸들러가 처리하므로 여기서는 무시
            if (list.contains(e.target)) return;

            e.stopPropagation();
            const isOpen = !list.hidden;

            // 다른 열려있는 드롭다운은 먼저 닫기
            document.querySelectorAll('.select_box .option_list').forEach(otherList => {
                if (otherList !== list) {
                    otherList.hidden = true;
                    otherList.closest('.select_box').querySelector('.select_btn').setAttribute('aria-expanded', 'false');
                }
            });

            list.hidden = isOpen;
            btn.setAttribute('aria-expanded', String(!isOpen));
        });

        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();

                options.forEach(o => {
                    o.classList.remove('selected');
                    o.setAttribute('aria-selected', 'false');
                });
                option.classList.add('selected');
                option.setAttribute('aria-selected', 'true');

                selectedValueEl.textContent = option.textContent;

                list.hidden = true;
                btn.setAttribute('aria-expanded', 'false');
            });
        });
    });

    // 드롭다운 바깥 영역 클릭 시 전부 닫기
    document.addEventListener('click', () => {
        document.querySelectorAll('.select_box .option_list').forEach(list => {
            list.hidden = true;
            const btn = list.closest('.select_box').querySelector('.select_btn');
            if (btn) btn.setAttribute('aria-expanded', 'false');
        });
    });

    // ---------------------------------------------------
    // 초기 실행
    // ---------------------------------------------------
    renderOrder();
    updateSummary();
});